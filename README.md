# Hotel Palacio Julio · Sistema Operativo

Vite + React + React Router + Zustand + **Supabase** (opcional).
Sistema operativo de hotel con 7 roles coordinados (Recepción, Limpieza,
Cocina, Ventas, Mantenimiento, Gerencia, Concierge), login real con email,
y persistencia en localStorage como fallback.

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

1. Crea proyecto en Supabase, corre `supabase/schema.sql` + `supabase/seed.sql`
2. Copia `.env.example` a `.env` con tus credenciales
3. `npm run seed:users` para crear los 7 usuarios demo
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
│   └── seed-users.js             ← script Node para crear los 7 usuarios demo
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
    │   └── data.js               ← Zustand: estado operativo
    ├── ui/
    │   ├── icons.jsx
    │   ├── shared.jsx
    │   ├── RoleMe.jsx
    │   └── PhoneShell.jsx
    ├── pages/
    │   └── Login.jsx             ← email/password + selector demo (dual)
    ├── routes/
    │   └── RequireAuth.jsx
    └── roles/                    ← los 7 roles, todos migrados
        ├── concierge/            ← MIGRADO COMPLETO
        │   ├── index.jsx
        │   ├── Requests.jsx
        │   ├── Detail.jsx
        │   └── Chat.jsx
        ├── reception/            ← MIGRADO COMPLETO
        │   ├── index.jsx
        │   ├── Home.jsx
        │   ├── Arrivals.jsx
        │   ├── CheckIn.jsx
        │   ├── Rooms.jsx
        │   ├── GuestDetail.jsx
        │   └── Chat.jsx
        ├── maintenance/          ← MIGRADO COMPLETO
        │   ├── index.jsx
        │   ├── Tickets.jsx
        │   ├── Detail.jsx
        │   └── History.jsx
        ├── housekeeping/         ← MIGRADO COMPLETO
        │   ├── index.jsx
        │   ├── Tasks.jsx
        │   ├── Detail.jsx
        │   ├── Evidence.jsx
        │   ├── Report.jsx        ← cross-area: crea ticket en Mantenimiento
        │   └── Shift.jsx
        ├── kitchen/              ← MIGRADO COMPLETO
        │   ├── index.jsx
        │   ├── Today.jsx
        │   ├── Breakfast.jsx
        │   ├── OrderDetail.jsx
        │   └── Ticket.jsx        ← tema oscuro, items tap-ables que ciclan estado
        ├── management/           ← MIGRADO COMPLETO
        │   ├── index.jsx
        │   ├── KPIs.jsx          ← alertas derivadas del estado global
        │   ├── Map.jsx           ← floor plan SVG dinámico desde rooms
        │   ├── Areas.jsx         ← pulso cross-area todo computado
        │   └── Report.jsx
        └── sales/                ← MIGRADO COMPLETO
            ├── index.jsx
            ├── Pipeline.jsx
            ├── Calendar.jsx
            ├── Customers.jsx
            ├── NewReservation.jsx ← formulario con cálculo dinámico de total
            └── VIPDetail.jsx
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

## Estado de la migración

Los 7 roles ya están migrados con sus pantallas conectadas al store. La receta
de migración paso-a-paso que estaba aquí ya cumplió su propósito — si quieres
agregar nuevas pantallas a un rol, copia el patrón de cualquiera de las
existentes (las más sencillas como `concierge/Requests.jsx` o `maintenance/Tickets.jsx`
son buenos puntos de partida).

### Flujos cross-area que ya funcionan

Pruébalos cambiando entre roles en la misma sesión del navegador:

- **Limpieza → Mantenimiento**: en Limpieza, FAB "Reportar incidencia" crea
  un ticket real. Cámbiate a Mantenimiento y lo verás en su lista.
- **Mantenimiento ciclo de vida**: aceptar → progresar → cerrar un ticket.
  Vuelve a Limpieza · Turno y aparece bajo "Tickets que generé hoy" con su
  status actualizado.
- **Recepción check-in**: marca una llegada como confirmada. Refresca como
  Gerencia y el contador de check-ins en KPIs baja.
- **Cocina pedido completo**: Today → tap pedido 304 → OrderDetail →
  "Iniciar preparación" → Ticket oscuro → tap items para cocinar → "Enviar
  a sala". El order se mueve a status `sent` y sale de Today.
- **Ventas nueva reserva**: Pipeline → tap (+) → formulario con cálculo
  dinámico → "Confirmar y enviar a Recepción". Vuelve a Pipeline y verás
  la reserva nueva con el monto calculado.
- **Gerencia es espejo del sistema**: cualquier cambio en cualquier rol se
  refleja en sus KPIs, Áreas, Mapa, Reporte (recalcula automáticamente).

```jsx
import ReceptionHome from './Home.jsx';
import ReceptionArrivals from './Arrivals.jsx';
// ...

<Route index element={<ReceptionHome />} />
<Route path="arrivals" element={<ReceptionArrivals />} />
<Route path="checkin/:guestId?" element={<ReceptionCheckIn />} />
```

---

## Próximos pasos sugeridos

1. **Backend con realtime**: Supabase es lo más rápido. Una tabla por entidad
   (`rooms`, `requests`, `tickets`...), una suscripción `.on('postgres_changes')`
   por pantalla, y reemplazas el `useData()` por un hook que lee de Supabase.
   El shape del store ya está diseñado para esto — cada selector es un mapping
   directo a una tabla.

2. **Auth real**: Supabase Auth con email/contraseña, o magic link. El rol del
   usuario lo guardas en una tabla `profiles` con campo `role`. El selector
   visual de `/login` queda solo para dev — en producción `RequireAuth` valida
   contra la sesión real.

3. **PWA**: agrega `vite-plugin-pwa`, manifest y service worker. El staff
   instala la app en su pantalla de inicio del celu y se siente nativa, con
   offline básico para tareas/checklists.

4. **Refinar chats**: por ahora son estáticos. Cuando agregues una tabla
   `messages` con `from_role`, `to_guest`, `body`, `read_at`, los Chat de
   Recepción y Concierge se conectan igual que los demás roles (selector +
   acción).

5. **Notificaciones cross-area visibles**: usar el primitivo `<Broadcast/>`
   que ya existe en `shared.jsx`. Cuando un ticket nuevo nace en Limpieza,
   inyectar un broadcast en la timeline de Mantenimiento. Cambia drásticamente
   la sensación de coordinación.

6. **Vista desktop nativa para Gerencia**: las pantallas actuales son mobile.
   Para Gerencia tiene sentido un layout más amplio (multi-columna) en pantalla
   grande. Detecta `window.innerWidth` o usa CSS grid con breakpoints en el
   shell del rol.

---

## Notas

- Los datos seed se cachean en `localStorage` bajo las claves `hpj.auth` y
  `hpj.data`. Para resetear todo: `localStorage.clear()` en la consola del
  navegador, o en la app llama a `useActions().resetAll()`.

- Si cambias el shape de `seed.js`, sube `version` en `data.js` para que el
  cache viejo se descarte automáticamente al recargar (actualmente `version: 6`).

- Las pantallas son **mobile-first** por diseño. En desktop las renderizo
  dentro de un marco de teléfono (412×880) para que la composición no se
  rompa.

- El archivo `design-canvas.jsx` original (con todas las pantallas en grid) ya
  no se usa — sirvió para el moodboard y ya cumplió. Si quieres conservar esa
  vista para presentaciones, métela como ruta `/design` opcional fuera del
  guard de auth.

- Cuatro componentes que el ui-shared original no tenía (`TLItem`, `Bubble`,
  `DayStamp`, `SystemNote`, `PhotoTile`) ahora viven en `src/ui/shared.jsx`.
