// src/roles/maintenance/Tickets.jsx — Lista de tickets activos.
// Migrado de screens-maintenance.jsx::MaintenanceTickets.
// · Lee tickets del store y filtra por status
// · Tap en card → /maintenance/ticket/:id
// · FAB crea un ticket dummy (TODO: pantalla de captura real)

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PhoneScreen, BrandStrip, AppBar, IconBtn, Body, Eyebrow, Metric,
  Card, Pill, RoleChip, FAB,
} from '../../ui/shared.jsx';
import { I } from '../../ui/icons.jsx';
import { useTickets, useActions } from '../../store/data.js';

export default function MaintenanceTickets() {
  const navigate = useNavigate();
  const tickets = useTickets();
  const { addTicket } = useActions();

  const active = tickets.filter((t) => t.status !== 'cerrado');
  const urgent = active.filter((t) =>
    t.priority === 'alta' || t.status === 'aceptado'
  );
  const scheduled = active.filter((t) => t.status === 'programado');
  const highPriority = active.filter((t) => t.priority === 'alta').length;

  const newDemo = () => {
    addTicket({
      room: '???', category: 'Por definir',
      desc: 'Nuevo ticket (sin descripción)',
      reportedBy: 'maintenance', reporter: 'Eduardo G.',
      sla: '04:00', status: 'abierto', priority: 'media',
      reportedAt: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    });
  };

  return (
    <PhoneScreen>
      <BrandStrip role="maintenance"/>
      <AppBar
        eyebrow="Eduardo Galindo · Turno mat."
        title="Tickets abiertos"
        subtitle={`${active.length} abiertos · ${highPriority} alta prioridad`}
        trailing={<>
          <IconBtn icon={I.filter}/>
          <IconBtn icon={I.bell} badge="2"/>
        </>}
      />
      <Body style={{ paddingBottom: 80 }}>
        <div style={{ padding: '4px 16px 0', display: 'flex', gap: 8 }}>
          <Metric label="SLA en riesgo" value="1" sub="< 30m" kind="down" foot="Ticket #M-217"/>
          <Metric label="MTTR" value="42m" sub="−8m" kind="up" foot="vs. estándar"/>
        </div>

        {urgent.length > 0 && (
          <>
            <Eyebrow>Urgentes</Eyebrow>
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {urgent.map((t) => (
                <TicketCard
                  key={t.id}
                  ticket={t}
                  onClick={() => navigate(`/maintenance/ticket/${t.id}`)}
                />
              ))}
            </div>
          </>
        )}

        {scheduled.length > 0 && (
          <>
            <Eyebrow>Programados</Eyebrow>
            <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {scheduled.map((t) => (
                <TicketCard
                  key={t.id}
                  ticket={t}
                  onClick={() => navigate(`/maintenance/ticket/${t.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </Body>
      <FAB icon={I.plus} label="Nuevo ticket" onClick={newDemo}/>
    </PhoneScreen>
  );
}

function TicketCard({ ticket, onClick }) {
  const { id, room, category, desc, reportedBy, sla, status, priority, progress } = ticket;
  const pColor =
    priority === 'alta' ? 'var(--danger)' :
    priority === 'media' ? 'var(--warn)' :
    'var(--muted-2)';
  const active = status === 'aceptado';
  const slaUrgent = typeof sla === 'string' && sla.startsWith('00:');

  return (
    <Card style={{ padding: 14, borderLeft: `3px solid ${pColor}` }} onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span className="hpj-mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em' }}>#{id}</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <Pill kind={priority === 'alta' ? 'danger' : priority === 'media' ? 'warn' : ''}
            style={{ height: 18, fontSize: 10 }}>{priority.toUpperCase()}</Pill>
          {status === 'aceptado'   && <Pill kind="brass" style={{ height: 18, fontSize: 10 }}>EN CURSO</Pill>}
          {status === 'programado' && <Pill kind="info"  style={{ height: 18, fontSize: 10 }}>PROGRAM.</Pill>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: 'var(--card-2)', color: 'var(--danger)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, border: '1px solid var(--line)',
        }}>{I.wrench}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 500 }}>{room}</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>· {category}</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 3, lineHeight: 1.4 }}>{desc}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
            {reportedBy && <RoleChip role={reportedBy}/>}
            <span className="hpj-mono" style={{ fontSize: 11, color: slaUrgent ? 'var(--danger)' : 'var(--muted)' }}>
              SLA {sla}
            </span>
          </div>
        </div>
      </div>
      {active && (
        <div style={{ marginTop: 10, height: 4, borderRadius: 999, background: 'var(--card-2)', overflow: 'hidden' }}>
          <div style={{ width: (progress || 0) + '%', height: '100%', background: 'var(--brass)' }}/>
        </div>
      )}
    </Card>
  );
}
