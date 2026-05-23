// src/roles/reception/index.jsx — Layout del rol Recepción.

import React from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { TabBar } from '../../ui/shared.jsx';
import { I } from '../../ui/icons.jsx';

import ReceptionHome        from './Home.jsx';
import ReceptionArrivals    from './Arrivals.jsx';
import ReceptionCheckIn     from './CheckIn.jsx';
import ReceptionRooms       from './Rooms.jsx';
import ReceptionGuestDetail from './GuestDetail.jsx';
import RoleMe               from '../../ui/RoleMe.jsx';
import AreaChat             from '../../ui/AreaChat.jsx';
import Notifications        from '../../ui/Notifications.jsx';
import SalesNewReservation  from '../sales/NewReservation.jsx';
import { EventsList, EventDetail } from '../../ui/EventsCalendar.jsx';
import { useActivityUnread } from '../../store/activity.js';
import { useCurrentUser }   from '../../store/auth.js';

function ReceptionShell() {
  const { pathname } = useLocation();
  const user     = useCurrentUser();
  const actUnread = useActivityUnread(user?.roleId);

  const hideTabs =
    pathname.includes('/checkin')       ||
    pathname.includes('/guest/')        ||
    pathname.includes('/chat')          ||
    pathname.includes('/new')           ||
    pathname.includes('/notifications') ||
    pathname.includes('/events/');      // detalle de evento oculta tabs

  const tabs = [
    { id: 'home',     label: 'Inicio',   icon: I.home,     to: '/reception' },
    { id: 'arrivals', label: 'Llegadas', icon: I.bellDesk, to: '/reception/arrivals' },
    { id: 'rooms',    label: 'Habs.',    icon: I.bed,      to: '/reception/rooms' },
    { id: 'events',   label: 'Eventos',  icon: I.cal,      to: '/reception/events' },
    { id: 'me',       label: 'Yo',       icon: I.user,     to: '/reception/me',
      badge: actUnread || undefined },
  ];

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
        <Route index                    element={<ReceptionHome />} />
        <Route path="arrivals"          element={<ReceptionArrivals />} />
        <Route path="checkin/:guestId"  element={<ReceptionCheckIn />} />
        <Route path="rooms"             element={<ReceptionRooms />} />
        <Route path="guest/:guestId"    element={<ReceptionGuestDetail />} />
        <Route path="new"               element={<SalesNewReservation role="reception" />} />
        <Route path="events"            element={<EventsList role="reception" />} />
        <Route path="events/:id"        element={<EventDetail role="reception" />} />
        <Route path="chat"              element={<AreaChat role="reception" />} />
        <Route path="notifications"     element={<Notifications />} />
        <Route path="me"                element={<RoleMe />} />
      </Route>
    </Routes>
  );
}
