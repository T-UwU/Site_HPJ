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
import AreaChat             from '../../ui/AreaChat.jsx';
import { useChatUnread }    from '../../store/chat.js';
import { useCurrentUser }   from '../../store/auth.js';

function HousekeepingShell() {
  const { pathname } = useLocation();
  const user   = useCurrentUser();
  const unread = useChatUnread(user?.roleId);

  const hideTabs =
    pathname.includes('/task/')     ||
    pathname.includes('/evidence/') ||
    pathname.includes('/report')    ||
    pathname.includes('/chat');

  const tabs = [
    { id: 'tasks', label: 'Tareas', icon: I.list,  to: '/housekeeping' },
    { id: 'shift', label: 'Turno',  icon: I.clock, to: '/housekeeping/shift' },
    { id: 'chat',  label: 'Chat',   icon: I.msg,   to: '/housekeeping/chat', badge: unread || undefined },
    { id: 'me',    label: 'Yo',     icon: I.user,  to: '/housekeeping/me' },
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

export default function HousekeepingRoutes() {
  return (
    <Routes>
      <Route element={<HousekeepingShell />}>
        <Route index               element={<HousekeepingTasks />} />
        <Route path="task/:id"     element={<HousekeepingDetail />} />
        <Route path="evidence/:id" element={<HousekeepingEvidence />} />
        <Route path="report"       element={<HousekeepingReport />} />
        <Route path="shift"        element={<HousekeepingShift />} />
        <Route path="chat"         element={<AreaChat role="housekeeping" />} />
        <Route path="me"           element={<RoleMe />} />
      </Route>
    </Routes>
  );
}
