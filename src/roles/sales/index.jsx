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

const tabs = [
  { id: 'pipe', label: 'Reservas',   icon: I.list,  to: '/sales' },
  { id: 'cal',  label: 'Calendario', icon: I.cal,   to: '/sales/calendar' },
  { id: 'cust', label: 'Clientes',   icon: I.users, to: '/sales/customers' },
  { id: 'me',   label: 'Yo',         icon: I.user,  to: '/sales/me' },
];

function SalesShell() {
  const { pathname } = useLocation();
  // Pantallas full-bleed: nueva reserva (formulario) y detalle VIP (header inmersivo)
  const hideTabs = pathname.includes('/new') || pathname.includes('/customer/');
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
        <Route path="me"           element={<RoleMe />} />
      </Route>
    </Routes>
  );
}
