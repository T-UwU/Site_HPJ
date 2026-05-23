// src/roles/purchasing/Requisitions.jsx — Lista de requisiciones por estado.
// Compras gestiona pedidos de todas las áreas.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PhoneScreen, BrandStrip, AppBar, IconBtn, Body, Eyebrow, Card, Pill, FAB,
} from '../../ui/shared.jsx';
import { I } from '../../ui/icons.jsx';
import { useRequisitions, useActions } from '../../store/data.js';
import { useCurrentUser } from '../../store/auth.js';

const STATUS_KIND  = { pedido: 'warn', 'en-camino': 'info', surtido: 'ok' };
const STATUS_LABEL = { pedido: 'PEDIDO', 'en-camino': 'EN CAMINO', surtido: 'SURTIDO' };

const AREA_LABEL = {
  maintenance:  'Mantenimiento',
  housekeeping: 'Limpieza',
  reception:    'Recepción',
  sales:        'Ventas',
  purchasing:   'Compras',
};

export default function PurchasingRequisitions() {
  const navigate = useNavigate();
  const reqs     = useRequisitions();
  const user     = useCurrentUser();
  const { updateRequisitionStatus } = useActions();

  const pedidos  = reqs.filter((r) => r.status === 'pedido');
  const enCamino = reqs.filter((r) => r.status === 'en-camino');
  const surtidos = reqs.filter((r) => r.status === 'surtido');

  return (
    <PhoneScreen>
      <BrandStrip role="purchasing"/>
      <AppBar
        eyebrow={`${user?.name || 'Compras'} · Turno mat.`}
        title="Requisiciones"
        subtitle={`${pedidos.length + enCamino.length} activas · ${surtidos.length} surtidas`}
      />
      <Body style={{ paddingBottom: 80 }}>
        {reqs.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            Sin requisiciones activas.
          </div>
        )}

        {pedidos.length > 0 && (
          <>
            <Eyebrow right={`${pedidos.length}`}>Por atender</Eyebrow>
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pedidos.map((r) => (
                <ReqCard
                  key={r.id}
                  req={r}
                  onAdvance={() => updateRequisitionStatus(r.id, 'en-camino')}
                />
              ))}
            </div>
          </>
        )}

        {enCamino.length > 0 && (
          <>
            <Eyebrow>En camino</Eyebrow>
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {enCamino.map((r) => (
                <ReqCard
                  key={r.id}
                  req={r}
                  onAdvance={() => updateRequisitionStatus(r.id, 'surtido')}
                />
              ))}
            </div>
          </>
        )}

        {surtidos.length > 0 && (
          <>
            <Eyebrow>Surtidos</Eyebrow>
            <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {surtidos.map((r) => (
                <ReqCard key={r.id} req={r}/>
              ))}
            </div>
          </>
        )}
      </Body>
      <FAB icon={I.plus} label="Nueva requisición" onClick={() => navigate('/purchasing/new')}/>
    </PhoneScreen>
  );
}

function ReqCard({ req, onAdvance }) {
  const date = new Date(req.updatedAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  const isSurtido = req.status === 'surtido';
  return (
    <Card style={{ padding: '10px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: req.status === 'en-camino' ? 'var(--info)' : 'var(--brass-deep)' }}>
          {I.pkg}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{req.item}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            ×{req.qty} · {AREA_LABEL[req.area] || req.area} · {req.requestedBy}
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted-2)', marginTop: 1 }}>{date}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
          <Pill kind={STATUS_KIND[req.status]} style={{ height: 18, fontSize: 9 }}>
            {STATUS_LABEL[req.status]}
          </Pill>
          {!isSurtido && onAdvance && (
            <button
              onClick={onAdvance}
              style={{
                fontSize: 10, padding: '3px 8px', borderRadius: 6,
                background: 'var(--forest)', color: 'var(--bg)', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {req.status === 'pedido' ? 'En camino →' : 'Surtir →'}
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
