# Hotel Palacio Julio · Sistema Operativo

Vite + React + React Router + Zustand + **Supabase** (opcional).
Sistema operativo de hotel con 5 roles coordinados (Recepción, Limpieza,
Ventas, Mantenimiento, Compras), login real con email, y persistencia
en localStorage como fallback.

---

## Cómo correrlo

### Modo offline (sin servidor — para empezar a probar)

```bash
cd hpj
npm install
npm run dev
```

Abre `http://localhost:5173`. Selector visual de roles, datos en localStorage.
Funcional 100%, sin necesidad de cuenta en ningún lado.

### Modo online (con Supabase real)

Sigue las instrucciones de `supabase/README.md`. Resumen:

1. Crea proyecto en Supabase, corre `schema.sql` → `seed.sql` → `add-events.sql` → `add-comments.sql` → `add-purchasing.sql` → `migrate-roles.sql`
2. Copia `.env.example` a `.env` con tus credenciales
3. `npm run seed:users` para crear los 5 usuarios demo
4. `npm run dev` y login con `recepcion@palaciojulio.test` / `demo1234`

Si las env vars no están, la app cae automáticamente a modo offline — útil
para desarrollo local sin tener que arrancar Supabase.

Para probar desde el celu en tu red local: `npm run dev -- --host` y abres
la URL que imprime Vite desde tu teléfono (típicamente `http://192.168.x.x:5173`).

Build de producción: `npm run build` → estáticos en `dist/`. Súbelo a Vercel,
Netlify, Cloudflare Pages o tu AlwaysData. Configura las env vars
`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en el provider para que el
build de prod hable con Supabase.

---

## Estructura

```
hpj/
├── package.json
├── vite.config.js
├── index.html
├── .env.example                  ← plantilla para credenciales Supabase
├── supabase/                     ← backend
│   ├── README.md                 ← setup paso a paso
│   ├── schema.sql                ← tablas + RLS + realtime + auth trigger
│   ├── seed.sql                  ← datos iniciales
│   ├── add-events.sql            ← tabla events (Ordenes de Evento)
│   ├── add-comments.sql          ← tabla comments (comentarios contextuales)
│   ├── add-purchasing.sql        ← tabla requisitions (rol Compras)
│   ├── migrate-roles.sql         ← actualiza constraint a 5 roles activos
│   └── seed-users.js             ← script Node para crear los 5 usuarios demo
└── src/
    ├── main.jsx                  ← entry
    ├── App.jsx                   ← router + initSession + splash
    ├── tokens.css                ← tokens de diseño
    ├── app.css                   ← phone shell
    ├── lib/
    │   └── supabase.js           ← cliente Supabase + detección de modo
    ├── store/
    │   ├── auth.js               ← Zustand: usuario + login dual mode
    │   ├── seed.js               ← datos iniciales en JS (modo offline)
    │   ├── data.js               ← Zustand: estado operativo
    │   └── activity.js           ← actividad cross-area + realtime
    ├── ui/
    │   ├── icons.jsx
    │   ├── shared.jsx
    │   ├── RoleMe.jsx
    │   ├── PhoneShell.jsx
    │   ├── EventsCalendar.jsx    ← lista + detalle de Ordenes de Evento
    │   ├── CommentThread.jsx     ← comentarios contextuales (ticket/evento)
    │   └── Notifications.jsx     ← feed de actividad cross-area
    ├── pages/
    │   └── Login.jsx             ← email/password + selector demo (dual)
    ├── routes/
    │   └── RequireAuth.jsx
    └── roles/                    ← 5 roles activos
        ├── reception/
        │   ├── index.jsx         ← tabs: Inicio, Llegadas, Habs., Eventos, Yo
        │   ├── Home.jsx
        │   ├── Arrivals.jsx
        │   ├── CheckIn.jsx
        │   ├── Rooms.jsx
        │   ├── GuestDetail.jsx
        │   └── NewReservation.jsx← recepción también puede crear reservas
        ├── housekeeping/
        │   ├── index.jsx         ← tabs: Tareas, Turno, Eventos, Yo
        │   ├── Tasks.jsx
        │   ├── Detail.jsx
        │   ├── Report.jsx        ← cross-area: crea ticket en Mantenimiento
        │   └── Shift.jsx
        ├── maintenance/
        │   ├── index.jsx         ← tabs: Abiertos, Pedidos, Eventos, Yo
        │   ├── Tickets.jsx
        │   ├── Detail.jsx        ← acuse de recibido + CommentThread
        │   ├── History.jsx
        │   └── Requisitions.jsx  ← vista read-only de sus pedidos a Compras
        ├── sales/
        │   ├── index.jsx         ← tabs: Reservas, Clientes, Eventos, Yo
        │   ├── Pipeline.jsx
        │   ├── Customers.jsx
        │   ├── NewReservation.jsx← formulario con cálculo dinámico de total
        │   └── VIPDetail.jsx
        └── purchasing/
            ├── index.jsx         ← tabs: Pedidos, Eventos, Yo
            ├── Requisitions.jsx  ← gestión completa: pedido→en-camino→surtido
            └── NewRequisition.jsx← formulario para nueva requisición
```

---

## Cómo se conecta todo

1. **Login** (`/login`): el usuario toca una tarjeta de rol → `useAuth.login(roleId)`
   guarda `{ roleId, name, shift }` en Zustand (persistido en localStorage) y
   navega al home del rol.

2. **Guard** (`RequireAuth`): cada `/<rol>/*` está envuelto. Sin sesión →
   `/login`. Sesión con otro rol → redirige al home de SU rol (no le mostramos
   pantallas que no son suyas).

3. **Sub-router por rol**: cada `src/roles/<rol>/index.jsx` define sus rutas
   internas y su `TabBar` permanente. Ver `concierge/index.jsx` como ejemplo.

4. **Store de datos**: `src/store/data.js` carga `seed.js` la primera vez y
   persiste cambios. Las pantallas leen con `useRequests()`, `useTickets()`,
   etc., y mutan con `useActions()`. Refresca la página y los cambios
   sobreviven.

---

## Flujos cross-area que ya funcionan

Pruébalos cambiando entre roles en la misma sesión del navegador:

- **Limpieza → Mantenimiento**: en Limpieza, FAB "Reportar incidencia" crea
  un ticket real con `acks: { maintenance: null }`. Cámbiate a Mantenimiento,
  verás el ticket; desde su detalle confirmas recibido → queda sellado con timestamp.
- **Orden de Evento**: en Ventas crea un evento. Todos los demás roles lo ven
  en su pestaña Eventos con los puntos de acuse. Cada área confirma recibido
  desde el detalle — el punto se colorea y queda el timestamp.
- **Cambio de PAX**: en Ventas, edita el número de comensales de un evento.
  La actividad aparece marcada con ⚠ para que todas las áreas sepan del cambio.
- **Requisiciones**: en Limpieza o Mantenimiento se generan requisiciones para
  el área de Compras. Compras las ve agrupadas (Por atender / En camino / Surtidos)
  y avanza su estado con un tap.
- **Campanita cross-area**: el ícono de campana en todos los roles muestra la
  misma actividad: tickets nuevos, acuses, cambios de PAX, eventos confirmados.
- **Recepción crea reservas**: Recepción tiene el mismo formulario que Ventas
  para crear reservas directamente desde su vista.

---

## Próximos pasos sugeridos

1. **Conectar store a Supabase**: el store de Zustand ya tiene el shape exacto
   de las tablas. Cada `useTickets()`, `useEvents()`, `useRequisitions()` puede
   reemplazarse por un hook que hace `select` + suscripción `postgres_changes`.
   La actividad cross-area ya usa Realtime en modo online.

2. **PWA**: agrega `vite-plugin-pwa`, manifest y service worker. El staff
   instala la app en la pantalla de inicio del celu y se siente nativa, con
   offline básico para tareas y checklists.

3. **NewEvent para Ventas**: la lista de eventos muestra un `+` que lleva a
   `/sales/events/new` — falta crear el formulario `NewEvent.jsx` con los
   campos del modelo (nombre, fecha, hora, salón, pax, cliente).

4. **Push notifications**: cuando un evento cambia de PAX o nace un ticket
   urgente, notificar al dispositivo del área afectada (Supabase Edge Function
   + Web Push API).

---

## Notas

- Los datos seed se cachean en `localStorage` bajo las claves `hpj.auth` y
  `hpj.data`. Para resetear todo: `localStorage.clear()` en la consola del
  navegador, o en la app llama a `useActions().resetAll()`.

- Si cambias el shape de `seed.js`, sube `version` en `data.js` para que el
  cache viejo se descarte automáticamente al recargar (actualmente `version: 8`).

- Las pantallas son **mobile-first** por diseño. En desktop se renderizan
  dentro de un marco de teléfono (412×880) para que la composición no se rompa.

- El store tiene modo dual: si las env vars de Supabase están presentes corre
  en modo online (Auth real + Realtime); si no, cae a Zustand + localStorage.
  El link "Modo demo · sin servidor →" del login siempre fuerza el modo offline.
