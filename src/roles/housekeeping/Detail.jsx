// src/roles/housekeeping/Detail.jsx — Detalle de tarea con checklist.
// Migrado de screens-housekeeping.jsx::HousekeepingDetail.
// · Lee task por :id del store
// · "Siguiente paso →" incrementa progress (vía progressTask)
// · Cuando llega a total, navega a /evidence/:id

import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  PhoneScreen, Body, Eyebrow, Pill, BackBtn, Icon,
} from '../../ui/shared.jsx';
import { useTasks, useActions } from '../../store/data.js';

// Checklist hardcoded por tipo de tarea. En producción esto vendría
// de una tabla `task_templates` indexada por type.
const CHECKLIST_BY_TYPE = {
  'salida-vip': [
    'Retirar ropa de cama',
    'Vaciar papeleras',
    'Aspirado completo',
    'Limpieza profunda baño',
    'Cambio de toallas',
    'Reposición de amenities',
    'Tendido de cama · sábana doble firme',
    'Re-stock minibar (cortesía VIP +2 botellas)',
    'Colocar bata + pantuflas talla M',
    'Disposición floral en mesa (cortesía)',
    'Nota manuscrita + chocolates sin nueces',
    'Inspección final + foto',
  ],
  default: [
    'Retirar ropa de cama',
    'Vaciar papeleras',
    'Aspirado completo',
    'Limpieza baño',
    'Cambio de toallas',
    'Reposición de amenities',
    'Inspección final',
  ],
};

export default function HousekeepingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tasks = useTasks();
  const { progressTask, startTask, completeTask } = useActions();

  const task = tasks.find((t) => t.id === id);
  if (!task) return <Navigate to="/housekeeping" replace />;

  const items = CHECKLIST_BY_TYPE[task.type] || CHECKLIST_BY_TYPE.default;
  const total = task.total || items.length;
  const progress = task.progress || 0;

  // Asegurar que estamos "en-curso" cuando se entra al detalle
  // (en producción solo al apretar "Empezar", pero aquí simplificamos)
  if (task.status === 'pendiente') {
    // Lazy start — al tocar "Siguiente paso" arrancamos
  }

  const handleNext = () => {
    if (task.status === 'pendiente') {
      startTask(task.id, 'Mariana C.');
    }

    const newProgress = progress + 1;
    if (newProgress >= total) {
      completeTask(task.id);
      navigate('/housekeeping');
    } else {
      progressTask(task.id, newProgress);
    }
  };

  return (
    <PhoneScreen>
      <div style={{
        padding: '12px 18px 14px', background: 'var(--forest-deep)',
        color: 'var(--bg)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <BackBtn label="Mis tareas"/>
          <span className="hpj-mono" style={{ fontSize: 11, opacity: 0.6, letterSpacing: '0.06em' }}>{task.id}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
          <div className="hpj-serif" style={{ fontSize: 44, lineHeight: 1, color: 'var(--bg)' }}>{task.room}</div>
          <div style={{ flex: 1, paddingBottom: 4 }}>
            {task.tags?.includes('VIP') && (
              <div style={{ fontFamily: 'var(--serif)', fontSize: 11, letterSpacing: '0.22em', color: 'var(--brass)' }}>
                VIP {task.tags.includes('Aniversario') && '· ANIVERSARIO'}
              </div>
            )}
            <div style={{ fontSize: 14, marginTop: 2 }}>{task.typeLabel || task.type}</div>
            {task.note && <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>{task.note.split(' · ')[0]}</div>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
          <span className="pill pill-brass" style={{ background: 'var(--brass)', color: '#FAF4E6' }}>
            {task.status === 'en-curso' ? `EN CURSO · ${progress}/${total}` : 'PENDIENTE'}
          </span>
          {task.tags?.includes('Sin frutos secos') && (
            <Pill kind="danger">Sin frutos secos</Pill>
          )}
        </div>
      </div>

      <Body style={{ paddingBottom: 80 }}>
        <Eyebrow right={`${progress} de ${total}`}>Checklist · {task.typeLabel || task.type}</Eyebrow>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {items.map((text, i) => {
            const isDone   = i < progress;
            const isActive = i === progress;
            // Marcar "warn" al item que tiene 'sin' o 'frutos' si el guest tiene allergén
            const isAllergen = /frutos|alergia|sin/i.test(text) && task.tags?.includes('Sin frutos secos');
            return <CheckItem key={i} text={text} done={isDone} active={isActive} warn={isAllergen && !isDone}/>;
          })}
        </div>

        <Eyebrow>Notas de Recepción</Eyebrow>
        <div style={{ padding: '0 16px' }}>
          <div style={{
            padding: 12, borderRadius: 10, background: 'var(--card-2)',
            border: '1px solid var(--line)', fontSize: 12, lineHeight: 1.5,
          }}>
            <div style={{ fontSize: 11, color: 'var(--brass-deep)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 6 }}>
              LUCÍA · RECEPCIÓN · 13:24
            </div>
            {task.note || `Tarea estándar para habitación ${task.room}.`}
          </div>
        </div>

        <div style={{ padding: '16px', display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }}>Pausar</button>
          <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleNext}>
            {progress + 1 >= total ? 'Completar tarea ✓' : `Siguiente paso (${progress + 1}/${total}) →`}
          </button>
        </div>
      </Body>
    </PhoneScreen>
  );
}

function CheckItem({ text, done, active, warn }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 4px',
      borderBottom: '1px solid var(--line-soft)',
    }}>
      <span style={{
        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
        background: done ? 'var(--forest)' : active ? 'var(--brass-soft)' : 'var(--card)',
        border: `1.5px solid ${done ? 'var(--forest)' : active ? 'var(--brass)' : warn ? 'var(--danger)' : 'var(--hairline)'}`,
        color: done ? 'var(--bg)' : active ? 'var(--brass-deep)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {done && <Icon size={14} d={<path d="M4 12l5 5L20 6"/>} sw={2.5}/>}
        {active && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brass)' }}/>}
      </span>
      <span style={{
        flex: 1, fontSize: 13,
        color: done ? 'var(--muted-2)' : 'var(--ink)',
        textDecoration: done ? 'line-through' : 'none',
        fontWeight: active ? 500 : 400,
      }}>{text}</span>
      {warn && <Pill kind="danger" style={{ height: 18, fontSize: 10 }}>ALERGIA</Pill>}
      {active && <Pill kind="brass" style={{ height: 18, fontSize: 10 }}>AHORA</Pill>}
    </div>
  );
}
