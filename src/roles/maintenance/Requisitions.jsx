// src/roles/maintenance/Requisitions.jsx — Vista de requisiciones (solo lectura).
// Mantenimiento ve el estado de sus pedidos a Compras.

import React from 'react';
import {
  PhoneScreen, BrandStrip, AppBar, Body, Eyebrow, Card, Pill,
} from '../../ui/shared.jsx';
import { I } from '../../ui/icons.jsx';
import { useRequisitions } from '../../store/data.js';

const STATUS_KIND = { pedido: 'warn', 'en-camino': 'info', surtido: 'ok' };
const STATUS_LABEL = { pedido: 'PEDIDO', 'en-camino': 'EN CAMINO', surtido: 'SURTIDO' };

export default function MaintenanceRequisitions() {
  const all  = useRequisitions();
  // Solo las requisiciones del área de mantenimiento
  const reqs = all.filter((r) => r.area === 'maintenance');

  const pedidos   = reqs.filter((r) => r.status === 'pedido');
  const enCamino  = reqs.filter((r) => r.status === 'en-camino');
  const surtidos  = reqs.filter((r) => r.status === 'surtido');

  return (
    <PhoneScreen>
      <BrandStrip role="maintenance"/>
      <AppBar
        eyebrow="Estado de mis pedidos"
        title="Requisiciones"
        subtitle={`${pedidos.length} pendientes · ${enCamino.length} en camino`}
      />
      <Body style={{ paddingBottom: 24 }}>
        {reqs.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            Sin requisiciones registradas.
          </div>
        )}

        {enCamino.length > 0 && (
          <>
            <Eyebrow>En camino</Eyebrow>
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {enCamino.map((r) => <ReqRow key={r.id} req={r}/>)}
            </div>
          </>
        )}

        {pedidos.length > 0 && (
          <>
            <Eyebrow>Pendientes</Eyebrow>
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pedidos.map((r) => <ReqRow key={r.id} req={r}/>)}
            </div>
          </>
        )}

        {surtidos.length > 0 && (
          <>
            <Eyebrow>Surtidos</Eyebrow>
            <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {surtidos.map((r) => <ReqRow key={r.id} req={r}/>)}
            </div>
          </>
        )}
      </Body>
    </PhoneScreen>
  );
}

function ReqRow({ req }) {
  const date = new Date(req.updatedAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  return (
    <Card style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ color: 'var(--brass-deep)' }}>{I.pkg}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{req.item}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
          ×{req.qty} · {req.requestedBy} · {date}
        </div>
      </div>
      <Pill kind={STATUS_KIND[req.status]} style={{ height: 18, fontSize: 9, flexShrink: 0 }}>
        {STATUS_LABEL[req.status]}
      </Pill>
    </Card>
  );
}
