// src/roles/housekeeping/Tasks.jsx — Mis tareas (lista).
// Migrado de screens-housekeeping.jsx::HousekeepingTasks.
// · Lee tasks del store
// · Cada card navega a /housekeeping/task/:id
// · FAB navega a /housekeeping/report (crear ticket de mantenimiento)

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PhoneScreen, BrandStrip, AppBar, IconBtn, Body, Eyebrow,
  Card, Pill, FAB, Icon,
} from '../../ui/shared.jsx';
import { I } from '../../ui/icons.jsx';
import { useTasks } from '../../store/data.js';

export default function HousekeepingTasks() {
  const navigate = useNavigate();
  const tasks = useTasks();

  const pending   = tasks.filter((t) => t.status !== 'completada');
  const completed = tasks.filter((t) => t.status === 'completada');
  const pct = tasks.length === 0
    ? 0
    : Math.round((completed.length / tasks.length) * 100);

  return (
    <PhoneScreen>
      <BrandStrip role="housekeeping"/>
      <AppBar
        eyebrow="Mariana Cruz · Piso 3"
        title="Mis tareas"
        subtitle={`${tasks.length} asignadas · ${completed.length} completadas`}
        trailing={<>
          <IconBtn icon={I.filter}/>
          <IconBtn icon={I.bell} badge="2"/>
        </>}
      />
      <ProgressBar pct={pct}/>
      <Body style={{ paddingBottom: 80 }}>
        <Eyebrow right="ordenar por prioridad">Pendientes</Eyebrow>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pending.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onClick={() => navigate(`/housekeeping/task/${t.id}`)}
            />
          ))}
        </div>

        {completed.length > 0 && (
          <>
            <Eyebrow>Completadas hoy</Eyebrow>
            <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {completed.map((t) => (
                <DoneRow key={t.id} room={t.room} type={t.typeLabel || t.type} time={t.completedAt || '—'}/>
              ))}
            </div>
          </>
        )}
      </Body>
      <FAB icon={I.cam} label="Reportar incidencia" onClick={() => navigate('/housekeeping/report')}/>
    </PhoneScreen>
  );
}

function ProgressBar({ pct }) {
  return (
    <div style={{ padding: '0 18px 12px' }}>
      <div style={{
        height: 8, borderRadius: 999, background: 'var(--card-2)',
        border: '1px solid var(--line)', overflow: 'hidden', position: 'relative',
      }}>
        <div style={{
          width: pct + '%', height: '100%', background: 'var(--forest)',
          borderRadius: 999, transition: 'width .3s',
        }}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
        <span>Avance del turno</span>
        <span className="hpj-mono">{pct}%</span>
      </div>
    </div>
  );
}

function TaskCard({ task, onClick }) {
  const { room, typeLabel, type, priority, note, sla, tags = [], status, progress, total } = task;
  const active = status === 'en-curso';
  const prioColor =
    priority === 'alta'  ? 'var(--danger)' :
    priority === 'media' ? 'var(--warn)'   :
    'var(--muted-2)';

  return (
    <Card style={{ padding: 14, borderLeft: `3px solid ${prioColor}`, position: 'relative' }} onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 10,
          background: active ? 'var(--brass-soft)' : 'var(--forest-soft)',
          color: active ? 'var(--brass-deep)' : 'var(--forest-deep)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--serif)', flexShrink: 0,
        }}>
          <span style={{ fontSize: 18, fontWeight: 500, lineHeight: 1 }}>{room}</span>
          <span style={{ fontSize: 8, marginTop: 2, letterSpacing: '0.1em' }}>HAB.</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{typeLabel || type}</span>
            <Pill kind={priority === 'alta' ? 'danger' : priority === 'media' ? 'warn' : ''}
              style={{ height: 18, fontSize: 10 }}>{priority.toUpperCase()}</Pill>
          </div>
          {note && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, lineHeight: 1.45 }}>{note}</div>}
          {sla && (
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: 'var(--muted-2)' }}>{I.clock}</span>
              <span className="hpj-mono">{sla}</span>
            </div>
          )}
        </div>
      </div>

      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 10 }}>
          {tags.map((t) => (
            <Pill key={t} kind={t.toLowerCase().includes('sin') ? 'danger' : 'ghost'} style={{ height: 18, fontSize: 10 }}>{t}</Pill>
          ))}
        </div>
      )}

      {active && total && (
        <div style={{ marginTop: 10, padding: 10, borderRadius: 10, background: 'var(--brass-soft)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--brass-deep)', fontWeight: 600 }}>
            <span style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>EN CURSO</span>
            <span className="hpj-mono">Checklist {progress}/{total}</span>
          </div>
          <div style={{
            marginTop: 6, height: 4, borderRadius: 999,
            background: 'rgba(160,129,74,0.18)', overflow: 'hidden',
          }}>
            <div style={{ width: (progress / total * 100) + '%', height: '100%', background: 'var(--brass)' }}/>
          </div>
        </div>
      )}
    </Card>
  );
}

function DoneRow({ room, type, time }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 12px', borderRadius: 10,
      background: 'var(--card-2)', border: '1px solid var(--line-soft)',
      opacity: 0.85,
    }}>
      <span style={{
        width: 26, height: 26, borderRadius: 999, background: 'var(--ok-soft)',
        color: 'var(--ok)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}><Icon size={14} d={<path d="M4 12l5 5L20 6"/>} sw={2}/></span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13 }}><b style={{ fontWeight: 600 }}>Hab {room}</b> · {type}</div>
      </div>
      <span className="hpj-mono" style={{ fontSize: 11, color: 'var(--muted-2)' }}>{time}</span>
    </div>
  );
}
