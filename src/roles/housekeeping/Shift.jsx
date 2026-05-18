// src/roles/housekeeping/Shift.jsx — Resumen del turno.
// Migrado de screens-housekeeping.jsx::HousekeepingShift.
// · Métricas computadas desde useTasks() (completadas vs total)
// · Tickets que generé: filtro de useTickets() por reportedBy=housekeeping
// · "Finalizar turno" → /housekeeping/me (donde está el logout)

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PhoneScreen, BrandStrip, AppBar, Body, Eyebrow, Metric, Card, Pill,
} from '../../ui/shared.jsx';
import { I } from '../../ui/icons.jsx';
import { useTasks, useTickets } from '../../store/data.js';

export default function HousekeepingShift() {
  const navigate = useNavigate();
  const tasks = useTasks();
  const tickets = useTickets();

  const completed = tasks.filter((t) => t.status === 'completada').length;
  const total = tasks.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const myTickets = tickets.filter((t) => t.reportedBy === 'housekeeping');

  return (
    <PhoneScreen>
      <BrandStrip role="housekeeping"/>
      <AppBar
        eyebrow="Lunes 13 mayo · 07:00–15:00"
        title="Mi turno"
        serif
      />
      <Body style={{ paddingBottom: 80 }}>
        <div style={{ padding: '4px 16px 0', display: 'flex', gap: 8 }}>
          <Metric label="Completadas" value={String(completed)} sub={`/ ${total}`} foot={`${pct}% del turno`}/>
          <Metric label="Tiempo medio" value="38m" sub="−5m" kind="up" foot="vs. estándar 43m"/>
        </div>

        <Eyebrow>Línea del día</Eyebrow>
        <div style={{ padding: '0 16px' }}>
          <Card style={{ padding: 14 }}>
            <ShiftBar/>
          </Card>
        </div>

        <Eyebrow>Reconocimientos</Eyebrow>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <RecognitionRow icon={I.star} title="Cero quejas esta semana" sub="Por 6° turno consecutivo" tone="brass"/>
          <RecognitionRow icon={I.sparkle} title="Cortesía VIP impecable" sub="Mencionado por Sra. Vega · hab. 510" tone="forest"/>
        </div>

        {myTickets.length > 0 && (
          <>
            <Eyebrow>Tickets que generé hoy</Eyebrow>
            <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {myTickets.map((t) => (
                <TicketLink
                  key={t.id}
                  room={t.room}
                  text={t.desc}
                  status={t.status === 'cerrado' ? 'resuelto' : 'abierto'}
                />
              ))}
            </div>
          </>
        )}

        <div style={{ padding: '0 16px 18px' }}>
          <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => navigate('/housekeeping/me')}>
            Finalizar turno
          </button>
        </div>
      </Body>
    </PhoneScreen>
  );
}

function ShiftBar() {
  const blocks = [
    { p: 14, kind: 'ok' },
    { p: 12, kind: 'ok' },
    { p: 16, kind: 'ok' },
    { p: 13, kind: 'ok' },
    { p: 15, kind: 'busy' },
    { p: 10, kind: 'pending' },
    { p: 11, kind: 'pending' },
    { p: 9, kind: 'pending' },
  ];
  return (
    <div>
      <div style={{ display: 'flex', gap: 3, height: 28, alignItems: 'center' }}>
        {blocks.map((b, i) => (
          <div key={i} style={{
            flex: b.p,
            height: '100%', borderRadius: 4,
            background:
              b.kind === 'ok'   ? 'var(--forest)' :
              b.kind === 'busy' ? 'var(--brass)'  :
              'var(--line)',
            opacity: b.kind === 'pending' ? 0.8 : 1,
          }}/>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: 'var(--muted-2)', fontFamily: 'var(--mono)' }}>
        <span>07:00</span><span>11:00</span><span>15:00</span>
      </div>
    </div>
  );
}

function RecognitionRow({ icon, title, sub, tone }) {
  const colors = tone === 'brass'
    ? ['var(--brass-soft)', 'var(--brass-deep)']
    : ['var(--forest-soft)', 'var(--forest-deep)'];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
      background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: colors[0], color: colors[1],
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>
      </div>
    </div>
  );
}

function TicketLink({ room, text, status }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
      background: 'var(--card-2)', border: '1px solid var(--line-soft)', borderRadius: 10,
    }}>
      <span className="hpj-mono" style={{ fontSize: 11, color: 'var(--brass-deep)', minWidth: 32 }}>#{room}</span>
      <div style={{ flex: 1, fontSize: 13 }}>{text}</div>
      <Pill kind={status === 'resuelto' ? 'ok' : 'warn'} style={{ height: 18, fontSize: 10 }}>
        {status.toUpperCase()}
      </Pill>
    </div>
  );
}
