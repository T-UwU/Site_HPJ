// src/roles/sales/NewReservation.jsx — Crear nueva reserva.
// Migrado de screens-sales.jsx::SalesNewReservation.
// · Formulario funcional con cálculo dinámico de total
// · Al confirmar → addReservation() del store + navega al Pipeline
// · Si el huésped tiene customerId conocido, jala los insights al confirmar
//   (TODO: integrar lookup por nombre en producción)

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PhoneScreen, BrandStrip, AppBar, IconBtn, Body, Eyebrow, Card, Pill, KV, BackBtn,
} from '../../ui/shared.jsx';
import { I } from '../../ui/icons.jsx';
import { useRoomTypes, useActions } from '../../store/data.js';

const PLANS = [
  { id: 'solo',    label: 'Solo hosp.',     extraPerNight: 0 },
  { id: 'desa',    label: 'Desayuno',       extraPerNight: 280 },
  { id: 'media',   label: 'Media pensión',  extraPerNight: 560 },
  { id: 'pension', label: 'Pensión',        extraPerNight: 920 },
];

export default function SalesNewReservation({ role = 'sales' }) {
  const navigate = useNavigate();
  const roomTypes = useRoomTypes();
  const { addReservation } = useActions();

  // Estado del formulario
  const [guestName, setGuestName] = useState('Carolina Mendoza');
  const [contact, setContact]     = useState('+52 55 8421 0033 · WhatsApp');
  const [checkIn]                 = useState('13 may');
  const [checkOut]                = useState('16 may');
  const [nights]                  = useState(3);
  const [guests]                  = useState({ adults: 2, kids: 0 });
  const [roomTypeId, setRoomTypeId] = useState(roomTypes[0]?.id);
  const [planId, setPlanId]       = useState('desa');

  const selectedRoom = roomTypes.find((rt) => rt.id === roomTypeId) || roomTypes[0];
  const selectedPlan = PLANS.find((p) => p.id === planId);

  // Cálculo dinámico del total
  const totals = useMemo(() => {
    const roomSubtotal = (selectedRoom?.pricePerNight || 0) * nights;
    const planSubtotal = (selectedPlan?.extraPerNight || 0) * nights;
    const subtotal = roomSubtotal + planSubtotal;
    const taxes = Math.round(subtotal * 0.18);
    return {
      roomSubtotal,
      planSubtotal,
      subtotal,
      taxes,
      total: subtotal + taxes,
    };
  }, [selectedRoom, selectedPlan, nights]);

  const confirm = () => {
    addReservation({
      guestName,
      channel: role === 'reception' ? 'Recepción directa' : 'Llamada directa · Ventas',
      stay: `${checkIn}–${checkOut} · ${nights}n`,
      checkIn, checkOut, nights,
      room: '—',
      roomType: selectedRoom.name,
      plan: selectedPlan.label === 'Solo hosp.' ? 'Solo hospedaje' : selectedPlan.label,
      amount: totals.total,
      status: 'confirmada',
      vip: false, group: false, today: false,
    });
    navigate(`/${role}`);
  };

  return (
    <PhoneScreen>
      <BrandStrip role={role}/>
      <AppBar
        eyebrow={role === 'reception' ? 'Recepción · presencial' : 'Llamada en curso · 04:18'}
        title="Nueva reserva"
        leading={<BackBtn label=""/>}
        trailing={<IconBtn icon={I.phone} style={{ background: 'var(--ok)', color: '#fff', border: 'none' }}/>}
      />
      <Body style={{ paddingBottom: 80 }}>
        <div style={{ padding: '4px 16px 0' }}>
          <FormField label="Huésped principal" value={guestName} onChange={setGuestName}
            pill={<Pill kind="brass">CLUB JULIO</Pill>}/>
          <FormField label="Contacto" value={contact} onChange={setContact} icon={I.phone}/>
        </div>

        <Eyebrow>Estancia</Eyebrow>
        <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <DateChip label="Llegada" value={checkIn} sub="Lun · 16:30"/>
          <DateChip label="Salida"  value={checkOut} sub="Jue · 12:00"/>
        </div>

        <div style={{ padding: '8px 16px 0' }}>
          <div className="card" style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="section-eyebrow" style={{ marginBottom: 4 }}>Noches</div>
              <div className="hpj-serif" style={{ fontSize: 20 }}>{nights}</div>
            </div>
            <div>
              <div className="section-eyebrow" style={{ marginBottom: 4, textAlign: 'right' }}>Huéspedes</div>
              <div className="hpj-serif" style={{ fontSize: 20, textAlign: 'right' }}>
                {guests.adults} · {guests.kids} niños
              </div>
            </div>
          </div>
        </div>

        <Eyebrow>Tipo de habitación</Eyebrow>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {roomTypes.map((rt) => (
            <RoomTypeRow
              key={rt.id}
              name={rt.name}
              price={`MXN ${rt.pricePerNight.toLocaleString('es-MX')} / n`}
              features={rt.features}
              active={rt.id === roomTypeId}
              onClick={() => setRoomTypeId(rt.id)}
            />
          ))}
        </div>

        <Eyebrow>Plan</Eyebrow>
        <div style={{ padding: '0 16px', display: 'flex', gap: 8 }}>
          {PLANS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlanId(p.id)}
              className={`pill ${planId === p.id ? 'pill-dark' : ''}`}
              style={{
                flex: 1, justifyContent: 'center', height: 30,
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >{p.label}</button>
          ))}
        </div>

        <Eyebrow>Resumen</Eyebrow>
        <div style={{ padding: '0 16px' }}>
          <Card style={{ padding: 14 }}>
            <KV
              k={`${nights} noches · ${selectedRoom?.name || '—'}`}
              v={`MXN ${totals.roomSubtotal.toLocaleString('es-MX')}`}
            />
            {selectedPlan && selectedPlan.id !== 'solo' && (
              <KV
                k={`${selectedPlan.label} (${nights})`}
                v={`MXN ${totals.planSubtotal.toLocaleString('es-MX')}`}
              />
            )}
            <KV k="Impuestos (18%)" v={`MXN ${totals.taxes.toLocaleString('es-MX')}`}/>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '10px 0 0', fontSize: 14,
            }}>
              <span style={{ fontWeight: 600 }}>Total</span>
              <span className="hpj-serif" style={{ fontSize: 20, fontWeight: 500 }}>
                MXN {totals.total.toLocaleString('es-MX')}
              </span>
            </div>
          </Card>
        </div>

        <div style={{ padding: '16px', display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }}>Guardar</button>
          <button className="btn btn-primary" style={{ flex: 2 }} onClick={confirm}>
            Confirmar y enviar a Recepción
          </button>
        </div>
      </Body>
    </PhoneScreen>
  );
}

function FormField({ label, value, pill, icon, onChange }) {
  return (
    <div style={{
      padding: '10px 14px', marginBottom: 8,
      borderRadius: 10, background: 'var(--card)', border: '1px solid var(--line)',
    }}>
      <div className="section-eyebrow" style={{ marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon && <span style={{ color: 'var(--brass-deep)' }}>{icon}</span>}
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          style={{
            flex: 1, fontSize: 14, padding: 0, border: 'none',
            background: 'transparent', fontFamily: 'inherit', color: 'inherit',
            outline: 'none',
          }}
        />
        {pill}
      </div>
    </div>
  );
}

function DateChip({ label, value, sub }) {
  return (
    <div style={{
      padding: 12, borderRadius: 10,
      background: 'var(--card)', border: '1px solid var(--line)',
    }}>
      <div className="section-eyebrow">{label}</div>
      <div className="hpj-serif" style={{ fontSize: 22, marginTop: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>
    </div>
  );
}

function RoomTypeRow({ name, price, features, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: 12, borderRadius: 12,
      background: active ? 'var(--forest-soft)' : 'var(--card)',
      border: `1.5px solid ${active ? 'var(--forest)' : 'var(--line)'}`,
      display: 'flex', alignItems: 'center', gap: 12,
      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
      color: 'inherit',
    }}>
      <span style={{
        width: 18, height: 18, borderRadius: '50%',
        border: `1.5px solid ${active ? 'var(--forest)' : 'var(--hairline)'}`,
        background: active ? 'var(--forest)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--bg)' }}/>}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{name}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{features}</div>
      </div>
      <div className="hpj-serif" style={{ fontSize: 15, fontWeight: 500, flexShrink: 0 }}>{price}</div>
    </button>
  );
}
