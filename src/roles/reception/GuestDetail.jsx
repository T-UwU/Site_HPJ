// src/roles/reception/GuestDetail.jsx — Timeline + acciones rápidas.
// Migrado de screens-reception.jsx::ReceptionGuestDetail.
// · Recibe :guestId que puede ser el id de la arrival O el id de un room
//   (ambos resuelven al detalle de la habitación correspondiente).
// · Los chips de status se derivan del arrival si existe.

import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  PhoneScreen, Body, Eyebrow, Card, Pill, Avatar, IconBtn, TLItem, BackBtn,
} from '../../ui/shared.jsx';
import { I } from '../../ui/icons.jsx';
import { useArrivals, useRooms } from '../../store/data.js';

export default function ReceptionGuestDetail() {
  const { guestId } = useParams();
  const navigate = useNavigate();
  const arrivals = useArrivals();
  const rooms = useRooms();

  // Resolve: si el id empieza con "A-" es una arrival; si no, es room id
  const arrival = arrivals.find((a) => a.id === guestId);
  const room    = arrival
    ? rooms.find((r) => r.id === arrival.room.split(' ')[0]) // "118 + 119" → "118"
    : rooms.find((r) => r.id === guestId);

  if (!arrival && !room) return <Navigate to="/reception/rooms" replace />;

  const guestName = arrival?.guest || room?.guest || 'Huésped';
  const roomId    = arrival?.room || room?.id;

  return (
    <PhoneScreen>
      <div style={{ padding: '12px 18px 0' }}>
        <BackBtn label={`Habitaciones · ${roomId}`} />
      </div>
      <div style={{ padding: '8px 18px 14px' }}>
        <div className="hpj-serif" style={{ fontSize: 28, fontWeight: 500, lineHeight: 1.1 }}>
          Hab. {roomId}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          {arrival?.status === 'warn' && <Pill kind="warn">En limpieza · ETA 14:20</Pill>}
          {arrival?.vip && <Pill kind="brass">VIP</Pill>}
          {!arrival && room?.vipPending && <Pill kind="brass">VIP entrante</Pill>}
        </div>
      </div>

      <Body style={{ paddingBottom: 80 }}>
        <div style={{ padding: '0 16px' }}>
          <Card style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar name={guestName} size={44} tone="brass"/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{guestName}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                {arrival?.stay || '—'} · {arrival?.plan?.split(' · ')[1] || 'sin plan'}
              </div>
            </div>
            <IconBtn icon={I.phone}/>
            <IconBtn icon={I.msg} onClick={() => navigate(`/reception/chat/${guestId}`)}/>
          </Card>
        </div>

        <Eyebrow>Línea de tiempo</Eyebrow>
        <div style={{ padding: '0 18px 6px' }}>
          <div className="tl-rail">
            <TLItem time="07:12" role="sales" done text="Reserva creada" detail="Booking.com · 3 noches"/>
            <TLItem time="08:38" role="reception" done text={`Pre-asignada hab. ${roomId}`} detail="Confirmada VIP"/>
            <TLItem time="11:00" role="housekeeping" done text="Stayover hab. anterior cerrado"/>
            <TLItem time="13:15" role="housekeeping" active text="Limpieza en curso" detail="Mariana Cruz · checklist 7/12"/>
            <TLItem time="14:20" role="housekeeping" text="Entrega prevista" detail="Inspección + amenities VIP"/>
            <TLItem time={arrival?.time || '—'} role="reception" text="Check-in programado"/>
            <TLItem time="—" role="maintenance" text="Revisión preventiva A/C agendada" detail="Antes del check-in"/>
          </div>
        </div>

        <Eyebrow>Acciones rápidas</Eyebrow>
        <div style={{ padding: '0 16px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <QuickAction icon={I.broom} label="Forzar revisión" tone="info"/>
          <QuickAction icon={I.flame} label="Reportar alergia" tone="warn"/>
          <QuickAction icon={I.coffee} label="Modificar plan" tone="brass"/>
          <QuickAction icon={I.sparkle} label="Cortesía VIP" tone="brass"/>
        </div>
      </Body>
    </PhoneScreen>
  );
}

function QuickAction({ icon, label, tone = 'brass', onClick }) {
  const toneMap = {
    brass:  ['var(--brass-soft)', 'var(--brass-deep)'],
    info:   ['var(--info-soft)', 'var(--info)'],
    warn:   ['var(--warn-soft)', 'var(--warn)'],
    forest: ['var(--forest-soft)', 'var(--forest-deep)'],
  };
  const [bg, fg] = toneMap[tone];
  return (
    <button onClick={onClick} style={{
      padding: 12, background: 'var(--card)', border: '1px solid var(--line)',
      borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start',
      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, background: bg, color: fg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <div style={{ fontSize: 12, fontWeight: 500 }}>{label}</div>
    </button>
  );
}
