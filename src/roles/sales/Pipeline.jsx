// src/roles/sales/Pipeline.jsx — Pipeline de reservas.
// Migrado de screens-sales.jsx::SalesPipeline.
// · Lee reservations del store
// · Card tap → /sales/customer/:customerId (si tiene customer) o detalle inline
// · Volumen del día es un gráfico cosmético — vendría de un dataservice real

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PhoneScreen, BrandStrip, AppBar, IconBtn, Body, Eyebrow, Card, Pill,
} from '../../ui/shared.jsx';
import { I } from '../../ui/icons.jsx';
import { useReservations } from '../../store/data.js';

export default function SalesPipeline() {
  const navigate = useNavigate();
  const reservations = useReservations();
  const [filter, setFilter] = useState('hoy');

  // Filtros
  const filters = [
    { id: 'hoy',   label: `Hoy ${reservations.filter((r) => r.today).length}` },
    { id: 'todas', label: `Todas ${reservations.length}` },
    { id: 'vip',   label: `VIP ${reservations.filter((r) => r.vip).length}` },
  ];

  const visible = reservations.filter((r) => {
    if (filter === 'hoy')    return r.today;
    if (filter === 'vip')    return r.vip;
    if (filter === 'grupos') return r.group;
    return true;
  });

  const today = visible.filter((r) => r.today);
  const upcoming = visible.filter((r) => !r.today);

  const totalConfirmed = reservations.filter((r) => r.status === 'confirmada').length;
  const totalPending   = reservations.filter((r) => r.status === 'por-confirmar').length;

  return (
    <PhoneScreen>
      <BrandStrip role="sales"/>
      <AppBar
        eyebrow="Equipo · Sofía Ramírez"
        title="Reservas"
        subtitle={`${totalConfirmed} confirmadas · ${totalPending} por confirmar`}
        trailing={<>
          <IconBtn icon={I.search}/>
          <IconBtn icon={I.plus} onClick={() => navigate('/sales/new')}/>
        </>}
      />
      <div style={{ padding: '4px 16px 6px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`pill ${filter === f.id ? 'pill-forest' : ''}`}
            style={{ whiteSpace: 'nowrap', border: 'none', cursor: 'pointer' }}
          >{f.label}</button>
        ))}
      </div>

      <Body style={{ paddingBottom: 80 }}>
        {today.length > 0 && (
          <>
            <Eyebrow>Llegan hoy</Eyebrow>
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {today.map((r) => (
                <ReservationCard
                  key={r.id}
                  reservation={r}
                  onClick={() => r.customerId
                    ? navigate(`/sales/customer/${r.customerId}`)
                    : null
                  }
                />
              ))}
            </div>
          </>
        )}

        {upcoming.length > 0 && (
          <>
            <Eyebrow>Próximos 7 días</Eyebrow>
            <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {upcoming.map((r) => (
                <ReservationCard
                  key={r.id}
                  reservation={r}
                  onClick={() => r.customerId
                    ? navigate(`/sales/customer/${r.customerId}`)
                    : null
                  }
                />
              ))}
            </div>
          </>
        )}
      </Body>
    </PhoneScreen>
  );
}

function ReservationCard({ reservation, onClick }) {
  const { guestName, channel, stay, plan, amount, vip, status } = reservation;
  const statusMap = {
    'confirmada':    { kind: 'ok',   label: 'Confirmada' },
    'por-confirmar': { kind: 'warn', label: 'Por confirmar' },
    'seguimiento':   { kind: 'info', label: 'Seguimiento' },
  }[status] || { kind: '', label: status };
  return (
    <Card style={{ padding: 14 }} onClick={onClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{guestName}</span>
            {vip && <span style={{ fontFamily: 'var(--serif)', fontSize: 10, color: 'var(--brass-deep)', letterSpacing: '0.2em' }}>VIP</span>}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted-2)', marginTop: 3 }}>{channel}</div>
        </div>
        <Pill kind={statusMap.kind}>{statusMap.label}</Pill>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line-soft)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{stay}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{plan}</div>
        </div>
        <div className="hpj-serif" style={{ fontSize: 18, fontWeight: 500, flexShrink: 0 }}>
          MXN {amount.toLocaleString('es-MX')}
        </div>
      </div>
    </Card>
  );
}
