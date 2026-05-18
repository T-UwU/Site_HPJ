// src/roles/reception/Arrivals.jsx — Lista de llegadas del día.
// Migrado de screens-reception.jsx::ReceptionArrivals.
// · Los chips de filtro son visuales por ahora (TODO: useState filter)
// · Card → /reception/guest/:id
// · Botón "Check-in" → /reception/checkin/:id

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PhoneScreen, BrandStrip, AppBar, IconBtn, Body, Eyebrow,
  Card, Avatar, Pill,
} from '../../ui/shared.jsx';
import { I } from '../../ui/icons.jsx';
import { useArrivals } from '../../store/data.js';

export default function ReceptionArrivals() {
  const navigate = useNavigate();
  const arrivals = useArrivals();
  const [filter, setFilter] = useState('todas');

  const filters = [
    { id: 'todas',     label: 'Todas',     count: arrivals.length },
    { id: 'pending',   label: 'Pendientes', count: arrivals.filter(a => !a.done).length },
    { id: 'vip',       label: 'VIP',        count: arrivals.filter(a => a.vip).length },
  ];

  const visible = arrivals.filter((a) => {
    if (filter === 'pending') return !a.done;
    if (filter === 'vip')     return a.vip;
    return true;
  });

  const pending = visible.filter((a) => !a.done);
  const arrived = visible.filter((a) => a.done);

  return (
    <PhoneScreen>
      <BrandStrip role="reception"/>
      <AppBar
        eyebrow={`${arrivals.length} reservas · ${arrivals.filter(a => !a.done).length} pendientes`}
        title="Llegadas hoy"
        trailing={<>
          <IconBtn icon={I.filter}/>
          <IconBtn icon={I.search}/>
        </>}
      />
      <div style={{ padding: '4px 16px 8px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`pill ${filter === f.id ? 'pill-forest' : ''}`}
            style={{ whiteSpace: 'nowrap', border: 'none', cursor: 'pointer' }}
          >
            {f.label} {f.count > 0 && f.id !== 'todas' && f.count}
          </button>
        ))}
      </div>
      <Body style={{ paddingBottom: 80 }}>
        {pending.length > 0 && (
          <>
            <Eyebrow>Por llegar</Eyebrow>
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pending.map((a) => (
                <ArrivalCard
                  key={a.id}
                  arrival={a}
                  onOpen={() => navigate(`/reception/guest/${a.id}`)}
                  onCheckIn={() => navigate(`/reception/checkin/${a.id}`)}
                />
              ))}
            </div>
          </>
        )}
        {arrived.length > 0 && (
          <>
            <Eyebrow>Ya llegaron</Eyebrow>
            <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {arrived.map((a) => (
                <ArrivalCard key={a.id} arrival={a} done onOpen={() => navigate(`/reception/guest/${a.id}`)}/>
              ))}
            </div>
          </>
        )}
      </Body>
    </PhoneScreen>
  );
}

function ArrivalCard({ arrival, onOpen, onCheckIn, done }) {
  const { guest, vip, room, plan, stay, time, status, statusLabel } = arrival;
  return (
    <Card style={{ padding: 12, opacity: done ? 0.55 : 1 }}>
      <div style={{ display: 'flex', gap: 12 }} onClick={onOpen}>
        <Avatar name={guest} size={40}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
              <span style={{ fontSize: 15, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{guest}</span>
              {vip && <span style={{ fontFamily: 'var(--serif)', fontSize: 11, color: 'var(--brass-deep)', letterSpacing: '0.2em' }}>VIP</span>}
            </div>
            <span className="hpj-mono" style={{ fontSize: 13 }}>{time}</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Hab {room} · {plan}</div>
          <div style={{ fontSize: 11, color: 'var(--muted-2)', marginTop: 1 }}>{stay}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line-soft)' }}>
        <Pill kind={status}>{statusLabel}</Pill>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={onOpen} className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 12 }}>Detalle</button>
          {!done && (
            <button onClick={onCheckIn} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 12 }}>
              Check-in
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
