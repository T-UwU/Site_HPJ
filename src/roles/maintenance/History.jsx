// src/roles/maintenance/History.jsx — Historial de tickets cerrados.
// Migrado de screens-maintenance.jsx::MaintenanceHistory.
// · Lee tickets cerrados del store
// · Computa barras de categoría dinámicamente
// · Lista los más recientes

import React from 'react';
import {
  PhoneScreen, BrandStrip, AppBar, IconBtn, Body, Eyebrow, Metric, Card, Pill,
} from '../../ui/shared.jsx';
import { I } from '../../ui/icons.jsx';
import { useTickets } from '../../store/data.js';

export default function MaintenanceHistory() {
  const tickets = useTickets();
  const closed = tickets.filter((t) => t.status === 'cerrado');

  // Computar barras por categoría
  const byCategory = closed.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});
  const categories = Object.entries(byCategory)
    .map(([label, count]) => ({
      label,
      count,
      pct: closed.length ? Math.round((count / closed.length) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <PhoneScreen>
      <BrandStrip role="maintenance"/>
      <AppBar
        eyebrow="Esta semana · 13–19 may"
        title="Historial"
        trailing={<IconBtn icon={I.filter}/>}
      />
      <Body style={{ paddingBottom: 80 }}>
        <div style={{ padding: '4px 16px 0', display: 'flex', gap: 8 }}>
          <Metric label="Cerrados" value={String(closed.length)} sub="+4" kind="up" foot="vs. sem. ant."/>
          <Metric label="A tiempo" value="91%" sub="+6%" kind="up"/>
        </div>

        {categories.length > 0 && (
          <>
            <Eyebrow>Por categoría</Eyebrow>
            <div style={{ padding: '0 16px' }}>
              <Card style={{ padding: 14 }}>
                {categories.map((c, i) => (
                  <CatBar key={c.label} {...c} last={i === categories.length - 1}/>
                ))}
              </Card>
            </div>
          </>
        )}

        <Eyebrow>Tickets recientes</Eyebrow>
        <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {closed.map((t) => (
            <HistoryRow
              key={t.id}
              id={t.id}
              room={t.room}
              desc={t.desc}
              date={t.closedAt}
              duration={t.duration}
              warranty={t.warranty}
            />
          ))}
        </div>
      </Body>
    </PhoneScreen>
  );
}

function CatBar({ label, pct, count, last }) {
  return (
    <div style={{ padding: '8px 0', borderBottom: last ? 'none' : '1px solid var(--line-soft)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
        <span style={{ fontWeight: 500 }}>{label}</span>
        <span className="hpj-mono" style={{ color: 'var(--muted)' }}>{count} · {pct}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 999, background: 'var(--card-2)', overflow: 'hidden' }}>
        <div style={{ width: pct + '%', height: '100%', background: 'var(--forest)' }}/>
      </div>
    </div>
  );
}

function HistoryRow({ id, room, desc, date, duration, warranty }) {
  return (
    <div style={{
      padding: '10px 12px', borderRadius: 10,
      background: 'var(--card-2)', border: '1px solid var(--line-soft)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span className="hpj-mono" style={{ fontSize: 10, color: 'var(--muted)', minWidth: 42 }}>#{id}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>Hab {room} · {desc}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{date} · {duration}</div>
      </div>
      {warranty && <Pill kind="warn" style={{ height: 18, fontSize: 10 }}>GARANTÍA</Pill>}
      <span style={{ color: 'var(--ok)' }}>{I.check}</span>
    </div>
  );
}
