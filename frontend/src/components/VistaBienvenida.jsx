import React from 'react';
import { MARCAS_DATA } from '../data/marcasData';

export default function VistaBienvenida({ onUnirme }) {
  return (
    <div className="vista-bienvenida-container">
      <div className="mosaic-section">
        <div className="mosaic-grid">
          {MARCAS_DATA.map((marca) => (
            <div key={marca.codigo} className="mosaic-card">
              <img
                src={marca.img}
                alt={marca.nombre}
                className="mosaic-bg-img"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="hero-text-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Programa<br />de Fidelidad
          </h1>

          <p className="hero-description">
            Completa tus datos para recibir beneficios exclusivos, acumular puntos y acceder a eventos privados de nuestras marcas.
          </p>

          <button
            type="button"
            className="btn-unirme"
            onClick={onUnirme}
          >
            Unirme
          </button>
        </div>
      </div>
    </div>
  );
}

