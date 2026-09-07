import React from 'react';

const BRAND_THEMES = {
  AMERICANINO: { accent: '#1e293b', slogan: 'Urban Denim & Style' },
  AMERICAN_EAGLE: { accent: '#1d4ed8', slogan: 'Premium Denim & Freedom' },
  CHEVIGNON: { accent: '#854d0e', slogan: 'Leather & Heritage Vintage' },
  ESPRIT: { accent: '#be123c', slogan: 'Positive Spirit & Fashion' },
  NAF_NAF: { accent: '#831843', slogan: 'Chic Parisienne & Glam' },
  RIFLE: { accent: '#3f6212', slogan: 'Authentic Denim Wear' }
};

export default function BrandSelector({ marcas, selectedMarcaId, onSelectMarca, error }) {
  return (
    <div className="brand-selector-section">
      <div className="section-label-row">
        <label className="input-label">
          Selecciona la Marca para el Programa de Fidelización <span className="req">*</span>
        </label>
        <span className="section-hint">Marcas exclusivas del Grupo Uribe</span>
      </div>

      <div className="brands-grid">
        {marcas.map((marca) => {
          const isSelected = selectedMarcaId === marca.id;
          const theme = BRAND_THEMES[marca.codigo] || { accent: '#2563eb', slogan: 'Colección oficial' };

          return (
            <button
              key={marca.id}
              type="button"
              className={`brand-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectMarca(marca.id)}
              style={{
                '--brand-accent': theme.accent
              }}
            >
              <div className="brand-card-top">
                <span className="brand-badge-circle" />
                {isSelected && <span className="brand-check">✓ Seleccionada</span>}
              </div>

              <div className="brand-name">{marca.nombre}</div>
              <div className="brand-slogan">{marca.descripcion || theme.slogan}</div>
            </button>
          );
        })}
      </div>

      {error && <span className="field-error-msg">{error}</span>}
    </div>
  );
}

