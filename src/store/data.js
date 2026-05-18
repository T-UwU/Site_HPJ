// src/store/data.js — estado operativo del hotel.
// Acciones para crear/mutar/cerrar tickets, peticiones, tareas, etc.
//
// Patrón mínimo: cada "tabla" tiene { add, update, remove }.
// Las pantallas leen con useData(s => s.requests) y mutan con useData(s => s.actions.addRequest).
//
// Nota: persistido en localStorage. Si cambias el shape del seed, sube `version`
// para que se borre el cache viejo en los clientes.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { seed } from './seed';

const logActivity = (role, actor, action, room, refId) => {
  // Lazy import to avoid circular dep at module load time
  import('./activity.js').then(({ useActivity }) => {
    useActivity.getState().log(role, actor, action, room, refId);
  });
};

const upsert = (list, id, patch) =>
  list.map((it) => (it.id === id ? { ...it, ...patch } : it));

export const useData = create(
  persist(
    (set, get) => ({
      ...seed,

      actions: {
        // ── Peticiones (concierge) ────────────────────────
        addRequest: (req) =>
          set((s) => ({ requests: [{ id: `C-${Date.now()}`, ...req }, ...s.requests] })),
        updateRequest: (id, patch) =>
          set((s) => ({ requests: upsert(s.requests, id, patch) })),
        assignRequest: (id, assignedTo) =>
          set((s) => ({ requests: upsert(s.requests, id, { assignedTo, status: 'en-progreso' }) })),
        completeRequest: (id) =>
          set((s) => ({ requests: upsert(s.requests, id, { status: 'completada' }) })),

        // ── Tickets (mantenimiento) ───────────────────────
        addTicket: (t) => {
          const id = `M-${Date.now()}`;
          set((s) => ({ tickets: [{ id, ...t }, ...s.tickets] }));
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

        // ── Tareas (limpieza) ─────────────────────────────
        startTask: (id, assignedTo) =>
          set((s) => ({ tasks: upsert(s.tasks, id, { status: 'en-curso', assignedTo, progress: 0 }) })),
        progressTask: (id, progress) =>
          set((s) => ({ tasks: upsert(s.tasks, id, { progress }) })),
        completeTask: (id) => {
          const task = get().tasks.find((t) => t.id === id);
          set((s) => ({ tasks: upsert(s.tasks, id, { status: 'completada', progress: 100 }) }));
          logActivity('housekeeping', task?.assignedTo || 'Limpieza', `Hab lista: ${task?.typeLabel || task?.type || 'Tarea'}`, task?.room, id);
        },

        // ── Habitaciones ──────────────────────────────────
        setRoomStatus: (id, status) =>
          set((s) => ({ rooms: upsert(s.rooms, id, { status }) })),

        // ── Llegadas (Recepción) ──────────────────────────
        markArrived: (id) => {
          const arrival = get().arrivals.find((a) => a.id === id);
          set((s) => ({ arrivals: upsert(s.arrivals, id, { done: true, statusLabel: 'En habitación', status: 'ok' }) }));
          logActivity('reception', 'Recepción', `Check-in: ${arrival?.guest || '—'}`, arrival?.room, id);
        },

        // ── Cocina ────────────────────────────────────────
        startOrder: (id) =>
          set((s) => ({ orders: upsert(s.orders, id, { status: 'preparing' }) })),
        markOrderReady: (id) =>
          set((s) => ({ orders: upsert(s.orders, id, { status: 'ready' }) })),
        sendOrder: (id) =>
          set((s) => ({ orders: upsert(s.orders, id, { status: 'sent' }) })),
        // Avanza el estado de un item (pending → cooking → ready)
        cycleOrderItem: (orderId, itemIndex) =>
          set((s) => ({
            orders: s.orders.map((o) => {
              if (o.id !== orderId) return o;
              const items = (o.items || []).map((it, i) => {
                if (i !== itemIndex) return it;
                const next = it.status === 'pending' ? 'cooking'
                  : it.status === 'cooking' ? 'ready'
                  : 'pending';
                return { ...it, status: next };
              });
              return { ...o, items };
            }),
          })),
        // Acepta la alerta entrante y la convierte en orden real
        acceptPendingOrder: () =>
          set((s) => {
            if (!s.pendingOrderAlert) return {};
            const a = s.pendingOrderAlert;
            const newOrder = {
              id: `O-${a.room}-${Date.now()}`,
              room: a.room, guest: a.guest,
              type: a.summary, mealKind: 'desayuno',
              time: a.dates.split(' · ')[1] || '07:30',
              timeLabel: a.dates,
              status: 'queued',
              note: a.allergyText,
              allergen: !!a.allergyText,
              items: [],
            };
            return { orders: [newOrder, ...s.orders], pendingOrderAlert: null };
          }),

        // ── Ventas ────────────────────────────────────────
        addReservation: (r) => {
          const id = `R-${Date.now()}`;
          set((s) => ({ reservations: [{ id, ...r }, ...s.reservations] }));
          const origin = r.channel?.includes('Recepción') ? 'reception' : 'sales';
          logActivity(origin, r.channel || 'Ventas', `Reserva: ${r.guestName || '—'} · ${r.stay || ''}`, r.room, id);
        },
        confirmReservation: (id) => {
          const res = get().reservations.find((r) => r.id === id);
          set((s) => ({ reservations: upsert(s.reservations, id, { status: 'confirmada' }) }));
          logActivity('sales', 'Ventas', `Reserva confirmada: ${res?.guestName || id}`, res?.room, id);
        },

        // ── Reset total (útil en dev) ─────────────────────
        resetAll: () => set({ ...seed }),
      },
    }),
    {
      name: 'hpj.data',
      version: 6, // bump cuando cambies la forma del seed
      partialize: (s) => {
        // No persistimos `actions` (son funciones).
        const { actions, ...rest } = s;
        return rest;
      },
    }
  )
);

// Atajos de selección
export const useRooms        = () => useData((s) => s.rooms);
export const useRequests     = () => useData((s) => s.requests);
export const useTickets      = () => useData((s) => s.tickets);
export const useTasks        = () => useData((s) => s.tasks);
export const useOrders       = () => useData((s) => s.orders);
export const useReservations = () => useData((s) => s.reservations);
export const useArrivals     = () => useData((s) => s.arrivals);
export const useCustomers    = () => useData((s) => s.customers);
export const useRoomTypes    = () => useData((s) => s.roomTypes);
export const useActions      = () => useData((s) => s.actions);
