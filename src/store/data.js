// src/store/data.js — estado operativo del hotel.
//
// Patrón mínimo: cada "tabla" tiene { add, update, remove }.
// Las pantallas leen con useData(s => s.tickets) y mutan con useActions().
//
// Nota: persistido en localStorage. Si cambias el shape del seed, sube `version`
// para que se borre el cache viejo en los clientes.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { seed } from './seed';

const upsert = (list, id, patch) =>
  list.map((it) => (it.id === id ? { ...it, ...patch } : it));

// Función auxiliar para registrar actividad sin importación circular
const logActivity = (role, actor, action, room, refId) => {
  import('./activity.js').then(({ useActivity }) => {
    useActivity.getState().log(role, actor, action, room, refId);
  });
};

export const useData = create(
  persist(
    (set, get) => ({
      ...seed,

      actions: {
        // ── Tickets (mantenimiento) ───────────────────────
        addTicket: (t) => {
          const id = `M-${Date.now()}`;
          // Los tickets nuevos nacen con acuse pendiente
          const ticket = { id, acks: { maintenance: null }, ...t };
          set((s) => ({ tickets: [ticket, ...s.tickets] }));
          logActivity(
            t.reportedBy || 'maintenance',
            t.reporter   || '—',
            `Ticket creado: ${t.desc || t.category || 'Sin descripción'}`,
            t.room, id
          );
        },
        acceptTicket: (id) =>
          set((s) => ({ tickets: upsert(s.tickets, id, { status: 'aceptado', progress: 0 }) })),
        progressTicket: (id, progress) =>
          set((s) => ({ tickets: upsert(s.tickets, id, { progress }) })),
        closeTicket: (id) => {
          const ticket = get().tickets.find((t) => t.id === id);
          set((s) => ({ tickets: upsert(s.tickets, id, { status: 'cerrado' }) }));
          logActivity('maintenance', '—', `Ticket cerrado: ${ticket?.desc || id}`, ticket?.room, id);
        },
        // Acuse de recibido en ticket — sella timestamp por rol
        ackTicket: (id, role) => {
          const at = new Date().toISOString();
          set((s) => ({
            tickets: s.tickets.map((t) => {
              if (t.id !== id) return t;
              return { ...t, acks: { ...(t.acks || {}), [role]: at } };
            }),
          }));
        },

        // ── Tareas (limpieza) ─────────────────────────────
        startTask: (id, assignedTo) =>
          set((s) => ({ tasks: upsert(s.tasks, id, { status: 'en-curso', assignedTo, progress: 0 }) })),
        progressTask: (id, progress) =>
          set((s) => ({ tasks: upsert(s.tasks, id, { progress }) })),
        completeTask: (id) => {
          const task = get().tasks.find((t) => t.id === id);
          set((s) => ({ tasks: upsert(s.tasks, id, { status: 'completada', progress: 100 }) }));
          logActivity('housekeeping', task?.assignedTo || 'Limpieza',
            `Hab lista: ${task?.typeLabel || task?.type || 'Tarea'}`, task?.room, id);
        },

        // ── Habitaciones ──────────────────────────────────
        setRoomStatus: (id, status) =>
          set((s) => ({ rooms: upsert(s.rooms, id, { status }) })),

        // ── Llegadas (Recepción) ──────────────────────────
        markArrived: (id) => {
          const arrival = get().arrivals.find((a) => a.id === id);
          set((s) => ({
            arrivals: upsert(s.arrivals, id, { done: true, statusLabel: 'En habitación', status: 'ok' }),
          }));
          logActivity('reception', 'Recepción', `Check-in: ${arrival?.guest || '—'}`, arrival?.room, id);
        },

        // ── Ventas / Reservas ─────────────────────────────
        addReservation: (r) => {
          const id = `R-${Date.now()}`;
          set((s) => ({ reservations: [{ id, ...r }, ...s.reservations] }));
          const origin = r.channel?.includes('Recepción') ? 'reception' : 'sales';
          logActivity(origin, r.channel || 'Ventas',
            `Reserva: ${r.guestName || '—'} · ${r.stay || ''}`, r.room, id);
        },
        confirmReservation: (id) => {
          const res = get().reservations.find((r) => r.id === id);
          set((s) => ({ reservations: upsert(s.reservations, id, { status: 'confirmada' }) }));
          logActivity('sales', 'Ventas', `Reserva confirmada: ${res?.guestName || id}`, res?.room, id);
        },

        // ── Ordenes de Evento (entidad central) ───────────
        addEvent: (ev) => {
          const id = `EVT-${Date.now()}`;
          const evento = {
            id,
            acks: { housekeeping: null, maintenance: null, reception: null, purchasing: null },
            ...ev,
          };
          set((s) => ({ events: [evento, ...s.events] }));
          logActivity('sales', ev.createdBy || 'Ventas',
            `Nuevo evento: ${ev.name || '—'} · ${ev.pax || 0} pax`, ev.salon, id);
        },
        updateEvent: (id, patch) =>
          set((s) => ({ events: upsert(s.events, id, patch) })),
        // Acuse de recibido — sella timestamp y registra actividad destacada
        confirmEventAck: (eventId, role) => {
          const at = new Date().toISOString();
          const ev = get().events.find((e) => e.id === eventId);
          set((s) => ({
            events: s.events.map((e) => {
              if (e.id !== eventId) return e;
              return { ...e, acks: { ...e.acks, [role]: at } };
            }),
          }));
          logActivity(role, '—', `Acuse recibido: ${ev?.name || eventId}`, ev?.salon, eventId);
        },
        // Cambio de comensales — dato crítico, registra actividad destacada
        changeEventPax: (eventId, newPax) => {
          const ev = get().events.find((e) => e.id === eventId);
          const oldPax = ev?.pax ?? '?';
          set((s) => ({ events: upsert(s.events, eventId, { pax: newPax }) }));
          logActivity('sales', 'Ventas',
            `⚠ Cambio de pax: ${oldPax} → ${newPax} · ${ev?.name || eventId}`,
            ev?.salon, eventId);
        },

        // ── Comentarios contextuales ──────────────────────
        addComment: ({ entityType, entityId, author, role, body }) =>
          set((s) => ({
            comments: [
              ...s.comments,
              { id: `CMT-${Date.now()}`, entityType, entityId, author, role, body, at: new Date().toISOString() },
            ],
          })),

        // ── Compras — Requisiciones ───────────────────────
        addRequisition: (r) => {
          const id = `REQ-${Date.now()}`;
          const now = new Date().toISOString();
          set((s) => ({
            requisitions: [{ id, status: 'pedido', createdAt: now, updatedAt: now, ...r }, ...s.requisitions],
          }));
          logActivity(r.area || 'purchasing', r.requestedBy || '—',
            `Requisición: ${r.item || '—'} (×${r.qty || 1})`, null, id);
        },
        updateRequisitionStatus: (id, status) => {
          const now = new Date().toISOString();
          set((s) => ({ requisitions: upsert(s.requisitions, id, { status, updatedAt: now }) }));
          const req = get().requisitions.find((r) => r.id === id);
          logActivity('purchasing', 'Compras',
            `Requisición ${status}: ${req?.item || id}`, null, id);
        },

        // ── Peticiones Concierge (TODO: sin rol activo) ───
        addRequest: (req) =>
          set((s) => ({ requests: [{ id: `C-${Date.now()}`, ...req }, ...s.requests] })),

        // ── Cocina (TODO: sin rol activo) ─────────────────
        startOrder: () => {},
        markOrderReady: () => {},

        // ── Reset total (útil en dev) ─────────────────────
        resetAll: () => set({ ...seed }),
      },
    }),
    {
      name: 'hpj.data',
      version: 8, // subido a 8: nuevo shape con events, comments, requisitions, acks en tickets
      partialize: (s) => {
        const { actions, ...rest } = s;
        return rest;
      },
    }
  )
);

// ── Selectores ────────────────────────────────────────────────
export const useRooms        = () => useData((s) => s.rooms);
export const useTickets      = () => useData((s) => s.tickets);
export const useTasks        = () => useData((s) => s.tasks);
export const useReservations = () => useData((s) => s.reservations);
export const useArrivals     = () => useData((s) => s.arrivals);
export const useCustomers    = () => useData((s) => s.customers);
export const useRoomTypes    = () => useData((s) => s.roomTypes);
export const useEvents       = () => useData((s) => s.events);
export const useRequisitions = () => useData((s) => s.requisitions);
// TODO: activar cuando haya rol activo
export const useRequests     = () => useData((s) => s.requests);
export const useOrders       = () => useData((s) => s.orders);
export const useActions      = () => useData((s) => s.actions);

// Selector de comentarios filtrado por entidad
export const useComments = (entityType, entityId) =>
  useData((s) => s.comments.filter((c) => c.entityType === entityType && c.entityId === entityId));
