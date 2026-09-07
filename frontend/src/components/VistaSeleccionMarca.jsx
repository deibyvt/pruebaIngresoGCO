import React from 'react';
import { MARCAS_DATA } from '../data/marcasData';

export default function VistaSeleccionMarca({
  selectedMarca,
  onSelectMarca,
  onContinuar,
  onVolver
}) {
  const currentMarca = selectedMarca || MARCAS_DATA.find(m => m.codigo === 'AMERICANINO') || MARCAS_DATA[0];

  return (
    <div className="vista-seleccion-container">
      <div className="preview-section">
        <div className="preview-card">
          <img
            key={currentMarca.codigo}
            src={currentMarca.img}
            alt={`Modelo de ${currentMarca.nombre}`}
            className="preview-img animate-fade-in"
          />
        </div>
      </div>

      <div className="brands-selection-section">
        <div className="brands-selection-header">
          <button 
            type="button" 
            className="btn-volver-link"
            onClick={onVolver}
            title="Volver al inicio"
          >
            ← Volver al inicio
          </button>
          <h2 className="brands-selection-title">
            Selecciona la marca para el programa de fidelización
          </h2>
        </div>

        <div className="brands-interactive-grid">
          {MARCAS_DATA.map((marca) => {
            const isSelected = currentMarca.codigo === marca.codigo;

            return (
              <div
                key={marca.codigo}
                role="button"
                tabIndex={0}
                className={`brand-select-item ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectMarca(marca)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectMarca(marca);
                  }
                }}
              >
                <div className="brand-logo-wrapper">
                  <img
                    src={marca.svg}
                    alt={`Logo ${marca.nombre}`}
                    className="brand-vector-logo"
                  />
                </div>
                <p className="brand-slogan-text">
                  {marca.slogan}
                </p>
                {isSelected && (
                  <div className="brand-selected-badge">
                    <span>Seleccionada</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="selection-actions">
          <button
            type="button"
            className="btn-unirme btn-continuar"
            onClick={() => onContinuar(currentMarca)}
          >
            Continuar con {currentMarca.nombre} →
          </button>
        </div>
      </div>
    </div>
  );
}
