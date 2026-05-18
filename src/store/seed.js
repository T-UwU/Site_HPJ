// src/store/seed.js — datos iniciales mock. Se cargan en el store la primera vez
// y se persisten en localStorage. Cualquier cambio en la app modifica esta copia.

export const seed = {
  // ─── Recepción ─────────────────────────────────────────────
  rooms: [
    // 1 = sucia, 2 = limpia, 3 = ocupada, 4 = bloqueada
    { id: '101', floor: 1, type: 'Estándar',  status: 'ocupada',  guest: 'Acevedo, F.' },
    { id: '102', floor: 1, type: 'Estándar',  status: 'limpia',   guest: null },
    { id: '118', floor: 1, type: 'Familiar',  status: 'ocupada',  guest: 'Familia Beltrán' },
    { id: '217', floor: 2, type: 'Estándar',  status: 'ocupada',  guest: 'Acevedo, F.' },
    { id: '221', floor: 2, type: 'Estándar',  status: 'checkout', guest: 'Reyes, S.' },
    { id: '304', floor: 3, type: 'Junior Suite', status: 'limpia', guest: null, vipPending: 'Mendoza' },
    { id: '305', floor: 3, type: 'Estándar',  status: 'sucia',    guest: null },
    { id: '412', floor: 4, type: 'Suite',     status: 'ocupada',  guest: 'López, J.' },
    { id: '510', floor: 5, type: 'Suite',     status: 'limpia',   guest: null, vipPending: 'Tanaka' },
  ],

  // ─── Concierge ─────────────────────────────────────────────
  requests: [
    {
      id: 'C-2304', type: 'Cortesía aniversario', icon: 'star',
      guest: 'Carolina Mendoza', room: '304', vip: true,
      detail: 'Botella espumoso · nota manuscrita · sin frutos secos',
      assignedTo: 'Diego A.', sla: 'Antes de 16:30',
      status: 'en-progreso', priority: 'alta', urgent: true,
      createdAt: '2026-05-14T13:24:00',
    },
    {
      id: 'C-2305', type: 'Reserva restaurante', icon: 'coffee',
      guest: 'Akira Tanaka', room: '510',
      detail: 'Cena para 2 · 21:30 · ventanas al jardín',
      assignedTo: null, sla: 'ASAP',
      status: 'por-asignar', priority: 'alta', urgent: true,
      createdAt: '2026-05-14T14:02:00',
    },
    {
      id: 'C-2306', type: 'Traslado al aeropuerto', icon: 'car',
      guest: 'Familia Beltrán', room: '118',
      detail: '17 may · 06:00 · 4 pax + maletas grandes',
      assignedTo: 'Luis O.', sla: '17 may',
      status: 'programada', priority: 'media', urgent: false,
      createdAt: '2026-05-13T19:10:00',
    },
    {
      id: 'C-2307', type: 'Servicio de equipaje', icon: 'bag',
      guest: 'Sofía Reyes', room: '221',
      detail: 'Recoger equipaje 12:00 — checkout',
      assignedTo: 'Bell desk', sla: '12:00',
      status: 'programada', priority: 'media', urgent: false,
      createdAt: '2026-05-14T09:30:00',
    },
    {
      id: 'C-2308', type: 'Spa · masaje deep tissue', icon: 'sparkle',
      guest: 'López, J.', room: '412',
      detail: '14 may · 11:00 · masaje 90 min · terapeuta varón',
      assignedTo: 'Spa · Carla', sla: '14 may',
      status: 'confirmada', priority: 'media', urgent: false,
      createdAt: '2026-05-13T20:05:00',
    },
  ],

  // ─── Mantenimiento ────────────────────────────────────────
  tickets: [
    {
      id: 'M-217', room: '217', category: 'Plomería',
      desc: 'Inodoro no descarga · hab. en uso',
      reportedBy: 'housekeeping', reporter: 'Mariana C.',
      sla: '00:24', status: 'abierto', priority: 'alta',
      reportedAt: '14:08',
    },
    {
      id: 'M-304', room: '304', category: 'Plomería',
      desc: 'Lavabo gotea, no urgente',
      reportedBy: 'housekeeping', reporter: 'Mariana C.',
      sla: '03:12', status: 'aceptado', priority: 'media',
      progress: 20, reportedAt: '13:40',
    },
    {
      id: 'M-S07', room: '510', category: 'Climatización',
      desc: 'Revisión preventiva A/C',
      reportedBy: 'management', sla: 'hoy', status: 'programado', priority: 'media',
    },
    {
      id: 'M-S14', room: 'Lobby', category: 'Iluminación',
      desc: '2 lámparas LED quemadas en pasillo norte',
      reportedBy: 'housekeeping', sla: 'hoy', status: 'programado', priority: 'baja',
    },
    {
      id: 'M-S22', room: 'Piscina', category: 'Equipos',
      desc: 'Filtración: cambio de cartuchos',
      reportedBy: 'management', sla: 'mañana 06:00', status: 'programado', priority: 'baja',
    },
    // ── Cerrados (historial) ──
    {
      id: 'M-412', room: '412', category: 'Climatización',
      desc: 'Aire acond. ruidoso', status: 'cerrado', priority: 'media',
      closedAt: 'Ayer · 17:20', duration: '38m',
    },
    {
      id: 'M-118', room: '118', category: 'Mobiliario',
      desc: 'Ventana atorada', status: 'cerrado', priority: 'baja',
      closedAt: 'Ayer · 11:04', duration: '22m',
    },
    {
      id: 'M-S03', room: 'Pasillo 2', category: 'Iluminación',
      desc: 'Foco quemado x3', status: 'cerrado', priority: 'baja',
      closedAt: '11 may · 09:14', duration: '14m',
    },
    {
      id: 'M-505', room: '505', category: 'Electricidad',
      desc: 'TV no enciende', status: 'cerrado', priority: 'media',
      closedAt: '11 may · 16:30', duration: '55m', warranty: true,
    },
    {
      id: 'M-Spa', room: 'SPA', category: 'Equipos',
      desc: 'Sauna · sensor temp.', status: 'cerrado', priority: 'media',
      closedAt: '10 may · 08:00', duration: '2h 18m',
    },
  ],

  // ─── Limpieza ─────────────────────────────────────────────
  tasks: [
    // Pendientes
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
    // Completadas hoy
    { id: 'HK-221', room: '221', type: 'stayover', typeLabel: 'Stayover',    status: 'completada', completedAt: '11:08' },
    { id: 'HK-305', room: '305', type: 'salida',   typeLabel: 'Salida',      status: 'completada', completedAt: '10:42' },
    { id: 'HK-309', room: '309', type: 'salida',   typeLabel: 'Salida',      status: 'completada', completedAt: '10:18' },
    { id: 'HK-208', room: '208', type: 'llegada',  typeLabel: 'Llegada VIP', status: 'completada', completedAt: '09:54' },
  ],

  // ─── Cocina ───────────────────────────────────────────────
  // Modelo: cada order tiene items (platillos) con estación + estado individual.
  // status del order: queued | preparing | ready | sent
  // status del item:  pending | cooking | ready
  orders: [
    {
      id: 'O-304-001', room: '304', guest: 'Sra. Mendoza', vip: true,
      type: 'Desayuno americano', mealKind: 'desayuno',
      time: '07:30', timeLabel: '07:30 mañana',
      status: 'preparing',
      note: 'Sin frutos secos · cortesía aniversario',
      allergen: true, allergyText: 'FRUTOS SECOS',
      repeat: '14, 15, 16 mayo (3 días)',
      prepTime: '18 min',
      startBy: '07:12',
      deliveryVia: 'Room service · Pablo',
      acceptedAt: '14:32',
      items: [
        { name: 'Huevos al gusto · revueltos',        sub: '2 unidades · técnica suave',                       station: 'Caliente',  qty: 2, status: 'cooking' },
        { name: 'Tocino crujiente',                    sub: '3 tiras · entreverado',                            station: 'Caliente',  qty: 3, status: 'ready' },
        { name: 'Pan tostado · sin frutos secos',      sub: 'Bollo francés · NO masa madre nueces',             station: 'Panadería', qty: 1, status: 'pending', allergen: true },
        { name: 'Hash browns',                         sub: 'Acompañante',                                       station: 'Caliente',  qty: 1, status: 'cooking' },
        { name: 'Frutas de temporada',                 sub: 'Sin almendras ni nueces',                          station: 'Frío',      qty: 1, status: 'pending', allergen: true },
        { name: 'Café americano + jugo de naranja',    sub: 'Sin azúcar · 200ml',                               station: 'Bar',       qty: 1, status: 'pending' },
      ],
    },
    {
      id: 'O-510-002', room: '510', guest: 'Sra. Vega',
      type: 'Room service · brunch', mealKind: 'room-service',
      time: '11:15', timeLabel: '11:15',
      status: 'sent',
      note: 'Aguacate doble · pan tostado',
      items: [],
    },
    {
      id: 'O-T04-003', room: '—', guest: 'Mesa T-04 · Sr. Beltrán', vip: true,
      type: 'Cena privada · terraza', mealKind: 'cena',
      time: '20:00', timeLabel: '20:00',
      status: 'queued',
      note: 'Menú degustación 6 tiempos',
      items: [],
    },
    {
      id: 'O-118-004', room: '118', guest: 'Familia Beltrán',
      type: 'Desayuno continental', mealKind: 'desayuno',
      time: '08:00', timeLabel: '08:00 mañana',
      status: 'queued',
      items: [],
    },
    // Schedule de desayunos para Breakfast view
    { id: 'O-201-005', room: '201', guest: 'Carrasco', type: 'Continental',                          mealKind: 'desayuno', time: '07:00', status: 'ready' },
    { id: 'O-208-006', room: '208', guest: 'Ortega',   type: 'Americano',                            mealKind: 'desayuno', time: '07:00', status: 'ready' },
    { id: 'O-305-007', room: '305', guest: 'Schwartz', type: 'Continental · café descaf.',           mealKind: 'desayuno', time: '07:30', status: 'preparing' },
    { id: 'O-221-008', room: '221', guest: 'Reyes',    type: 'Vegano',                                mealKind: 'desayuno', time: '07:30', status: 'preparing' },
    { id: 'O-119-009', room: '119', guest: 'Beltrán (×2)', type: 'Americano',                        mealKind: 'desayuno', time: '08:00', status: 'queued' },
    { id: 'O-402-010', room: '402', guest: 'Liu',      type: 'Sin gluten',                            mealKind: 'desayuno', time: '08:00', status: 'queued', allergen: true },
    { id: 'O-510-011', room: '510', guest: 'Tanaka',   type: 'Continental + tarde',                   mealKind: 'desayuno', time: '08:30', status: 'queued' },
    { id: 'O-412-012', room: '412', guest: 'López',    type: 'Americano',                             mealKind: 'desayuno', time: '08:30', status: 'queued' },
  ],

  // Nueva orden entrante (banner en Today) — se acepta y se convierte
  // en una order real
  pendingOrderAlert: {
    from: 'reception',
    room: '304', guest: 'Sra. Mendoza',
    summary: '3 desayunos americanos',
    dates: '13–15 may · 7:30',
    allergyText: 'ALERGIA frutos secos',
  },

  // ─── Ventas / Reservas ────────────────────────────────────
  reservations: [
    // Llegan hoy
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
    // Próximos 7 días
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

  // Catálogo de tipos de habitación (para Nueva reserva)
  roomTypes: [
    { id: 'doble-sup',    name: 'Doble Superior', pricePerNight: 3840, features: '35 m² · Vista calle · Cama king' },
    { id: 'junior-suite', name: 'Suite Junior',   pricePerNight: 5200, features: '48 m² · Vista jardín · Salón' },
    { id: 'suite-pal',    name: 'Suite Palacio',  pricePerNight: 8900, features: '68 m² · Jacuzzi · Terraza' },
  ],

  // Clientes recurrentes / VIPs
  customers: [
    {
      id: 'CUST-001', name: 'Carolina Mendoza', tier: 'oro', vip: true,
      since: 2022, stays: 5, lifetimeRevenue: 182000, nps: 9.4,
      contact: '+52 55 8421 0033 · WhatsApp',
      insights: [
        { icon: 'coffee',  text: 'Pide café americano sin azúcar' },
        { icon: 'flame',   text: 'Alérgica a frutos secos',          tone: 'danger' },
        { icon: 'bed',     text: 'Almohadas firmes · cama doble' },
        { icon: 'star',    text: 'Aniversario el 14 de mayo',        tone: 'brass' },
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
        { icon: 'flame', text: 'Alergia mariscos (esposa)', tone: 'danger' },
        { icon: 'coffee', text: 'Sake japonés preferido' },
      ],
      previousStays: [
        { date: 'Mar 2024', room: '510', rating: '9', plan: 'Solo hosp.' },
      ],
    },
  ],

  // ─── Llegadas del día (Recepción) ─────────────────────────
  // Forma específica para la lista de "Llegadas hoy". status corresponde
  // a la pill (warn/ok/info). Cuando conectes auth real, esto sale del
  // PMS filtrando reservas con check-in == hoy.
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
};
