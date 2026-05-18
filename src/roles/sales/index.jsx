// src/roles/sales/index.jsx — Layout del rol Ventas.

import React from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { TabBar } from '../../ui/shared.jsx';
import { I } from '../../ui/icons.jsx';

import SalesPipeline       from './Pipeline.jsx';
import SalesCalendar       from './Calendar.jsx';
import SalesCustomers      from './Customers.jsx';
import SalesNewReservation from './NewReservation.jsx';
import SalesVIPDetail      from './VIPDetail.jsx';
import RoleMe              from '../../ui/RoleMe.jsx';
import AreaChat            from '../../ui/AreaChat.jsx';
import { useChatUnread }   from '../../store/chat.js';
import { useCurrentUser }  from '../../store/auth.js';

function SalesShell() {
  const { pathname } = useLocation();
  const user   = useCurrentUser();
  const unread = useChatUnread(user?.roleId);

  const hideTabs = pathname.includes('/new') || pathname.includes('/customer/') || pathname.includes('/chat');

  const tabs = [
    { id: 'pipe', label: 'Reservas',   icon: I.list,  to: '/sales' },
    { id: 'cal',  label: 'Calendario', icon: I.cal,   to: '/sales/calendar' },
    { id: 'cust', label: 'Clientes',   icon: I.users, to: '/sales/customers' },
    { id: 'chat', label: 'Chat',       icon: I.msg,   to: '/sales/chat', badge: unread || undefined },
    { id: 'me',   label: 'Yo',         icon: I.user,  to: '/sales/me' },
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
        <Route index               element={<SalesPipeline />} />
        <Route path="calendar"     element={<SalesCalendar />} />
        <Route path="customers"    element={<SalesCustomers />} />
        <Route path="customer/:id" element={<SalesVIPDetail />} />
        <Route path="new"          element={<SalesNewReservation />} />
        <Route path="chat"         element={<AreaChat role="sales" />} />
        <Route path="me"           element={<RoleMe />} />
      </Route>
    </Routes>
  );
}
