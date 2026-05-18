// src/roles/reception/Home.jsx — Dashboard del día.
// Migrado de screens-reception.jsx::ReceptionHome.
// · Lee arrivals del store (próximas llegadas)
// · Las cards de "Check-ins / Check-outs hoy" navegan a Llegadas
// · Cada llegada en la lista navega al detalle de la habitación

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PhoneScreen, BrandStrip, AppBar, IconBtn, Body, Metric, Eyebrow,
  Card, Avatar, Pill, Broadcast,
} from '../../ui/shared.jsx';
import { I } from '../../ui/icons.jsx';
import { useCurrentUser } from '../../store/auth.js';
import { useArrivals } from '../../store/data.js';
import { useChatUnread } from '../../store/chat.js';

export default function ReceptionHome() {
  const navigate = useNavigate();
  const user   = useCurrentUser();
  const arrivals = useArrivals();
  const pending  = arrivals.filter((a) => !a.done);
  const unread   = useChatUnread(user?.roleId);

  return (
    <PhoneScreen>
      <BrandStrip role="reception"/>
      <AppBar
        eyebrow="Lunes · 13 mayo"
        title={`Buenos días, ${user?.name?.split(' ')[0] || 'huésped'}`}
        serif
        trailing={<>
          <IconBtn icon={I.search}/>
          <IconBtn icon={I.bell} badge={unread || undefined} onClick={() => navigate('/reception/chat')}/>
        </>}
      />
      <Body style={{ paddingBottom: 80 }}>
        <div style={{ padding: '8px 16px 0', display: 'flex', gap: 8 }}>
          <Metric label="Ocupación" value="86%" sub="+4" kind="up" foot="62 de 72 hab."/>
          <Metric label="ADR" value="$3,840" sub="MXN" foot="—"/>
        </div>

        <Eyebrow right="ver todo">Pulso del día</Eyebrow>
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
        </div>

        <Eyebrow right="hace 2 min">Actividad cruzada</Eyebrow>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Broadcast from="housekeeping" action="Habitación 217 lista para entrega" room="217" time="08:42" status="read"/>
          <Broadcast from="sales" action="Reserva confirmada para 304 · 16:30" room="304" time="08:38"/>
          <Broadcast from="maintenance" action="Aire acond. reparado, vuelve a stock" room="412" time="08:21" status="read"/>
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
