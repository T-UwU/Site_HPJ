// src/roles/reception/Home.jsx — Dashboard del día.
// Migrado de screens-reception.jsx::ReceptionHome.
// · Lee arrivals del store (próximas llegadas)
// · Las cards de "Check-ins / Check-outs hoy" navegan a Llegadas
// · Cada llegada en la lista navega al detalle de la habitación

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PhoneScreen, BrandStrip, AppBar, IconBtn, Body, Eyebrow,
  Card, Avatar, Pill,
} from '../../ui/shared.jsx';
import { I } from '../../ui/icons.jsx';
import { useCurrentUser } from '../../store/auth.js';
import { useArrivals } from '../../store/data.js';
import { useActivity, useActivityUnread } from '../../store/activity.js';

const ROLE_LABEL = {
  reception: 'Recepción', housekeeping: 'Limpieza',
  sales: 'Ventas', maintenance: 'Mantenimiento',
};

export default function ReceptionHome() {
  const navigate = useNavigate();
  const user     = useCurrentUser();
  const arrivals = useArrivals();
  const pending  = arrivals.filter((a) => !a.done);
  const unread   = useActivityUnread(user?.roleId);
  const events   = useActivity((s) => s.events);

  return (
    <PhoneScreen>
      <BrandStrip role="reception"/>
      <AppBar
        eyebrow="Lunes · 13 mayo"
        title={`Buenos días, ${user?.name?.split(' ')[0] || 'huésped'}`}
        serif
        trailing={<>
          <IconBtn icon={I.search}/>
          <IconBtn icon={I.bell} badge={unread || undefined} onClick={() => navigate('/reception/notifications')}/>
        </>}
      />
      <Body style={{ paddingBottom: 80 }}>
        <Eyebrow right={<span style={{ cursor: 'pointer' }} onClick={() => navigate('/reception/arrivals')}>ver llegadas →</span>}>Pulso del día</Eyebrow>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Card
            style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}
            onClick={() => navigate('/reception/arrivals')}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: 'var(--brass-soft)',
              color: 'var(--brass-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{I.key}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Check-ins hoy</div>
              <div className="hpj-serif" style={{ fontSize: 22 }}>
                {arrivals.length} <span style={{ fontSize: 13, color: 'var(--muted)' }}>· {pending.length} llegadas pendientes</span>
              </div>
            </div>
            <span style={{ color: 'var(--muted-2)' }}>{I.chevR}</span>
          </Card>

          <Card style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: 'var(--forest-soft)',
              color: 'var(--forest-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{I.arrow}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Check-outs hoy</div>
              <div className="hpj-serif" style={{ fontSize: 22 }}>9 <span style={{ fontSize: 13, color: 'var(--muted)' }}>· 3 en proceso</span></div>
            </div>
            <span style={{ color: 'var(--muted-2)' }}>{I.chevR}</span>
          </Card>

          <Card
            style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}
            onClick={() => navigate('/reception/new')}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: '#EDE6F4',
              color: '#7C5F8A', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{I.plus}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Nueva reserva</div>
              <div style={{ fontSize: 13, marginTop: 2 }}>Registrar huésped directo</div>
            </div>
            <span style={{ color: 'var(--muted-2)' }}>{I.chevR}</span>
          </Card>
        </div>

        <Eyebrow right={<span style={{ cursor: 'pointer' }} onClick={() => navigate('/reception/notifications')}>ver todo</span>}>
          Actividad cruzada
        </Eyebrow>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {events.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--muted)', padding: '4px 0' }}>Sin actividad reciente.</div>
          ) : (
            events.slice(0, 3).map((ev) => (
              <ActivityRow key={ev.id} ev={ev}/>
            ))
          )}
        </div>

        <Eyebrow>Próximas llegadas</Eyebrow>
        <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pending.slice(0, 3).map((a) => (
            <ArrivalRow
              key={a.id}
              vip={a.vip} name={a.guest} room={a.room} plan={a.plan} time={a.time} status={a.status}
              onClick={() => navigate(`/reception/guest/${a.id}`)}
            />
          ))}
        </div>
      </Body>
    </PhoneScreen>
  );
}

const ROLE_COLOR = {
  reception: 'var(--brass)', housekeeping: 'var(--info)',
  sales: '#7C5F8A', maintenance: 'var(--danger)',
};

function ActivityRow({ ev }) {
  const color = ROLE_COLOR[ev.role] || 'var(--ink-3)';
  const label = ROLE_LABEL[ev.role] || ev.role;
  const time  = new Date(ev.created_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  return (
    <div style={{
      padding: '10px 12px', borderRadius: 10, background: 'var(--card-2)',
      border: '1px dashed var(--hairline)', display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }}/>
      <div style={{ flex: 1, fontSize: 12 }}>
        <div><b style={{ fontWeight: 600 }}>{label}</b> · {ev.action}</div>
        {ev.room && <div style={{ color: 'var(--muted)', fontSize: 11, marginTop: 2 }}>Hab {ev.room} · {time}</div>}
        {!ev.room && <div style={{ color: 'var(--muted)', fontSize: 11, marginTop: 2 }}>{time}</div>}
      </div>
    </div>
  );
}

function ArrivalRow({ name, room, plan, time, status, vip, onClick }) {
  return (
    <Card style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12 }} onClick={onClick}>
      <Avatar name={name} size={36}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>{name}</span>
          {vip && <span style={{ fontFamily: 'var(--serif)', fontSize: 10, color: 'var(--brass-deep)', letterSpacing: '0.2em' }}>VIP</span>}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Hab {room} · {plan}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="hpj-mono" style={{ fontSize: 13, color: 'var(--ink-2)' }}>{time}</div>
        <Pill kind={status} style={{ marginTop: 4, height: 18, fontSize: 10 }}>
          {status === 'warn' ? 'Hab limpiando' : status === 'ok' ? 'Lista' : 'Programada'}
        </Pill>
      </div>
    </Card>
  );
}
