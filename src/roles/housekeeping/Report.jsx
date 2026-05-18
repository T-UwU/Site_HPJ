// src/roles/housekeeping/Report.jsx — Reportar incidencia → Mantenimiento.
// Migrado de screens-housekeeping.jsx::HousekeepingReport.
// ⭐ Es la primera pantalla que cruza áreas de verdad: al enviar, llama
// addTicket() del store. Cambia a sesión Mantenimiento y verás aparecer
// el ticket nuevo en su lista de "Urgentes".

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  PhoneScreen, BrandStrip, AppBar, Body, RoleChip, BackBtn,
} from '../../ui/shared.jsx';
import { I } from '../../ui/icons.jsx';
import { useActions, useRooms } from '../../store/data.js';
import { useCurrentUser } from '../../store/auth.js';

const CATEGORIES = [
  { id: 'plomeria',     label: 'Plomería',     icon: I.wrench },
  { id: 'climatiz',     label: 'Climatiz.',    icon: I.flame },
  { id: 'electricidad', label: 'Electricidad', icon: I.spark2 },
  { id: 'mobiliario',   label: 'Mobiliario',   icon: I.bed },
];

const PRIORITIES = ['baja', 'media', 'alta'];

export default function HousekeepingReport() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const user = useCurrentUser();
  const { addTicket } = useActions();
  const rooms = useRooms();

  const [room, setRoom] = useState(params.get('room') || '304');
  const [category, setCategory] = useState('plomeria');
  const [priority, setPriority] = useState('media');
  const [desc, setDesc] = useState('Lavabo del baño · grifo gotea constantemente. Ya coloqué una toalla bajo la salida.');
  const [notify, setNotify] = useState({ maintenance: true, reception: true });

  const send = () => {
    const cat = CATEGORIES.find((c) => c.id === category);
    const slaByPriority = { alta: '01:00', media: '04:00', baja: '24:00' };
    addTicket({
      room,
      category: cat.label,
      desc: desc.trim() || 'Sin descripción',
      reportedBy: 'housekeeping',
      reporter: user?.name || 'Limpieza',
      sla: slaByPriority[priority],
      status: 'abierto',
      priority,
      reportedAt: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    });
    // Regresa a Tasks; el ticket ya está en el store y aparece en Mantenimiento
    navigate('/housekeeping');
  };

  return (
    <PhoneScreen>
      <BrandStrip role="housekeeping"/>
      <AppBar
        eyebrow="Crear ticket → Mantenimiento"
        title="Reportar incidencia"
        leading={<BackBtn label=""/>}
      />
      <Body style={{ paddingBottom: 80 }}>
        <div style={{ padding: '4px 16px 8px' }}>
          <div className="section-eyebrow" style={{ marginBottom: 8 }}>Habitación</div>
          <select
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="card"
            style={{
              width: '100%', padding: 12, fontSize: 13,
              fontFamily: 'inherit', color: 'var(--ink)',
              appearance: 'none', cursor: 'pointer',
            }}
          >
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>Hab. {r.id} · Piso {r.floor} · {r.type}</option>
            ))}
          </select>
        </div>

        <div style={{ padding: '0 16px' }}>
          <div className="section-eyebrow" style={{ margin: '12px 0 8px' }}>Categoría</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {CATEGORIES.map((c) => (
              <CatTile
                key={c.id}
                icon={c.icon}
                label={c.label}
                active={category === c.id}
                onClick={() => setCategory(c.id)}
              />
            ))}
          </div>
        </div>

        <div style={{ padding: '0 16px' }}>
          <div className="section-eyebrow" style={{ margin: '14px 0 8px' }}>Prioridad</div>
          <div style={{
            display: 'flex', padding: 3, borderRadius: 10,
            background: 'var(--card-2)', position: 'relative',
          }}>
            {PRIORITIES.map((p) => (
              <button key={p} onClick={() => setPriority(p)} style={{
                flex: 1, padding: '8px 0', border: 'none', cursor: 'pointer',
                background: priority === p ? 'var(--card)' : 'transparent',
                color:      priority === p ? 'var(--ink)'  : 'var(--muted)',
                borderRadius: 8, fontSize: 12, fontWeight: 500,
                boxShadow:  priority === p ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                fontFamily: 'inherit', textTransform: 'capitalize',
              }}>{p}</button>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 16px' }}>
          <div className="section-eyebrow" style={{ margin: '14px 0 8px' }}>Descripción</div>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="card"
            style={{
              width: '100%', padding: 12, fontSize: 13, color: 'var(--ink-2)',
              minHeight: 90, lineHeight: 1.5, resize: 'vertical',
              fontFamily: 'inherit', border: '1px solid var(--line)',
            }}
          />
        </div>

        <div style={{ padding: '0 16px' }}>
          <div className="section-eyebrow" style={{ margin: '14px 0 8px' }}>Notificar a</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <NotifyToggle role="maintenance" text="Mantenimiento · turno mat."
              on={notify.maintenance} onClick={() => setNotify({...notify, maintenance: !notify.maintenance})}/>
            <NotifyToggle role="reception" text="Recepción · solo informativo"
              on={notify.reception} onClick={() => setNotify({...notify, reception: !notify.reception})}/>
          </div>
        </div>

        <div style={{ padding: '16px', display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => navigate(-1)}>Cancelar</button>
          <button className="btn btn-primary" style={{ flex: 2 }} onClick={send}>
            Enviar ticket
          </button>
        </div>
      </Body>
    </PhoneScreen>
  );
}

function CatTile({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: 12, borderRadius: 12,
      background: active ? 'var(--forest)' : 'var(--card)',
      border: `1px solid ${active ? 'var(--forest)' : 'var(--line)'}`,
      color: active ? 'var(--bg)' : 'var(--ink)',
      display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 500,
      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
    }}>
      <span style={{ color: active ? 'var(--brass-soft)' : 'var(--brass-deep)' }}>{icon}</span>
      {label}
    </button>
  );
}

function NotifyToggle({ role, text, on, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
      background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 10,
      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
    }}>
      <RoleChip role={role}/>
      <div style={{ flex: 1, fontSize: 12 }}>{text}</div>
      <div style={{
        width: 32, height: 18, borderRadius: 999,
        background: on ? 'var(--forest)' : 'var(--hairline)',
        position: 'relative', transition: 'background .15s',
      }}>
        <div style={{
          position: 'absolute', top: 2, left: on ? 16 : 2,
          width: 14, height: 14, borderRadius: '50%', background: '#fff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
          transition: 'left .15s',
        }}/>
      </div>
    </button>
  );
}
