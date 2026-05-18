// src/roles/housekeeping/Evidence.jsx — Evidencia fotográfica.
// Migrado de screens-housekeeping.jsx::HousekeepingEvidence.
// · "Entregar a Recepción ✓" → completeTask() → regresa a Tasks
// · PhotoTile aquí es local (versión rica con gradiente y aspect-ratio),
//   diferente al PhotoTile simple de shared.jsx que usa Mantenimiento.

import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  PhoneScreen, BrandStrip, AppBar, Body, Eyebrow, Pill, BackBtn,
} from '../../ui/shared.jsx';
import { I } from '../../ui/icons.jsx';
import { useTasks, useActions } from '../../store/data.js';

export default function HousekeepingEvidence() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tasks = useTasks();
  const { completeTask } = useActions();

  const task = tasks.find((t) => t.id === id);
  if (!task) return <Navigate to="/housekeeping" replace />;

  const handleDeliver = () => {
    completeTask(task.id);
    navigate('/housekeeping');
  };

  return (
    <PhoneScreen>
      <BrandStrip role="housekeeping"/>
      <AppBar
        eyebrow={`Hab. ${task.room} · Inspección final`}
        title="Evidencia"
        leading={<BackBtn label=""/>}
      />
      <Body style={{ paddingBottom: 80 }}>
        <div style={{ padding: '4px 16px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <EvidenceBlock label="Cama · Tendido" beforeLabel="Antes" afterLabel="Después"/>
          <EvidenceBlock label="Baño · Limpieza profunda" beforeLabel="Antes" afterLabel="Después" done/>
          <EvidenceBlock label="Detalle VIP · Cortesía" pendient/>
        </div>

        <Eyebrow>Nota para entrega</Eyebrow>
        <div style={{ padding: '0 16px' }}>
          <div style={{
            padding: 12, borderRadius: 12, background: 'var(--card)',
            border: '1px solid var(--line)', fontSize: 13, color: 'var(--ink-2)',
          }}>
            Hab. {task.room} lista. {task.tags?.includes('VIP') && 'Cortesía VIP colocada (botella + nota + chocolates sin nueces). '}
            Cambio de almohadas firmes según preferencia.
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>
              <span>{I.mic}</span> 0:18 audio adjunto
            </div>
          </div>
        </div>

        <div style={{ padding: '16px', display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }}>Pedir revisión</button>
          <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleDeliver}>
            Entregar a Recepción ✓
          </button>
        </div>
      </Body>
    </PhoneScreen>
  );
}

function EvidenceBlock({ label, beforeLabel, afterLabel, done, pendient }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
        {done && <Pill kind="ok" style={{ height: 18, fontSize: 10 }}>VERIFICADO</Pill>}
        {pendient && <Pill kind="warn" style={{ height: 18, fontSize: 10 }}>FALTA FOTO</Pill>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <PhotoCard label={beforeLabel} caption="13:42" tone="muted"/>
        {pendient ? <CameraTile/> : <PhotoCard label={afterLabel} caption="14:08" tone="fresh"/>}
      </div>
    </div>
  );
}

// Versión "rica" del PhotoTile — solo se usa en Evidence
function PhotoCard({ label, caption, tone }) {
  return (
    <div style={{
      position: 'relative', aspectRatio: '4/3', borderRadius: 10, overflow: 'hidden',
      background: tone === 'fresh'
        ? 'linear-gradient(135deg, var(--forest-soft) 0%, var(--card) 100%)'
        : 'linear-gradient(135deg, var(--card-2) 0%, var(--bg-deep) 100%)',
      border: '1px solid var(--line)',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(135deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 8px)',
      }}/>
      <div style={{
        position: 'absolute', top: 6, left: 8, fontSize: 10,
        padding: '2px 8px', borderRadius: 999,
        background: 'rgba(255,255,255,0.7)', color: 'var(--ink-3)',
        backdropFilter: 'blur(6px)', fontWeight: 500,
      }}>{label}</div>
      <div style={{
        position: 'absolute', bottom: 6, right: 8,
        fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)',
      }}>{caption}</div>
    </div>
  );
}

function CameraTile() {
  return (
    <button style={{
      aspectRatio: '4/3', borderRadius: 10,
      background: 'var(--card-2)',
      border: '1.5px dashed var(--hairline)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: 'var(--muted)', gap: 6, fontSize: 11,
      cursor: 'pointer', fontFamily: 'inherit',
    }}>
      <div style={{ color: 'var(--brass)' }}>{I.cam}</div>
      Tomar foto
    </button>
  );
}
