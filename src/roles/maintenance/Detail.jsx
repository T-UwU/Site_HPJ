// src/roles/maintenance/Detail.jsx — Detalle de ticket.
// Migrado de screens-maintenance.jsx::MaintenanceDetail.
// · Lee ticket por :id del store
// · "Aceptar" → acceptTicket() (status → aceptado, progress = 0)
// · Si ya está aceptado, botón cambia a "Marcar como resuelto" → closeTicket()
// · Sustituí "Mariana Cruz" hardcoded por ticket.reporter

import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  PhoneScreen, Body, Eyebrow, Card, Pill, Avatar, BackBtn, RoleChip, PhotoTile,
} from '../../ui/shared.jsx';
import { I } from '../../ui/icons.jsx';
import { useTickets, useActions } from '../../store/data.js';

export default function MaintenanceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tickets = useTickets();
  const { acceptTicket, closeTicket } = useActions();

  const ticket = tickets.find((t) => t.id === id);
  if (!ticket) return <Navigate to="/maintenance" replace />;

  const isAccepted = ticket.status === 'aceptado';
  const isOpen     = ticket.status === 'abierto';

  const primaryAction = () => {
    if (isOpen) {
      acceptTicket(ticket.id);
    } else if (isAccepted) {
      closeTicket(ticket.id);
      navigate('/maintenance');
    }
  };

  const slaUrgent = typeof ticket.sla === 'string' && ticket.sla.startsWith('00:');

  return (
    <PhoneScreen>
      <div style={{
        padding: '12px 18px 14px', background: '#3A2722', color: 'var(--bg)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <BackBtn label="Tickets"/>
          <span className="hpj-mono" style={{ fontSize: 11, opacity: 0.6, letterSpacing: '0.06em' }}>#{ticket.id}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
          <div className="hpj-serif" style={{ fontSize: 44, lineHeight: 1 }}>{ticket.room}</div>
          <div style={{ flex: 1, paddingBottom: 4 }}>
            <span style={{
              padding: '4px 10px', borderRadius: 999,
              background:
                ticket.priority === 'alta' ? 'var(--danger)' :
                ticket.priority === 'media' ? 'var(--warn)' :
                'var(--muted-2)',
              color: '#fff', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
            }}>
              {ticket.priority === 'alta' && '⚠ '}
              {ticket.priority.toUpperCase()}
              {ticket.priority === 'alta' && ' · HAB. OCUPADA'}
            </span>
            <div style={{ fontSize: 14, marginTop: 8 }}>{ticket.desc}</div>
          </div>
        </div>
        <div style={{
          marginTop: 14, padding: '10px 12px',
          background: 'rgba(255,255,255,0.08)', borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 10, opacity: 0.6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>SLA restante</div>
            <div className="hpj-mono" style={{ fontSize: 22, color: slaUrgent ? 'var(--brass)' : '#fff', fontWeight: 500 }}>
              {ticket.sla}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, opacity: 0.6, letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'right' }}>Reportado</div>
            <div className="hpj-mono" style={{ fontSize: 14, textAlign: 'right' }}>{ticket.reportedAt || '—'}</div>
          </div>
        </div>
      </div>

      <Body style={{ paddingBottom: 80 }}>
        <Eyebrow>Descripción</Eyebrow>
        <div style={{ padding: '0 16px' }}>
          <Card style={{ padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Avatar name={ticket.reporter || 'Sistema'} size={24}/>
              <span style={{ fontSize: 12, fontWeight: 500 }}>
                {ticket.reporter || 'Sistema'} · {ticket.reportedBy || '—'}
              </span>
              <span className="hpj-mono" style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 'auto' }}>
                {ticket.reportedAt || '—'}
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>
              {ticket.desc}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <PhotoTile label="Foto 1" caption={ticket.reportedAt || '—'} tone="muted"/>
              <PhotoTile label="Foto 2" caption={ticket.reportedAt || '—'} tone="muted"/>
              <div style={{ flex: 1 }}/>
            </div>
          </Card>
        </div>

        <Eyebrow>Recursos sugeridos</Eyebrow>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <ResourceRow icon={I.pkg}    text="Sello universal 3''"     stock="14 disp."/>
          <ResourceRow icon={I.pkg}    text="Solución desazolve"      stock="8 disp."/>
          <ResourceRow icon={I.wrench} text="Ventosa profesional"     stock="—"/>
        </div>

        <Eyebrow>Coordinación</Eyebrow>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <CoordRow role="reception"    text="Avisar a huésped · esperar permiso de entrada" status="auto"/>
          <CoordRow role="housekeeping" text="Limpieza post-reparación" status="pending"/>
        </div>

        <div style={{ padding: '16px', display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }}>Pausar</button>
          <button className="btn btn-primary" style={{ flex: 2 }} onClick={primaryAction}>
            {isOpen     && 'Aceptar · en camino'}
            {isAccepted && 'Marcar como resuelto →'}
            {!isOpen && !isAccepted && 'Acción no disponible'}
          </button>
        </div>
      </Body>
    </PhoneScreen>
  );
}

function ResourceRow({ icon, text, stock }) {
  return (
    <div style={{
      padding: '10px 12px', borderRadius: 10,
      background: 'var(--card)', border: '1px solid var(--line)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ color: 'var(--brass-deep)' }}>{icon}</span>
      <div style={{ flex: 1, fontSize: 13 }}>{text}</div>
      <span className="hpj-mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{stock}</span>
    </div>
  );
}

function CoordRow({ role, text, status }) {
  return (
    <div style={{
      padding: '10px 12px', borderRadius: 10,
      background: 'var(--card-2)', border: '1px solid var(--line-soft)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <RoleChip role={role}/>
      <div style={{ flex: 1, fontSize: 12 }}>{text}</div>
      {status === 'auto'    && <Pill kind="info" style={{ height: 18, fontSize: 10 }}>AUTOMÁTICO</Pill>}
      {status === 'pending' && <Pill kind=""     style={{ height: 18, fontSize: 10 }}>AL CERRAR</Pill>}
    </div>
  );
}
