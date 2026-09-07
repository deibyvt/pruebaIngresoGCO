import React, { useState } from 'react';
import VistaBienvenida from './components/VistaBienvenida';
import VistaSeleccionMarca from './components/VistaSeleccionMarca';
import VistaFormulario from './components/VistaFormulario';
import VistaExito from './components/VistaExito';
import { MARCAS_DATA } from './data/marcasData';
import './App.css';

export default function App() {
  // 'inicio' | 'seleccion-marca' | 'formulario' | 'exito'
  const [paso, setPaso] = useState('inicio');
  const [selectedMarca, setSelectedMarca] = useState(
    () => MARCAS_DATA.find(m => m.codigo === 'AMERICANINO') || MARCAS_DATA[0]
  );
  const [clienteRegistrado, setClienteRegistrado] = useState(null);

  return (
    <div className="app-viewport">
      {paso === 'inicio' && (
        <VistaBienvenida onUnirme={() => setPaso('seleccion-marca')} />
      )}

      {paso === 'seleccion-marca' && (
        <VistaSeleccionMarca
          selectedMarca={selectedMarca}
          onSelectMarca={(marca) => setSelectedMarca(marca)}
          onContinuar={(marca) => {
            setSelectedMarca(marca);
            setPaso('formulario');
          }}
          onVolver={() => setPaso('inicio')}
        />
      )}

      {paso === 'formulario' && (
        <VistaFormulario
          selectedMarca={selectedMarca}
          onCambiarMarca={() => setPaso('seleccion-marca')}
          onRegistroExitoso={(nuevoCliente) => {
            setClienteRegistrado(nuevoCliente);
            setPaso('exito');
          }}
        />
      )}

      {paso === 'exito' && (
        <VistaExito
          cliente={clienteRegistrado}
          selectedMarca={selectedMarca}
          onNuevoRegistro={() => setPaso('formulario')}
          onVolverInicio={() => setPaso('inicio')}
        />
      )}
    </div>
  );
}
