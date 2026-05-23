// src/roles/purchasing/NewRequisition.jsx — Formulario para crear una requisición.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PhoneScreen, BrandStrip, AppBar, BackBtn, Body,
} from '../../ui/shared.jsx';
import { useActions } from '../../store/data.js';
import { useCurrentUser } from '../../store/auth.js';

const AREAS = [
  { id: 'maintenance',  label: 'Mantenimiento' },
  { id: 'housekeeping', label: 'Limpieza' },
  { id: 'reception',    label: 'Recepción' },
  { id: 'purchasing',   label: 'Compras (interno)' },
];

export default function NewRequisition() {
  const navigate = useNavigate();
  const user     = useCurrentUser();
  const { addRequisition } = useActions();

  const [area, setArea]   = useState('maintenance');
  const [item, setItem]   = useState('');
  const [qty, setQty]     = useState('1');

  const send = () => {
    if (!item.trim()) return;
    addRequisition({
      area,
      item: item.trim(),
      qty: parseInt(qty, 10) || 1,
      requestedBy: user?.name || 'Compras',
    });
    navigate('/purchasing');
  };

  return (
    <PhoneScreen>
      <BrandStrip role="purchasing"/>
      <AppBar
        eyebrow="Crear pedido"
        title="Nueva requisición"
        leading={<BackBtn label=""/>}
      />
      <Body style={{ paddingBottom: 80 }}>
        <div style={{ padding: '8px 16px 0' }}>

          <div className="section-eyebrow" style={{ margin: '12px 0 8px' }}>Área solicitante</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {AREAS.map((a) => (
              <button key={a.id} onClick={() => setArea(a.id)} style={{
                padding: '10px 14px', borderRadius: 10, textAlign: 'left',
                background: area === a.id ? 'var(--forest-soft)' : 'var(--card)',
                border: `1.5px solid ${area === a.id ? 'var(--forest)' : 'var(--line)'}`,
                fontSize: 13, fontFamily: 'inherit', color: 'inherit', cursor: 'pointer',
              }}>{a.label}</button>
            ))}
          </div>

          <div className="section-eyebrow" style={{ margin: '14px 0 8px' }}>Artículo / insumo</div>
          <input
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="Ej. Sello universal 3&quot; plomería"
            className="card"
            style={{
              width: '100%', padding: 12, fontSize: 13,
              fontFamily: 'inherit', color: 'var(--ink)', border: '1px solid var(--line)',
              outline: 'none',
            }}
          />

          <div className="section-eyebrow" style={{ margin: '14px 0 8px' }}>Cantidad</div>
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="card"
            style={{
              width: '100%', padding: 12, fontSize: 13,
              fontFamily: 'inherit', color: 'var(--ink)', border: '1px solid var(--line)',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ padding: '16px', display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => navigate(-1)}>
            Cancelar
          </button>
          <button className="btn btn-primary" style={{ flex: 2 }} onClick={send}
            disabled={!item.trim()}>
            Crear pedido
          </button>
        </div>
      </Body>
    </PhoneScreen>
  );
}
