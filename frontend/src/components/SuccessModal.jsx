import React from 'react';

export default function SuccessModal({ cliente, onClose, onVerLista }) {
  if (!cliente) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-icon-success">✓</div>
        <span className="badge-pill pill-success">Registro Confirmado</span>

        <h2 className="modal-title">¡Bienvenido a {cliente.marcaNombre}!</h2>
        <p className="modal-desc">
          Tu inscripción en el programa de fidelización de <strong>GCO</strong> se ha completado con éxito y ya está almacenada en la base de datos.
        </p>

        {/* Tarjeta de Membresía Digital */}
        <div className="membership-card">
          <div className="membership-top">
            <span className="membership-brand">{cliente.marcaNombre}</span>
            <span className="membership-status">Membresía Activa</span>
          </div>

          <div className="membership-name">{cliente.nombreCompleto}</div>

          <div className="membership-details-grid">
            <div>
              <span className="detail-label">Identificación</span>
              <span className="detail-val">{cliente.tipoDocumentoCodigo} {cliente.numeroDocumento}</span>
            </div>
            <div>
              <span className="detail-label">Ciudad</span>
              <span className="detail-val">{cliente.ciudadNombre}, {cliente.departamentoNombre}</span>
            </div>
            <div>
              <span className="detail-label">Dirección</span>
              <span className="detail-val">{cliente.direccion}</span>
            </div>
            <div>
              <span className="detail-label">Fecha de Registro</span>
              <span className="detail-val">
                {cliente.fechaRegistro ? new Date(cliente.fechaRegistro).toLocaleDateString() : 'Hoy'}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-actions" style={{ justifyContent: 'center' }}>
          <button type="button" className="btn-primary" onClick={onClose} style={{ width: '100%' }}>
            Inscribir Otro Cliente
          </button>
        </div>
      </div>
    </div>
  );
}

