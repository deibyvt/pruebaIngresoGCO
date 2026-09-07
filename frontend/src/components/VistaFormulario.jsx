import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function VistaFormulario({
  selectedMarca,
  onCambiarMarca,
  onRegistroExitoso
}) {
  // Catálogos desde el backend
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [paises, setPaises] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [marcasBackend, setMarcasBackend] = useState([]);

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
    autorizaTratamientoDatos: false,
  });

  // Estados de control
  const [loading, setLoading] = useState(false);
  const [loadingCatalogos, setLoadingCatalogos] = useState(true);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [erroresValidacion, setErroresValidacion] = useState({});
  const [mostrarModalHabeas, setMostrarModalHabeas] = useState(false);

  // 1. Cargar catálogos iniciales al montar
  useEffect(() => {
    let isMounted = true;
    async function loadCatalogos() {
      try {
        setLoadingCatalogos(true);
        const [tipos, listaPaises, marcas] = await Promise.all([
          api.getTiposDocumento(),
          api.getPaises(),
          api.getMarcas()
        ]);

        if (isMounted) {
          setTiposDocumento(tipos);
          setPaises(listaPaises);
          setMarcasBackend(marcas);

          // Seleccionar primer tipo documento por defecto
          const defaultTipo = tipos.length > 0 ? tipos[0].id : '';

          // Seleccionar primer país (Colombia)
          const defaultPais = listaPaises.length > 0 ? listaPaises[0].id : '';

          setFormData((prev) => ({
            ...prev,
            tipoDocumentoId: defaultTipo,
            paisId: defaultPais
          }));

          // Si hay país por defecto, cargar sus departamentos
          if (defaultPais) {
            const deptos = await api.getDepartamentos(defaultPais);
            if (isMounted) {
              setDepartamentos(deptos);
              const defaultDepto = deptos.length > 0 ? deptos[0].id : '';
              setFormData((prev) => ({ ...prev, departamentoId: defaultDepto }));

              // Cargar ciudades del departamento por defecto
              if (defaultDepto) {
                const ciuds = await api.getCiudades(defaultDepto);
                if (isMounted) {
                  setCiudades(ciuds);
                  const defaultCiudad = ciuds.length > 0 ? ciuds[0].id : '';
                  setFormData((prev) => ({ ...prev, ciudadId: defaultCiudad }));
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Error cargando catálogos iniciales:', err);
        setErrorGeneral('No se pudieron cargar los catálogos del servidor. Verifica la conexión con el backend.');
      } finally {
        if (isMounted) setLoadingCatalogos(false);
      }
    }

    loadCatalogos();
    return () => { isMounted = false; };
  }, []);

  // 2. Cascada: Al cambiar país -> recargar departamentos
  const handlePaisChange = async (e) => {
    const paisId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      paisId,
      departamentoId: '',
      ciudadId: ''
    }));
    setDepartamentos([]);
    setCiudades([]);

    if (paisId) {
      try {
        const deptos = await api.getDepartamentos(paisId);
        setDepartamentos(deptos);
        if (deptos.length > 0) {
          const firstDepto = deptos[0].id;
          setFormData((prev) => ({ ...prev, departamentoId: firstDepto }));
          const ciuds = await api.getCiudades(firstDepto);
          setCiudades(ciuds);
          if (ciuds.length > 0) {
            setFormData((prev) => ({ ...prev, ciudadId: ciuds[0].id }));
          }
        }
      } catch (err) {
        console.error('Error cargando departamentos:', err);
      }
    }
  };

  // 3. Cascada: Al cambiar departamento -> recargar ciudades
  const handleDepartamentoChange = async (e) => {
    const departamentoId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      departamentoId,
      ciudadId: ''
    }));
    setCiudades([]);

    if (departamentoId) {
      try {
        const ciuds = await api.getCiudades(departamentoId);
        setCiudades(ciuds);
        if (ciuds.length > 0) {
          setFormData((prev) => ({ ...prev, ciudadId: ciuds[0].id }));
        }
      } catch (err) {
        console.error('Error cargando ciudades:', err);
      }
    }
  };

  // Manejo genérico de inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error de validación del campo cuando el usuario escribe
    if (erroresValidacion[name]) {
      setErroresValidacion((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
    if (errorGeneral) setErrorGeneral(null);
  };

  // 4. Envío del Formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorGeneral(null);
    setErroresValidacion({});

    // Validar checkbox de Habeas Data localmente
    if (!formData.autorizaTratamientoDatos) {
      setErrorGeneral('Debes autorizar el tratamiento de datos personales para unirte al programa.');
      return;
    }

    // Obtener el ID de la marca en la base de datos
    let marcaBackendId = null;
    const marcaEncontrada = marcasBackend.find(
      (m) => m.codigo === selectedMarca.codigo || m.nombre.toLowerCase() === selectedMarca.nombre.toLowerCase()
    );
    if (marcaEncontrada) {
      marcaBackendId = marcaEncontrada.id;
    } else if (marcasBackend.length > 0) {
      marcaBackendId = marcasBackend[0].id;
    } else {
      marcaBackendId = 1;
    }

    const payload = {
      tipoDocumentoId: Number(formData.tipoDocumentoId),
      numeroDocumento: formData.numeroDocumento.trim(),
      nombres: formData.nombres.trim(),
      apellidos: formData.apellidos.trim(),
      fechaNacimiento: formData.fechaNacimiento,
      direccion: formData.direccion.trim(),
      ciudadId: Number(formData.ciudadId),
      marcaId: Number(marcaBackendId),
      autorizaTratamientoDatos: Boolean(formData.autorizaTratamientoDatos),
    };

    try {
      setLoading(true);
      const clienteGuardado = await api.registrarCliente(payload);
      onRegistroExitoso(clienteGuardado);
    } catch (err) {
      console.error('Error en registro:', err);
      if (err.detalles) {
        setErroresValidacion(err.detalles);
        setErrorGeneral('Por favor corrige los campos indicados en el formulario.');
      } else {
        setErrorGeneral(err.message || 'Ocurrió un error al procesar el registro.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vista-formulario-container">
      {/* Columna Izquierda: Foto de la marca seleccionada + Botón Cambiar Marca */}
      <div className="form-brand-preview-section">
        <div className="form-brand-card">
          <img
            src={selectedMarca.img}
            alt={`Modelo de ${selectedMarca.nombre}`}
            className="form-brand-img"
          />
          <div className="form-brand-overlay">
            <button
              type="button"
              className="btn-cambiar-marca"
              onClick={onCambiarMarca}
            >
              ← Cambiar marca
            </button>
            <div className="form-brand-badge">
              <span className="form-brand-badge-label">Programa Exclusivo</span>
              <h3 className="form-brand-badge-name">{selectedMarca.nombre}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Formulario Compacto 100vh */}
      <div className="form-content-section">
        <div className="form-header">
          <span className="form-subtitle-tag">GRUPO GCO • FIDELIZACIÓN</span>
          <h2 className="form-main-title">REGISTRO DE CLIENTE</h2>
          <p className="form-lead-text">
            Inscríbete para disfrutar de acumulación de puntos, lanzamientos exclusivos y beneficios en <strong>{selectedMarca.nombre}</strong>.
          </p>
        </div>

        {errorGeneral && (
          <div className="form-alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <span className="alert-text">{errorGeneral}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="fidelizacion-form" noValidate>
          <div className="form-grid-2col">
            {/* Tipo de Documento */}
            <div className="form-field-group">
              <label htmlFor="tipoDocumentoId" className="form-label">
                Tipo Identificación *
              </label>
              <select
                id="tipoDocumentoId"
                name="tipoDocumentoId"
                className={`form-select ${erroresValidacion.tipoDocumentoId ? 'is-invalid' : ''}`}
                value={formData.tipoDocumentoId}
                onChange={handleChange}
                required
                disabled={loadingCatalogos}
              >
                {tiposDocumento.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.codigo} - {tipo.nombre}
                  </option>
                ))}
              </select>
              {erroresValidacion.tipoDocumentoId && (
                <span className="field-error-msg">{erroresValidacion.tipoDocumentoId}</span>
              )}
            </div>

            {/* Número de Documento */}
            <div className="form-field-group">
              <label htmlFor="numeroDocumento" className="form-label">
                Número Identificación *
              </label>
              <input
                id="numeroDocumento"
                type="text"
                name="numeroDocumento"
                placeholder="Ej. 1037654321"
                className={`form-input ${erroresValidacion.numeroDocumento ? 'is-invalid' : ''}`}
                value={formData.numeroDocumento}
                onChange={handleChange}
                maxLength={30}
                required
              />
              {erroresValidacion.numeroDocumento && (
                <span className="field-error-msg">{erroresValidacion.numeroDocumento}</span>
              )}
            </div>

            {/* Nombres */}
            <div className="form-field-group">
              <label htmlFor="nombres" className="form-label">
                Nombres *
              </label>
              <input
                id="nombres"
                type="text"
                name="nombres"
                placeholder="Ej. Mateo"
                className={`form-input ${erroresValidacion.nombres ? 'is-invalid' : ''}`}
                value={formData.nombres}
                onChange={handleChange}
                maxLength={100}
                required
              />
              {erroresValidacion.nombres && (
                <span className="field-error-msg">{erroresValidacion.nombres}</span>
              )}
            </div>

            {/* Apellidos */}
            <div className="form-field-group">
              <label htmlFor="apellidos" className="form-label">
                Apellidos *
              </label>
              <input
                id="apellidos"
                type="text"
                name="apellidos"
                placeholder="Ej. Gómez Pérez"
                className={`form-input ${erroresValidacion.apellidos ? 'is-invalid' : ''}`}
                value={formData.apellidos}
                onChange={handleChange}
                maxLength={100}
                required
              />
              {erroresValidacion.apellidos && (
                <span className="field-error-msg">{erroresValidacion.apellidos}</span>
              )}
            </div>

            {/* Fecha de Nacimiento */}
            <div className="form-field-group">
              <label htmlFor="fechaNacimiento" className="form-label">
                Fecha de Nacimiento *
              </label>
              <input
                id="fechaNacimiento"
                type="date"
                name="fechaNacimiento"
                max={new Date().toISOString().split('T')[0]}
                className={`form-input ${erroresValidacion.fechaNacimiento ? 'is-invalid' : ''}`}
                value={formData.fechaNacimiento}
                onChange={handleChange}
                required
              />
              {erroresValidacion.fechaNacimiento && (
                <span className="field-error-msg">{erroresValidacion.fechaNacimiento}</span>
              )}
            </div>

            {/* Dirección */}
            <div className="form-field-group">
              <label htmlFor="direccion" className="form-label">
                Dirección de Residencia *
              </label>
              <input
                id="direccion"
                type="text"
                name="direccion"
                placeholder="Ej. Calle 10 # 43E-22, El Poblado"
                className={`form-input ${erroresValidacion.direccion ? 'is-invalid' : ''}`}
                value={formData.direccion}
                onChange={handleChange}
                maxLength={200}
                required
              />
              {erroresValidacion.direccion && (
                <span className="field-error-msg">{erroresValidacion.direccion}</span>
              )}
            </div>
          </div>

          {/* Geografía en Cascada (País -> Departamento -> Ciudad) */}
          <div className="form-grid-3col">
            {/* País */}
            <div className="form-field-group">
              <label htmlFor="paisId" className="form-label">
                País *
              </label>
              <select
                id="paisId"
                name="paisId"
                className="form-select"
                value={formData.paisId}
                onChange={handlePaisChange}
                required
                disabled={loadingCatalogos}
              >
                {paises.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Departamento */}
            <div className="form-field-group">
              <label htmlFor="departamentoId" className="form-label">
                Departamento *
              </label>
              <select
                id="departamentoId"
                name="departamentoId"
                className="form-select"
                value={formData.departamentoId}
                onChange={handleDepartamentoChange}
                required
                disabled={departamentos.length === 0}
              >
                {departamentos.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Ciudad */}
            <div className="form-field-group">
              <label htmlFor="ciudadId" className="form-label">
                Ciudad *
              </label>
              <select
                id="ciudadId"
                name="ciudadId"
                className={`form-select ${erroresValidacion.ciudadId ? 'is-invalid' : ''}`}
                value={formData.ciudadId}
                onChange={handleChange}
                required
                disabled={ciudades.length === 0}
              >
                {ciudades.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
              {erroresValidacion.ciudadId && (
                <span className="field-error-msg">{erroresValidacion.ciudadId}</span>
              )}
            </div>
          </div>

          {/* Habeas Data Legal Checkbox */}
          <div className="habeas-data-container">
            <label className="habeas-checkbox-label">
              <input
                type="checkbox"
                name="autorizaTratamientoDatos"
                checked={formData.autorizaTratamientoDatos}
                onChange={handleChange}
                className="habeas-checkbox"
                required
              />
              <span className="habeas-text">
                Autorizo el tratamiento de mis datos personales según la <strong>Ley 1581 de 2012</strong> (Habeas Data) y la política de privacidad de Grupo Uribe.{' '}
                <button
                  type="button"
                  className="btn-ver-politica"
                  onClick={() => setMostrarModalHabeas(true)}
                >
                  Ver política
                </button>
              </span>
            </label>
          </div>

          {/* Botón Submit */}
          <div className="form-submit-row">
            <button
              type="submit"
              className="btn-unirme btn-submit-form"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner-wrapper">
                  <span className="spinner-icon"></span> Registrando...
                </span>
              ) : (
                `Completar Registro en ${selectedMarca.nombre} →`
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de Política de Habeas Data */}
      {mostrarModalHabeas && (
        <div className="modal-backdrop" onClick={() => setMostrarModalHabeas(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Política de Tratamiento de Datos (Ley 1581 de 2012)</h3>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setMostrarModalHabeas(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>
                En cumplimiento de la <strong>Ley Estatutaria 1581 de 2012</strong> y sus decretos reglamentarios, el <strong>Grupo Uribe (GCO)</strong> y sus marcas asociadas (<em>Americanino, American Eagle, Chevignon, Esprit, Naf Naf, Rifle</em>) informan que los datos suministrados serán incorporados a nuestra base de datos de fidelización con las siguientes finalidades:
              </p>
              <ul>
                <li>Gestión, administración y liquidación de puntos y beneficios del programa de fidelización.</li>
                <li>Envío de comunicaciones comerciales, descuentos especiales y lanzamientos de nuevas colecciones.</li>
                <li>Personalización de promociones y ofertas exclusivas de acuerdo a sus preferencias.</li>
              </ul>
              <p>
                Como titular de la información, usted tiene derecho a conocer, actualizar, rectificar o solicitar la supresión de sus datos personales a través de nuestros canales oficiales de atención al cliente.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-unirme btn-modal-entendido"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, autorizaTratamientoDatos: true }));
                  setMostrarModalHabeas(false);
                }}
              >
                Entendido y Autorizo ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
