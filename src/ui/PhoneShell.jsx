// src/ui/PhoneShell.jsx — wrapper visual: full-screen en mobile,
// marco de teléfono centrado en desktop. Las rutas renderizan adentro.

import React from 'react';

export function PhoneShell({ children }) {
  return (
    <div className="hpj-app-root">
      <div className="hpj-phone hpj">
        <div className="hpj-screen-host">
          {children}
        </div>
      </div>
    </div>
  );
}
