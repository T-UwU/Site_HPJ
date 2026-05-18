// src/pages/Login.jsx — Login dual mode.
//
// · ONLINE  (Supabase configurado): formulario email + password
// · OFFLINE (modo demo): selector visual de roles, como antes
//
// El selector visual sigue accesible incluso en modo online a través
// de un link discreto al final ("modo demo · sin auth") por si quieres
// probar pantallas sin loggearte de verdad.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../store/auth.js';
import { isOnlineMode } from '../lib/supabase.js';
import { I } from '../ui/icons.jsx';

const roleMeta = {
  sales:        { icon: I.trend,    desc: 'Reservas, calendario y clientes.' },
  reception:    { icon: I.bellDesk, desc: 'Llegadas, check-in y habitaciones.' },
  maintenance:  { icon: I.wrench,   desc: 'Tickets abiertos e historial.' },
  housekeeping: { icon: I.broom,    desc: 'Tareas de limpieza y turno.' },
};

export default function Login() {
  // Si estamos en modo demo, vamos directo al selector.
  // Si estamos en online, mostramos email/password con opción "demo" abajo.
  const [showDemo, setShowDemo] = useState(!isOnlineMode);
  return showDemo
    ? <DemoSelector onSwitchToLogin={() => setShowDemo(false)}/>
    : <EmailLogin onSwitchToDemo={() => setShowDemo(true)}/>;
}

// ─────────────────────────────────────────────────────────────────
// Modo ONLINE — formulario email + password
// ─────────────────────────────────────────────────────────────────
function EmailLogin({ onSwitchToDemo }) {
  const navigate = useNavigate();
  const loginWithEmail = useAuth((s) => s.loginWithEmail);
  const loading = useAuth((s) => s.loading);
  const error = useAuth((s) => s.error);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    setSubmitting(true);
    try {
      await loginWithEmail(email.trim(), password);
      // useAuth.onAuthStateChange ya actualizó user; rediriges al home del rol
      const user = useAuth.getState().user;
      if (user) navigate(ROLES[user.roleId].home, { replace: true });
    } catch {
      // error queda en el store
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="hpj" style={{
      width: '100%', height: '100%', overflowY: 'auto',
      background: 'var(--bg)',
      padding: '32px 22px 40px',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div className="hpj-mark" style={{ fontSize: 10 }}>Sistema operativo</div>
        <h1 className="hpj-serif" style={{
          fontSize: 36, margin: '12px 0 6px', letterSpacing: '-0.01em',
        }}>Palacio Julio</h1>
        <div style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.04em' }}>
          Inicia sesión con tu correo del hotel
        </div>
      </div>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Field
          label="Correo"
          type="email"
          value={email} onChange={setEmail}
          placeholder="tu.usuario@palaciojulio.test"
          autoFocus autoComplete="email"
        />
        <Field
          label="Contraseña"
          type="password"
          value={password} onChange={setPassword}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        {error && (
          <div style={{
            padding: '10px 12px', borderRadius: 10,
            background: 'var(--danger-soft)', border: '1px solid var(--danger)',
            color: 'var(--danger)', fontSize: 12,
          }}>{error}</div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || loading || !email || !password}
          style={{
            marginTop: 6, height: 46, fontSize: 14,
            opacity: submitting || loading ? 0.6 : 1,
          }}
        >
          {submitting ? 'Iniciando…' : 'Entrar'}
        </button>
      </form>

      <div style={{ flex: 1 }}/>

      <div style={{
        marginTop: 32, paddingTop: 18,
        borderTop: '1px dashed var(--hairline)',
        textAlign: 'center',
      }}>
        <button onClick={onSwitchToDemo} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontSize: 12, color: 'var(--muted)', fontFamily: 'inherit',
          textDecoration: 'underline', textUnderlineOffset: 3,
        }}>Modo demo · sin servidor →</button>
      </div>

      <div style={{
        marginTop: 16, textAlign: 'center',
        fontSize: 10, color: 'var(--muted-2)', letterSpacing: '0.08em',
        fontFamily: 'var(--mono)', textTransform: 'uppercase',
      }}>v0.2 · Supabase</div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder, autoFocus, autoComplete }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span className="section-eyebrow">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        style={{
          padding: '12px 14px', fontSize: 14,
          borderRadius: 10, border: '1px solid var(--line)',
          background: 'var(--card)', color: 'var(--ink)',
          fontFamily: 'inherit', outline: 'none',
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--forest)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--line)'}
      />
    </label>
  );
}

// ─────────────────────────────────────────────────────────────────
// Modo OFFLINE / DEMO — selector visual de roles
// ─────────────────────────────────────────────────────────────────
function DemoSelector({ onSwitchToLogin }) {
  const navigate = useNavigate();
  const loginDemo = useAuth((s) => s.loginDemo);

  const enter = (roleId) => {
    loginDemo(roleId);
    navigate(ROLES[roleId].home, { replace: true });
  };

  return (
    <div className="hpj" style={{
      width: '100%', height: '100%', overflowY: 'auto',
      background: 'var(--bg)',
      padding: '32px 22px 40px',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div className="hpj-mark" style={{ fontSize: 10 }}>Sistema operativo · demo</div>
        <h1 className="hpj-serif" style={{
          fontSize: 36, margin: '12px 0 6px', letterSpacing: '-0.01em',
        }}>Palacio Julio</h1>
        <div style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.04em' }}>
          Selecciona tu área de trabajo
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {Object.values(ROLES).map((role) => {
          const meta = roleMeta[role.id];
          return (
            <button
              key={role.id}
              onClick={() => enter(role.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px', borderRadius: 14,
                background: 'var(--card)', border: '1px solid var(--line)',
                borderLeft: `3px solid ${role.color}`,
                cursor: 'pointer', textAlign: 'left',
                fontFamily: 'inherit', color: 'inherit',
                transition: 'transform .08s, background .15s',
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.99)'}
              onMouseUp={(e) => e.currentTarget.style.transform = ''}
              onMouseLeave={(e) => e.currentTarget.style.transform = ''}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: `color-mix(in srgb, ${role.color} 12%, transparent)`,
                color: role.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>{meta.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 500,
                  letterSpacing: '-0.005em', lineHeight: 1.1,
                }}>{role.label}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3, lineHeight: 1.35 }}>
                  {meta.desc}
                </div>
              </div>
              <span style={{ color: 'var(--muted-2)', flexShrink: 0 }}>{I.chevR}</span>
            </button>
          );
        })}
      </div>

      {isOnlineMode && (
        <div style={{
          marginTop: 18, paddingTop: 14,
          borderTop: '1px dashed var(--hairline)',
          textAlign: 'center',
        }}>
          <button onClick={onSwitchToLogin} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontSize: 12, color: 'var(--muted)', fontFamily: 'inherit',
            textDecoration: 'underline', textUnderlineOffset: 3,
          }}>← Volver al login con correo</button>
        </div>
      )}

      <div style={{
        marginTop: 18, textAlign: 'center',
        fontSize: 10, color: 'var(--muted-2)', letterSpacing: '0.08em',
        fontFamily: 'var(--mono)', textTransform: 'uppercase',
      }}>v0.2 · {isOnlineMode ? 'demo (sin sincronizar)' : 'sin servidor'}</div>
    </div>
  );
}
