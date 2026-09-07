import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import BrandSelector from './BrandSelector';

export default function RegistrationForm({ onRegistroExitoso }) {
  // Estado del formulario
  const [formData, setFormData] = useState({
    tipoDocumentoId: '',
    numeroDocumento: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    direccion: '',
    paisId: '',
    departamentoId: '',
    ciudadId: '',
    marcaId: '',
    autorizaTratamientoDatos: false,
  });

  // Catálogos cargados de la base de datos
  const [tiposDoc, setTiposDoc] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [paises, setPaises] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  // Estados de carga
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);
  const [cargandoDeptos, setCargandoDeptos] = useState(false);
  const [cargandoCiudades, setCargandoCiudades] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // Errores de validación y respuesta del servidor
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState(null);

  // Cargar catálogos iniciales al montar el componente
  useEffect(() => {
    async function cargarIniciales() {
      try {
        setCargandoCatalogos(true);
        const [docs, marcasList, paisesList] = await Promise.all([
          api.getTiposDocumento(),
          api.getMarcas(),
          api.getPaises(),
        ]);

        setTiposDoc(docs);
        setMarcas(marcasList);
        setPaises(paisesList);

        // Preseleccionar Colombia por defecto si existe
        const colombia = paisesList.find((p) => p.codigo === 'CO') || paisesList[0];
        if (colombia) {
          setFormData((prev) => ({ ...prev, paisId: colombia.id }));
          cargarDepartamentos(colombia.id);
        }
      } catch (err) {
        setErrorServidor('No se pudo conectar con el servidor Spring Boot. Verifica que el backend esté encendido.');
      } finally {
        setCargandoCatalogos(false);
      }
    }

    cargarIniciales();
  }, []);

  // Manejo de cascada País -> Departamentos
  const cargarDepartamentos = async (paisId) => {
    if (!paisId) {
      setDepartamentos([]);
      setCiudades([]);
      return;
    }
    try {
      setCargandoDeptos(true);
      const data = await api.getDepartamentos(paisId);
      setDepartamentos(data);
      setCiudades([]);
      setFormData((prev) => ({ ...prev, departamentoId: '', ciudadId: '' }));
    } catch (err) {
      console.error(err);
    } finally {
      setCargandoDeptos(false);
    }
  };

  // Manejo de cascada Departamento -> Ciudades
  const cargarCiudades = async (departamentoId) => {
    if (!departamentoId) {
      setCiudades([]);
      return;
    }
    try {
      setCargandoCiudades(true);
      const data = await api.getCiudades(departamentoId);
      setCiudades(data);
      setFormData((prev) => ({ ...prev, ciudadId: '' }));
    } catch (err) {
      console.error(err);
    } finally {
      setCargandoCiudades(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const valor = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: valor }));

    // Limpiar error del campo modificado
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: null }));
    }
    if (errorServidor) setErrorServidor(null);

    // Disparar cascada geográfica
    if (name === 'paisId') {
      cargarDepartamentos(valor);
    } else if (name === 'departamentoId') {
      cargarCiudades(valor);
    }
  };

  const handleSelectMarca = (marcaId) => {
    setFormData((prev) => ({ ...prev, marcaId }));
    if (errores.marcaId) {
      setErrores((prev) => ({ ...prev, marcaId: null }));
    }
    if (errorServidor) setErrorServidor(null);
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.marcaId) nuevosErrores.marcaId = 'Debes seleccionar una marca de GCO';
    if (!formData.tipoDocumentoId) nuevosErrores.tipoDocumentoId = 'Selecciona el tipo de documento';
    if (!formData.numeroDocumento.trim()) {
      nuevosErrores.numeroDocumento = 'El número de identificación es obligatorio';
    } else if (formData.numeroDocumento.trim().length < 4) {
      nuevosErrores.numeroDocumento = 'El número de identificación debe tener al menos 4 caracteres';
    }

    if (!formData.nombres.trim()) nuevosErrores.nombres = 'Ingresa tus nombres';
    if (!formData.apellidos.trim()) nuevosErrores.apellidos = 'Ingresa tus apellidos';
    
    if (!formData.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    } else {
      const fecha = new Date(formData.fechaNacimiento);
      const hoy = new Date();
      if (fecha >= hoy) {
        nuevosErrores.fechaNacimiento = 'La fecha de nacimiento debe ser anterior a hoy';
      }
    }

    if (!formData.direccion.trim()) nuevosErrores.direccion = 'La dirección es obligatoria';
    if (!formData.paisId) nuevosErrores.paisId = 'Selecciona el país';
    if (!formData.departamentoId) nuevosErrores.departamentoId = 'Selecciona el departamento';
    if (!formData.ciudadId) nuevosErrores.ciudadId = 'Selecciona la ciudad';
    if (!formData.autorizaTratamientoDatos) {
      nuevosErrores.autorizaTratamientoDatos = 'Debes autorizar el tratamiento de datos para continuar';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorServidor(null);

    if (!validarFormulario()) {
      return;
    }

    try {
      setEnviando(true);

      const payload = {
        tipoDocumentoId: Number(formData.tipoDocumentoId),
        numeroDocumento: formData.numeroDocumento.trim(),
        nombres: formData.nombres.trim(),
        apellidos: formData.apellidos.trim(),
        fechaNacimiento: formData.fechaNacimiento,
        direccion: formData.direccion.trim(),
        ciudadId: Number(formData.ciudadId),
        marcaId: Number(formData.marcaId),
        autorizaTratamientoDatos: formData.autorizaTratamientoDatos,
      };

      const respuesta = await api.registrarCliente(payload);
      
      // Limpiar formulario excepto país
      setFormData((prev) => ({
        tipoDocumentoId: '',
        numeroDocumento: '',
        nombres: '',
        apellidos: '',
        fechaNacimiento: '',
        direccion: '',
        paisId: prev.paisId,
        departamentoId: '',
        ciudadId: '',
        marcaId: '',
        autorizaTratamientoDatos: false,
      }));
      setDepartamentos([]);
      setCiudades([]);
      cargarDepartamentos(formData.paisId);

      onRegistroExitoso(respuesta);
    } catch (err) {
      if (err.detalles) {
        setErrores(err.detalles);
      }
      setErrorServidor(err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (cargandoCatalogos) {
    return (
      <div className="card loading-card">
        <div className="spinner" />
        <p>Cargando información y marcas de GCO...</p>
      </div>
    );
  }

  return (
    <form className="registration-form card" onSubmit={handleSubmit} noValidate>
      <div className="form-header">
        <span className="badge-pill">Inscripción Oficial</span>
        <h2 className="form-title">Únete a Nuestro Programa de Fidelidad</h2>
        <p className="form-desc">
          Completa tus datos para recibir beneficios exclusivos, acumular puntos y acceder a eventos privados de nuestras marcas.
        </p>
      </div>

      {errorServidor && (
        <div className="alert alert-danger" role="alert">
          <span className="alert-icon">⚠️</span>
          <div>
            <strong>Atención:</strong> {errorServidor}
          </div>
        </div>
      )}

      {/* 1. SELECCIÓN DE MARCA */}
      <BrandSelector
        marcas={marcas}
        selectedMarcaId={formData.marcaId}
        onSelectMarca={handleSelectMarca}
        error={errores.marcaId}
      />

      {/* 2. DATOS DE IDENTIFICACIÓN */}
      <div className="form-section">
        <h3 className="section-title">1. Datos de Identificación</h3>
        <div className="form-row-2">
          <div className="form-group">
            <label className="input-label" htmlFor="tipoDocumentoId">
              Tipo de Identificación <span className="req">*</span>
            </label>
            <select
              id="tipoDocumentoId"
              name="tipoDocumentoId"
              className={`input-select ${errores.tipoDocumentoId ? 'input-error' : ''}`}
              value={formData.tipoDocumentoId}
              onChange={handleChange}
            >
              <option value="">-- Seleccionar tipo --</option>
              {tiposDoc.map((td) => (
                <option key={td.id} value={td.id}>
                  {td.codigo} - {td.nombre}
                </option>
              ))}
            </select>
            {errores.tipoDocumentoId && <span className="field-error-msg">{errores.tipoDocumentoId}</span>}
          </div>

          <div className="form-group">
            <label className="input-label" htmlFor="numeroDocumento">
              Número de Identificación <span className="req">*</span>
            </label>
            <input
              id="numeroDocumento"
              type="text"
              name="numeroDocumento"
              placeholder="Ej: 1037654321"
              className={`input-text ${errores.numeroDocumento ? 'input-error' : ''}`}
              value={formData.numeroDocumento}
              onChange={handleChange}
            />
            {errores.numeroDocumento && <span className="field-error-msg">{errores.numeroDocumento}</span>}
          </div>
        </div>
      </div>

      {/* 3. DATOS PERSONALES */}
      <div className="form-section">
        <h3 className="section-title">2. Datos Personales</h3>
        <div className="form-row-2">
          <div className="form-group">
            <label className="input-label" htmlFor="nombres">
              Nombres <span className="req">*</span>
            </label>
            <input
              id="nombres"
              type="text"
              name="nombres"
              placeholder="Ej: María Camila"
              className={`input-text ${errores.nombres ? 'input-error' : ''}`}
              value={formData.nombres}
              onChange={handleChange}
            />
            {errores.nombres && <span className="field-error-msg">{errores.nombres}</span>}
          </div>

          <div className="form-group">
            <label className="input-label" htmlFor="apellidos">
              Apellidos <span className="req">*</span>
            </label>
            <input
              id="apellidos"
              type="text"
              name="apellidos"
              placeholder="Ej: Restrepo Londoño"
              className={`input-text ${errores.apellidos ? 'input-error' : ''}`}
              value={formData.apellidos}
              onChange={handleChange}
            />
            {errores.apellidos && <span className="field-error-msg">{errores.apellidos}</span>}
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label className="input-label" htmlFor="fechaNacimiento">
              Fecha de Nacimiento <span className="req">*</span>
            </label>
            <input
              id="fechaNacimiento"
              type="date"
              name="fechaNacimiento"
              max={new Date().toISOString().split('T')[0]}
              className={`input-text ${errores.fechaNacimiento ? 'input-error' : ''}`}
              value={formData.fechaNacimiento}
              onChange={handleChange}
            />
            {errores.fechaNacimiento && <span className="field-error-msg">{errores.fechaNacimiento}</span>}
          </div>

          <div className="form-group">
            <label className="input-label" htmlFor="direccion">
              Dirección de Residencia <span className="req">*</span>
            </label>
            <input
              id="direccion"
              type="text"
              name="direccion"
              placeholder="Ej: Cra 43A # 7 Sur - 170"
              className={`input-text ${errores.direccion ? 'input-error' : ''}`}
              value={formData.direccion}
              onChange={handleChange}
            />
            {errores.direccion && <span className="field-error-msg">{errores.direccion}</span>}
          </div>
        </div>
      </div>

      {/* 4. UBICACIÓN GEOGRÁFICA (CASCADA) */}
      <div className="form-section">
        <h3 className="section-title">3. Ubicación Geográfica</h3>
        <div className="form-row-3">
          <div className="form-group">
            <label className="input-label" htmlFor="paisId">
              País <span className="req">*</span>
            </label>
            <select
              id="paisId"
              name="paisId"
              className={`input-select ${errores.paisId ? 'input-error' : ''}`}
              value={formData.paisId}
              onChange={handleChange}
            >
              <option value="">-- Seleccionar país --</option>
              {paises.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
            {errores.paisId && <span className="field-error-msg">{errores.paisId}</span>}
          </div>

          <div className="form-group">
            <label className="input-label" htmlFor="departamentoId">
              Departamento <span className="req">*</span>
              {cargandoDeptos && <span className="loading-tag"> Cargando...</span>}
            </label>
            <select
              id="departamentoId"
              name="departamentoId"
              disabled={!formData.paisId || cargandoDeptos}
              className={`input-select ${errores.departamentoId ? 'input-error' : ''}`}
              value={formData.departamentoId}
              onChange={handleChange}
            >
              <option value="">-- Seleccionar departamento --</option>
              {departamentos.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre}
                </option>
              ))}
            </select>
            {errores.departamentoId && <span className="field-error-msg">{errores.departamentoId}</span>}
          </div>

          <div className="form-group">
            <label className="input-label" htmlFor="ciudadId">
              Ciudad / Municipio <span className="req">*</span>
              {cargandoCiudades && <span className="loading-tag"> Cargando...</span>}
            </label>
            <select
              id="ciudadId"
              name="ciudadId"
              disabled={!formData.departamentoId || cargandoCiudades}
              className={`input-select ${errores.ciudadId ? 'input-error' : ''}`}
              value={formData.ciudadId}
              onChange={handleChange}
            >
              <option value="">-- Seleccionar ciudad --</option>
              {ciudades.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
            {errores.ciudadId && <span className="field-error-msg">{errores.ciudadId}</span>}
          </div>
        </div>
      </div>

      {/* 5. HABEAS DATA / TÉRMINOS LEGALES */}
      <div className="form-section terms-section">
        <label className="checkbox-container">
          <input
            type="checkbox"
            name="autorizaTratamientoDatos"
            checked={formData.autorizaTratamientoDatos}
            onChange={handleChange}
          />
          <span className="checkbox-label">
            Autorizo de manera previa, expresa e informada a <strong>GCO (Grupo Uribe)</strong> y sus marcas afiliadas 
            para el tratamiento de mis datos personales según la <strong>Ley 1581 de 2012 de Habeas Data</strong>, con el fin de gestionar mi membresía en el programa de fidelización, recibir promociones y comunicaciones comerciales.
          </span>
        </label>
        {errores.autorizaTratamientoDatos && (
          <span className="field-error-msg block-msg">{errores.autorizaTratamientoDatos}</span>
        )}
      </div>

      {/* BOTÓN DE ENVÍO */}
      <div className="form-actions">
        <button
          type="submit"
          className="btn-primary-submit"
          disabled={enviando}
        >
          {enviando ? (
            <>
              <span className="btn-spinner" />
              <span>Inscribiendo cliente...</span>
            </>
          ) : (
            <span>Completar Inscripción al Programa</span>
          )}
        </button>
      </div>
    </form>
  );
}

