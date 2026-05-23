// src/store/seed.js — datos iniciales mock.
// Se cargan en el store la primera vez y se persisten en localStorage.
// Cualquier cambio en la app modifica esta copia.
//
// ROLES ACTIVOS: reception, housekeeping, maintenance, sales, purchasing
// Roles desactivados (sin pantallas): kitchen, concierge, management
// — sus datos están marcados con TODO para no confundir.

export const seed = {
  // ─── Recepción ─────────────────────────────────────────────
  rooms: [
    { id: '101', floor: 1, type: 'Estándar',     status: 'ocupada',  guest: 'Acevedo, F.' },
    { id: '102', floor: 1, type: 'Estándar',     status: 'limpia',   guest: null },
    { id: '118', floor: 1, type: 'Familiar',     status: 'ocupada',  guest: 'Familia Beltrán' },
    { id: '217', floor: 2, type: 'Estándar',     status: 'ocupada',  guest: 'Acevedo, F.' },
    { id: '221', floor: 2, type: 'Estándar',     status: 'checkout', guest: 'Reyes, S.' },
    { id: '304', floor: 3, type: 'Junior Suite', status: 'limpia',   guest: null, vipPending: 'Mendoza' },
    { id: '305', floor: 3, type: 'Estándar',     status: 'sucia',    guest: null },
    { id: '412', floor: 4, type: 'Suite',        status: 'ocupada',  guest: 'López, J.' },
    { id: '510', floor: 5, type: 'Suite',        status: 'limpia',   guest: null, vipPending: 'Tanaka' },
  ],

  // ─── Llegadas del día (Recepción) ─────────────────────────
  arrivals: [
    {
      id: 'A-1', guest: 'Carolina Mendoza', room: '304', vip: true,
      plan: 'Doble Sup. · Desayuno americano',
      stay: '3 noches · MXN 11,520', time: '16:30',
      status: 'warn', statusLabel: 'Hab. en limpieza', done: false,
    },
    {
      id: 'A-2', guest: 'Familia Beltrán', room: '118 + 119', vip: false,
      plan: 'Conectadas · Pensión completa',
      stay: '4 noches · MXN 22,400', time: '17:00',
      status: 'ok', statusLabel: 'Habs listas', done: false,
    },
    {
      id: 'A-3', guest: 'Akira Tanaka', room: '510', vip: true,
      plan: 'Suite Junior · Late check-in',
      stay: '2 noches · MXN 18,600', time: '22:15',
      status: 'info', statusLabel: 'Programada', done: false,
    },
    {
      id: 'A-4', guest: 'Daniel Ortega', room: '208', vip: false,
      plan: 'Sencilla · Plan ejecutivo',
      stay: '1 noche · MXN 2,950', time: '19:40',
      status: 'ok', statusLabel: 'Lista', done: false,
    },
    {
      id: 'A-5', guest: 'Sofia Reyes', room: '221', vip: false,
      plan: 'Doble · Solo hospedaje',
      stay: '2 noches', time: '11:08',
      status: 'ok', statusLabel: 'En habitación', done: true,
    },
  ],

  // ─── Ventas / Reservas ────────────────────────────────────
  reservations: [
    {
      id: 'R-9120', guestName: 'Carolina Mendoza', customerId: 'CUST-001',
      channel: 'Club Julio · Directa', stay: '13–16 may · 3n',
      checkIn: '13 may', checkOut: '16 may', nights: 3,
      room: '304', roomType: 'Doble Superior',
      plan: 'Desayuno americano', amount: 11520,
      status: 'confirmada', vip: true, group: false, today: true,
    },
    {
      id: 'R-9122', guestName: 'Familia Beltrán', customerId: null,
      channel: 'Booking.com', stay: '13–17 may · 4n',
      checkIn: '13 may', checkOut: '17 may', nights: 4,
      room: '118+119', roomType: 'Doble Sup. (×2)',
      plan: 'Pensión completa · 2 habs', amount: 22400,
      status: 'confirmada', vip: false, group: false, today: true,
    },
    {
      id: 'R-9121', guestName: 'Akira Tanaka', customerId: 'CUST-002',
      channel: 'Expedia', stay: '13–15 may · 2n',
      checkIn: '13 may', checkOut: '15 may', nights: 2,
      room: '510', roomType: 'Suite Junior',
      plan: 'Solo hospedaje', amount: 18600,
      status: 'por-confirmar', vip: true, group: false, today: true,
    },
    {
      id: 'R-9180', guestName: 'Cong. Médico AMG · Dr. Iván Solís',
      channel: 'Grupo · contacto Dr. Iván Solís',
      stay: '20–22 may · 32 hab.',
      checkIn: '20 may', checkOut: '22 may', nights: 2,
      room: '—', roomType: 'Bloqueo 32 hab',
      plan: 'Bloqueo + coffee breaks', amount: 248000,
      status: 'seguimiento', vip: false, group: true, today: false,
    },
  ],

  roomTypes: [
    { id: 'doble-sup',    name: 'Doble Superior', pricePerNight: 3840, features: '35 m² · Vista calle · Cama king' },
    { id: 'junior-suite', name: 'Suite Junior',   pricePerNight: 5200, features: '48 m² · Vista jardín · Salón' },
    { id: 'suite-pal',    name: 'Suite Palacio',  pricePerNight: 8900, features: '68 m² · Jacuzzi · Terraza' },
  ],

  customers: [
    {
      id: 'CUST-001', name: 'Carolina Mendoza', tier: 'oro', vip: true,
      since: 2022, stays: 5, lifetimeRevenue: 182000, nps: 9.4,
      contact: '+52 55 8421 0033 · WhatsApp',
      insights: [
        { icon: 'coffee', text: 'Pide café americano sin azúcar' },
        { icon: 'flame',  text: 'Alérgica a frutos secos', tone: 'danger' },
        { icon: 'bed',    text: 'Almohadas firmes · cama doble' },
        { icon: 'star',   text: 'Aniversario el 14 de mayo', tone: 'brass' },
      ],
      previousStays: [
        { date: 'Nov 2025', room: '412', rating: '9',  plan: 'Med. pensión' },
        { date: 'May 2025', room: '304', rating: '10', plan: 'Desayuno · aniv.' },
        { date: 'Sep 2024', room: '221', rating: '9',  plan: 'Solo hosp.' },
      ],
    },
    {
      id: 'CUST-002', name: 'Akira Tanaka', tier: 'plata', vip: true,
      since: 2024, stays: 2, lifetimeRevenue: 36000, nps: 9.0,
      contact: 'a.tanaka@example.jp',
      insights: [
        { icon: 'flame',  text: 'Alergia mariscos (esposa)', tone: 'danger' },
        { icon: 'coffee', text: 'Sake japonés preferido' },
      ],
      previousStays: [
        { date: 'Mar 2024', room: '510', rating: '9', plan: 'Solo hosp.' },
      ],
    },
  ],

  // ─── Mantenimiento ─────────────────────────────────────────
  // acks: { maintenance: <ISO timestamp cuando Mant. confirma recibido> }
  tickets: [
    {
      id: 'M-217', room: '217', category: 'Plomería',
      desc: 'Inodoro no descarga · hab. en uso',
      reportedBy: 'housekeeping', reporter: 'Mariana C.',
      sla: '00:24', status: 'abierto', priority: 'alta',
      reportedAt: '14:08',
      acks: { maintenance: null },
    },
    {
      id: 'M-304', room: '304', category: 'Plomería',
      desc: 'Lavabo gotea, no urgente',
      reportedBy: 'housekeeping', reporter: 'Mariana C.',
      sla: '03:12', status: 'aceptado', priority: 'media',
      progress: 20, reportedAt: '13:40',
      acks: { maintenance: '2026-05-14T13:45:00' },
    },
    {
      id: 'M-S07', room: '510', category: 'Climatización',
      desc: 'Revisión preventiva A/C',
      reportedBy: 'maintenance', sla: 'hoy', status: 'programado', priority: 'media',
      acks: { maintenance: null },
    },
    {
      id: 'M-S14', room: 'Lobby', category: 'Iluminación',
      desc: '2 lámparas LED quemadas en pasillo norte',
      reportedBy: 'housekeeping', sla: 'hoy', status: 'programado', priority: 'baja',
      acks: { maintenance: null },
    },
    {
      id: 'M-S22', room: 'Piscina', category: 'Equipos',
      desc: 'Filtración: cambio de cartuchos',
      reportedBy: 'maintenance', sla: 'mañana 06:00', status: 'programado', priority: 'baja',
      acks: { maintenance: null },
    },
    // Cerrados (historial)
    {
      id: 'M-412', room: '412', category: 'Climatización',
      desc: 'Aire acond. ruidoso', status: 'cerrado', priority: 'media',
      closedAt: 'Ayer · 17:20', duration: '38m',
      acks: { maintenance: '2026-05-13T14:00:00' },
    },
    {
      id: 'M-118', room: '118', category: 'Mobiliario',
      desc: 'Ventana atorada', status: 'cerrado', priority: 'baja',
      closedAt: 'Ayer · 11:04', duration: '22m',
      acks: { maintenance: '2026-05-13T10:10:00' },
    },
    {
      id: 'M-S03', room: 'Pasillo 2', category: 'Iluminación',
      desc: 'Foco quemado x3', status: 'cerrado', priority: 'baja',
      closedAt: '11 may · 09:14', duration: '14m',
      acks: { maintenance: '2026-05-11T09:00:00' },
    },
  ],

  // ─── Limpieza ─────────────────────────────────────────────
  tasks: [
    {
      id: 'HK-304', room: '304', type: 'salida-vip',
      typeLabel: 'Salida → Entrada VIP',
      status: 'en-curso', priority: 'alta',
      note: 'Llegada de Sra. Mendoza · Desayuno americano · Plus amenities aniversario',
      sla: 'ETA 14:20 · 1h 12m',
      tags: ['VIP', 'Aniversario', 'Sin frutos secos'],
      assignedTo: 'Mariana C.',
      progress: 7, total: 12,
    },
    {
      id: 'HK-217', room: '217', type: 'stayover',
      typeLabel: 'Stayover',
      status: 'pendiente', priority: 'media',
      sla: 'Antes de 12:00',
      tags: ['Cambio toallas', 'Reposición'],
    },
    {
      id: 'HK-412', room: '412', type: 'minibar',
      typeLabel: 'Re-stock minibar',
      status: 'pendiente', priority: 'baja',
      sla: 'Hoy',
      tags: ['Mantenim. liberó'],
    },
    { id: 'HK-221', room: '221', type: 'stayover',  typeLabel: 'Stayover',    status: 'completada', completedAt: '11:08' },
    { id: 'HK-305', room: '305', type: 'salida',    typeLabel: 'Salida',      status: 'completada', completedAt: '10:42' },
    { id: 'HK-309', room: '309', type: 'salida',    typeLabel: 'Salida',      status: 'completada', completedAt: '10:18' },
    { id: 'HK-208', room: '208', type: 'llegada',   typeLabel: 'Llegada VIP', status: 'completada', completedAt: '09:54' },
  ],

  // ─── ORDENES DE EVENTO (entidad central) ─────────────────
  // acks: cada área marca ISO timestamp cuando confirma haber recibido el evento.
  // null = pendiente, string ISO = confirmado.
  events: [
    {
      id: 'EVT-001',
      name: 'Cena de gala · Congreso AMG',
      date: '2026-05-20',
      time: '20:00',
      salon: 'Salón Palacio',
      pax: 80,
      client: 'Dr. Iván Solís · Cong. Médico AMG',
      createdBy: 'sales',
      menu: 'Menú ejecutivo 3 tiempos · vino de mesa incluido',
      allergens: 'Gluten (2 pax) · Lactosa (1 pax)',
      notes: 'Montar desde las 17:00. Cabina de proyección requerida. Pantalla 3×2 m.',
      status: 'confirmado',
      acks: {
        housekeeping:  '2026-05-14T09:12:00',
        maintenance:   null,
        reception:     '2026-05-14T10:05:00',
        purchasing:    null,
      },
    },
    {
      id: 'EVT-002',
      name: 'Desayuno ejecutivo · Bienvenida directivos',
      date: '2026-05-22',
      time: '08:30',
      salon: 'Terraza Norte',
      pax: 18,
      client: 'Grupo Constructora Pedraza',
      createdBy: 'sales',
      menu: 'Buffet continental + estación de café',
      allergens: 'Sin frutos secos (3 pax)',
      notes: 'Solicitar mantel dorado. Flores centro de mesa. Micrófonos no requeridos.',
      status: 'confirmado',
      acks: {
        housekeeping:  null,
        maintenance:   null,
        reception:     null,
        purchasing:    null,
      },
    },
    {
      id: 'EVT-003',
      name: 'Coctel de cumpleaños · Familia Reyes',
      date: '2026-05-28',
      time: '19:00',
      salon: 'Jardín Principal',
      pax: 35,
      client: 'Familia Reyes',
      createdBy: 'sales',
      menu: 'Cocteles y bocadillos · barra abierta 3h',
      allergens: 'Ninguno reportado',
      notes: 'Arreglo de globos incluido. Pastel 3 pisos llega 18:30 — coordinar con Recepción.',
      status: 'borrador',
      acks: {
        housekeeping:  null,
        maintenance:   null,
        reception:     null,
        purchasing:    null,
      },
    },
  ],

  // ─── COMENTARIOS CONTEXTUALES ──────────────────────────────
  // Conversación hilada atada a un objeto del store.
  // entityType: 'ticket' | 'event'
  comments: [
    {
      id: 'CMT-001', entityType: 'ticket', entityId: 'M-217',
      author: 'Lucía Ramírez', role: 'reception',
      body: 'El huésped ya fue avisado, acepta la reparación entre 14–16h.',
      at: '2026-05-14T14:15:00',
    },
    {
      id: 'CMT-002', entityType: 'event', entityId: 'EVT-001',
      author: 'Eduardo Galindo', role: 'maintenance',
      body: 'Confirmo que la cabina de proyección estará lista desde las 16:30.',
      at: '2026-05-14T11:02:00',
    },
    {
      id: 'CMT-003', entityType: 'event', entityId: 'EVT-001',
      author: 'Mariana Cruz', role: 'housekeeping',
      body: 'Comenzamos montaje del Salón Palacio el martes 19 desde las 15h.',
      at: '2026-05-14T11:30:00',
    },
  ],

  // ─── COMPRAS — Requisiciones ──────────────────────────────
  // Estado: 'pedido' → 'en-camino' → 'surtido'
  requisitions: [
    {
      id: 'REQ-001', area: 'maintenance',
      item: 'Sello universal 3" (plomería)', qty: 6,
      requestedBy: 'Eduardo Galindo',
      status: 'surtido',
      createdAt: '2026-05-10T08:00:00', updatedAt: '2026-05-11T10:30:00',
    },
    {
      id: 'REQ-002', area: 'maintenance',
      item: 'Cartuchos filtro piscina', qty: 2,
      requestedBy: 'Eduardo Galindo',
      status: 'en-camino',
      createdAt: '2026-05-13T09:15:00', updatedAt: '2026-05-13T14:00:00',
    },
    {
      id: 'REQ-003', area: 'housekeeping',
      item: 'Amenities shampoo 30ml (×200)', qty: 200,
      requestedBy: 'Mariana Cruz',
      status: 'pedido',
      createdAt: '2026-05-14T07:30:00', updatedAt: '2026-05-14T07:30:00',
    },
    {
      id: 'REQ-004', area: 'maintenance',
      item: 'Lámparas LED 10W luz cálida', qty: 20,
      requestedBy: 'Eduardo Galindo',
      status: 'pedido',
      createdAt: '2026-05-14T10:00:00', updatedAt: '2026-05-14T10:00:00',
    },
  ],

  // ─── TODO: sin rol activo — datos mínimos para no romper ──
  // Activar cuando se implemente el rol Concierge.
  requests: [],

  // TODO: activar cuando se implemente el rol Cocina.
  orders: [],
  pendingOrderAlert: null,
};
