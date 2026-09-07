import React from 'react';

export default function VistaExito({
  cliente,
  selectedMarca,
  onNuevoRegistro,
  onVolverInicio
}) {
  const fecha = cliente?.fechaRegistro 
    ? new Date(cliente.fechaRegistro).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="vista-exito-container">
      <div className="exito-content-card">
        {/* Cabecera de Felicitación */}
        <div className="exito-header">
          <div className="exito-badge-check">✓</div>
          <span className="exito-tag">¡REGISTRO COMPLETADO CON ÉXITO!</span>
          <h2 className="exito-title">BIENVENIDO AL CLUB {selectedMarca.nombre.toUpperCase()}</h2>
          <p className="exito-subtitle">
            Tu membresía VIP en el programa de fidelización de Grupo Uribe (GCO) ya se encuentra activa en el sistema.
          </p>
        </div>

        {/* Tarjeta de Membresía Digital Estilo Tarjeta VIP */}
        <div className="digital-membership-card">
          <div className="card-top-bar">
            <div className="card-brand-info">
              <img
                src={selectedMarca.svg}
                alt={`Logo ${selectedMarca.nombre}`}
                className="card-brand-logo"
              />
              <span className="card-member-tier">VIP LOYALTY MEMBER</span>
            </div>
            <div className="card-chip"></div>
          </div>

          <div className="card-center-info">
            <div className="card-info-group">
              <span className="card-label">TITULAR DE LA MEMBRESÍA</span>
              <p className="card-client-name">
                {cliente?.nombreCompleto || `${cliente?.nombres} ${cliente?.apellidos}`}
              </p>
            </div>
          </div>

          <div className="card-bottom-grid">
            <div className="card-meta">
              <span className="card-label">IDENTIFICACIÓN</span>
              <p className="card-value">
                {cliente?.tipoDocumentoCodigo || 'CC'} {cliente?.numeroDocumento}
              </p>
            </div>

            <div className="card-meta">
              <span className="card-label">CIUDAD</span>
              <p className="card-value">
                {cliente?.ciudadNombre || 'Medellín'}, {cliente?.paisNombre || 'Colombia'}
              </p>
            </div>

            <div className="card-meta">
              <span className="card-label">FECHA DE EMISIÓN</span>
              <p className="card-value">{fecha}</p>
            </div>

            <div className="card-barcode-box">
              <div className="fake-barcode">
                |||| | ||||| || |||||| | |||| ||| |||||
              </div>
              <span className="barcode-number">
                GCO-{cliente?.id?.toString().padStart(6, '0') || '000124'}
              </span>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="exito-actions">
          <button
            type="button"
            className="btn-unirme btn-nuevo-registro"
            onClick={onNuevoRegistro}
          >
            + Inscribir a otro cliente
          </button>
          <button
            type="button"
            className="btn-link-secundario"
            onClick={onVolverInicio}
          >
            ← Volver a la portada principal
          </button>
        </div>
      </div>
    </div>
  );
}
