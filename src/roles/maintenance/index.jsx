// src/roles/maintenance/index.jsx — Layout del rol Mantenimiento.

import React from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { TabBar } from '../../ui/shared.jsx';
import { I } from '../../ui/icons.jsx';

import MaintenanceTickets from './Tickets.jsx';
import MaintenanceDetail  from './Detail.jsx';
import MaintenanceHistory from './History.jsx';
import RoleMe             from '../../ui/RoleMe.jsx';

const tabs = [
  { id: 'open',  label: 'Abiertos', icon: I.wrench, to: '/maintenance' },
  { id: 'done',  label: 'Hist.',    icon: I.list,   to: '/maintenance/history' },
  { id: 'me',    label: 'Yo',       icon: I.user,   to: '/maintenance/me' },
];

function MaintenanceShell() {
  const { pathname } = useLocation();
  // Pantalla de detalle va full-bleed (sin TabBar)
  const hideTabs = pathname.includes('/ticket/');
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </div>
      {!hideTabs && <TabBar items={tabs} />}
    </div>
  );
}

export default function MaintenanceRoutes() {
  return (
    <Routes>
      <Route element={<MaintenanceShell />}>
        <Route index               element={<MaintenanceTickets />} />
        <Route path="ticket/:id"   element={<MaintenanceDetail />} />
        <Route path="history"      element={<MaintenanceHistory />} />
        <Route path="me"           element={<RoleMe />} />
      </Route>
    </Routes>
  );
}
