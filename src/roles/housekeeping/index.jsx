// src/roles/housekeeping/index.jsx — Layout del rol Limpieza.

import React from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { TabBar } from '../../ui/shared.jsx';
import { I } from '../../ui/icons.jsx';

import HousekeepingTasks    from './Tasks.jsx';
import HousekeepingDetail   from './Detail.jsx';
import HousekeepingEvidence from './Evidence.jsx';
import HousekeepingReport   from './Report.jsx';
import HousekeepingShift    from './Shift.jsx';
import RoleMe               from '../../ui/RoleMe.jsx';

const tabs = [
  { id: 'tasks', label: 'Tareas',  icon: I.list,  to: '/housekeeping' },
  { id: 'shift', label: 'Turno',   icon: I.clock, to: '/housekeeping/shift' },
  { id: 'me',    label: 'Yo',      icon: I.user,  to: '/housekeeping/me' },
];

function HousekeepingShell() {
  const { pathname } = useLocation();
  // Detalle, evidencia y reporte van full-bleed
  const hideTabs =
    pathname.includes('/task/') ||
    pathname.includes('/evidence/') ||
    pathname.includes('/report');
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </div>
      {!hideTabs && <TabBar items={tabs} />}
    </div>
  );
}

export default function HousekeepingRoutes() {
  return (
    <Routes>
      <Route element={<HousekeepingShell />}>
        <Route index               element={<HousekeepingTasks />} />
        <Route path="task/:id"     element={<HousekeepingDetail />} />
        <Route path="evidence/:id" element={<HousekeepingEvidence />} />
        <Route path="report"       element={<HousekeepingReport />} />
        <Route path="shift"        element={<HousekeepingShift />} />
        <Route path="me"           element={<RoleMe />} />
      </Route>
    </Routes>
  );
}
