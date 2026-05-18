// src/roles/sales/Calendar.jsx — Mapa de calor de ocupación.
// Migrado de screens-sales.jsx::SalesCalendar.
// · Grid hardcoded (vendría de un dataservice analítico)
// · Pricing rows son cosméticos

import React from 'react';
import {
  PhoneScreen, BrandStrip, AppBar, IconBtn, Body, Eyebrow, Card, Metric,
} from '../../ui/shared.jsx';
import { I } from '../../ui/icons.jsx';

export default function SalesCalendar() {
  const grid = [
    [82, 84, 80, 78, 90, 96, 88],
    [86, 91, 95, 93, 98, 100, 94], // semana actual (lunes 13 may = ri=1, ci=0)
    [72, 68, 70, 75, 82, 88, 78],
    [60, 55, 62, 58, 70, 76, 65],
    [88, 92, 90, 95, 98, 100, 100],
  ];
  const weekLabels = ['06', '13', '20', '27', '03'];

  return (
    <PhoneScreen>
      <BrandStrip role="sales"/>
      <AppBar
        eyebrow="Mayo · 2026"
        title="Ocupación"
        trailing={<IconBtn icon={I.chevR}/>}
      />
      <Body style={{ paddingBottom: 80 }}>
        <div style={{ padding: '4px 16px 0', display: 'flex', gap: 8 }}>
          <Metric label="Esta semana" value="93%" sub="+7" kind="up" foot="Avg 5 días"/>
          <Metric label="RevPAR" value="$3,571" sub="+12%" kind="up" foot="vs. 2025"/>
        </div>

        <Eyebrow right="lun a dom">Mapa de calor</Eyebrow>
        <div style={{ padding: '0 16px' }}>
          <Card style={{ padding: 14 }}>
            <div style={{
              display: 'grid', gridTemplateColumns: 'auto repeat(7, 1fr)',
              gap: 4, fontSize: 9, color: 'var(--muted-2)',
            }}>
              <div/>
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => (
                <div key={i} style={{ textAlign: 'center', fontFamily: 'var(--mono)' }}>{d}</div>
              ))}
              {grid.map((row, ri) => (
                <React.Fragment key={ri}>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    fontFamily: 'var(--mono)', fontSize: 9,
                  }}>{weekLabels[ri]}</div>
                  {row.map((v, ci) => {
                    const isToday = ri === 1 && ci === 0;
                    return (
                      <div key={ci} style={{
                        aspectRatio: '1', borderRadius: 4,
                        background: heatColor(v),
                        color: v > 85 ? '#FAF4E6' : 'var(--ink)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 500,
                        border: isToday ? '1.5px solid var(--brass)' : 'none',
                      }}>{v}</div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 10, color: 'var(--muted)' }}>
              <span>Bajo</span>
              {[55, 70, 80, 90, 100].map((v) => (
                <div key={v} style={{
                  flex: 1, height: 8, borderRadius: 2, background: heatColor(v),
                }}/>
              ))}
              <span>Lleno</span>
            </div>
          </Card>
        </div>

        <Eyebrow>Recomendaciones de pricing</Eyebrow>
        <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <PricingRow date="14 may" status="up"   rec="Subir tarifa 8%" reason="Demanda alta · 4 búsquedas/min"/>
          <PricingRow date="17 may" status="hold" rec="Mantener"        reason="Mix saludable"/>
          <PricingRow date="22 may" status="down" rec="Promo 12%"       reason="Ocupación 55% prevista"/>
        </div>
      </Body>
    </PhoneScreen>
  );
}

function heatColor(v) {
  if (v >= 95) return 'var(--forest-deep)';
  if (v >= 88) return 'var(--forest)';
  if (v >= 78) return 'var(--brass)';
  if (v >= 65) return 'var(--brass-soft)';
  return 'var(--card-2)';
}

function PricingRow({ date, status, rec, reason }) {
  const map = {
    up:   ['var(--ok)',     '↑'],
    down: ['var(--danger)', '↓'],
    hold: ['var(--muted)',  '='],
  };
  const [c, sym] = map[status];
  return (
    <div style={{
      padding: '10px 12px', borderRadius: 10,
      background: 'var(--card)', border: '1px solid var(--line)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: 'var(--card-2)', color: c, fontWeight: 600,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 14 }}>{sym}</span>
        <span className="hpj-mono" style={{ fontSize: 9, color: 'var(--muted-2)' }}>{date}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{rec}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{reason}</div>
      </div>
      <span style={{ color: 'var(--muted)' }}>{I.chevR}</span>
    </div>
  );
}
