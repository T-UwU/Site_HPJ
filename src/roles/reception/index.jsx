// src/roles/reception/index.jsx — Layout del rol Recepción.
// Rutas reales conectadas a las pantallas migradas.

import React from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { TabBar } from '../../ui/shared.jsx';
import { I } from '../../ui/icons.jsx';

import ReceptionHome        from './Home.jsx';
import ReceptionArrivals    from './Arrivals.jsx';
import ReceptionCheckIn     from './CheckIn.jsx';
import ReceptionRooms       from './Rooms.jsx';
import ReceptionGuestDetail from './GuestDetail.jsx';
import ReceptionChat        from './Chat.jsx';
import RoleMe               from '../../ui/RoleMe.jsx';

const tabs = [
  { id: 'home',     label: 'Inicio',   icon: I.home,     to: '/reception' },
  { id: 'arrivals', label: 'Llegadas', icon: I.bellDesk, to: '/reception/arrivals' },
  { id: 'rooms',    label: 'Habs.',    icon: I.bed,      to: '/reception/rooms' },
  { id: 'me',       label: 'Yo',       icon: I.user,     to: '/reception/me' },
];

function ReceptionShell() {
  const { pathname } = useLocation();
  // Pantallas full-bleed sin TabBar: chat, check-in, detalle de huésped
  const hideTabs =
    pathname.includes('/chat') ||
    pathname.includes('/checkin') ||
    pathname.includes('/guest/');
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </div>
      {!hideTabs && <TabBar items={tabs} />}
    </div>
  );
}

export default function ReceptionRoutes() {
  return (
    <Routes>
      <Route element={<ReceptionShell />}>
        <Route index                   element={<ReceptionHome />} />
        <Route path="arrivals"         element={<ReceptionArrivals />} />
        <Route path="checkin/:guestId" element={<ReceptionCheckIn />} />
        <Route path="rooms"            element={<ReceptionRooms />} />
        <Route path="guest/:guestId"   element={<ReceptionGuestDetail />} />
        <Route path="chat/:guestId?"   element={<ReceptionChat />} />
        <Route path="me"               element={<RoleMe />} />
      </Route>
    </Routes>
  );
}
