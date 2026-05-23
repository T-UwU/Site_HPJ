// src/roles/reception/GuestDetail.jsx — Timeline + acciones rápidas.
// Migrado de screens-reception.jsx::ReceptionGuestDetail.
// · Recibe :guestId que puede ser el id de la arrival O el id de un room
//   (ambos resuelven al detalle de la habitación correspondiente).
// · Los chips de status se derivan del arrival si existe.

import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  PhoneScreen, Body, Card, Pill, Avatar, BackBtn,
} from '../../ui/shared.jsx';
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
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Card style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar name={guestName} size={44} tone="brass"/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{guestName}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                {arrival?.stay || '—'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted-2)', marginTop: 1 }}>
                {arrival?.plan || '—'}
              </div>
            </div>
          </Card>

          {arrival && !arrival.done && (
            <button
              className="btn btn-primary"
              style={{ width: '100%', fontSize: 14 }}
              onClick={() => navigate(`/reception/checkin/${arrival.id}`)}
            >
              Check-in
            </button>
          )}
        </div>
      </Body>
    </PhoneScreen>
  );
}
