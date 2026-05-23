// src/roles/sales/index.jsx — Layout del rol Ventas.

import React from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { TabBar } from '../../ui/shared.jsx';
import { I } from '../../ui/icons.jsx';

import SalesPipeline       from './Pipeline.jsx';
import SalesCustomers      from './Customers.jsx';
import SalesNewReservation from './NewReservation.jsx';
import SalesVIPDetail      from './VIPDetail.jsx';
import RoleMe              from '../../ui/RoleMe.jsx';
import AreaChat            from '../../ui/AreaChat.jsx';
import Notifications       from '../../ui/Notifications.jsx';
import { EventsList, EventDetail } from '../../ui/EventsCalendar.jsx';
import { useActivityUnread } from '../../store/activity.js';
import { useCurrentUser }  from '../../store/auth.js';

function SalesShell() {
  const { pathname } = useLocation();
  const user      = useCurrentUser();
  const actUnread = useActivityUnread(user?.roleId);

  const hideTabs =
    pathname.includes('/new')           ||
    pathname.includes('/customer/')     ||
    pathname.includes('/chat')          ||
    pathname.includes('/notifications') ||
    pathname.includes('/events/');

  const tabs = [
    { id: 'pipe',   label: 'Reservas', icon: I.list,  to: '/sales' },
    { id: 'cust',   label: 'Clientes', icon: I.users, to: '/sales/customers' },
    { id: 'events', label: 'Eventos',  icon: I.cal,   to: '/sales/events' },
    { id: 'me',     label: 'Yo',       icon: I.user,  to: '/sales/me',
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

export default function SalesRoutes() {
  return (
    <Routes>
      <Route element={<SalesShell />}>
        <Route index                element={<SalesPipeline />} />
        <Route path="customers"     element={<SalesCustomers />} />
        <Route path="customer/:id"  element={<SalesVIPDetail />} />
        <Route path="new"           element={<SalesNewReservation />} />
        <Route path="events"        element={<EventsList role="sales" />} />
        <Route path="events/:id"    element={<EventDetail role="sales" />} />
        <Route path="chat"          element={<AreaChat role="sales" />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="me"            element={<RoleMe />} />
      </Route>
    </Routes>
  );
}
