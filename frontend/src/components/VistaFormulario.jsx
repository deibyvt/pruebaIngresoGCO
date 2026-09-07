import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function VistaFormulario({
  selectedMarca,
  onCambiarMarca,
  onRegistroExitoso
}) {
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [paises, setPaises] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [marcasBackend, setMarcasBackend] = useState([]);

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

  const [loading, setLoading] = useState(false);
  const [loadingCatalogos, setLoadingCatalogos] = useState(true);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [erroresValidacion, setErroresValidacion] = useState({});
  const [mostrarModalHabeas, setMostrarModalHabeas] = useState(false);

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

          const defaultTipo = tipos.length > 0 ? tipos[0].id : '';
          const defaultPais = listaPaises.length > 0 ? listaPaises[0].id : '';

          setFormData((prev) => ({
            ...prev,
            tipoDocumentoId: defaultTipo,
            paisId: defaultPais
          }));

          if (defaultPais) {
            const deptos = await api.getDepartamentos(defaultPais);
            if (isMounted) {
              setDepartamentos(deptos);
              const defaultDepto = deptos.length > 0 ? deptos[0].id : '';
              setFormData((prev) => ({ ...prev, departamentoId: defaultDepto }));

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
        console.error('Error al cargar catalogos:', err);
        setErrorGeneral('No se pudieron cargar los catalogos del servidor.');
      } finally {
        if (isMounted) setLoadingCatalogos(false);
      }
    }

    loadCatalogos();
    return () => { isMounted = false; };
  }, []);

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
        console.error('Error al cargar departamentos:', err);
      }
    }
  };

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
        console.error('Error al cargar ciudades:', err);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (erroresValidacion[name]) {
      setErroresValidacion((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
    if (errorGeneral) setErrorGeneral(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorGeneral(null);
    setErroresValidacion({});

    if (!formData.autorizaTratamientoDatos) {
      setErrorGeneral('Debes autorizar el tratamiento de datos personales para continuar.');
      return;
    }

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
        setErrorGeneral('Por favor revisa los campos indicados en el formulario.');
      } else {
        setErrorGeneral(err.message || 'Error al procesar el registro.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vista-formulario-container">
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

      <div className="form-content-section">
        <div className="form-header">
          <span className="form-subtitle-tag">GRUPO GCO - FIDELIZACION</span>
          <h2 className="form-main-title">REGISTRO DE CLIENTE</h2>
          <p className="form-lead-text">
            Ingresa tus datos para registrarte en <strong>{selectedMarca.nombre}</strong>.
          </p>
        </div>

        {errorGeneral && (
          <div className="form-alert-error" role="alert">
            <span className="alert-text">{errorGeneral}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="fidelizacion-form" noValidate>
          <div className="form-grid-2col">
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

            <div className="form-field-group">
              <label htmlFor="apellidos" className="form-label">
                Apellidos *
              </label>
              <input
                id="apellidos"
                type="text"
                name="apellidos"
                placeholder="Ej. Gomez Perez"
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

            <div className="form-field-group">
              <label htmlFor="direccion" className="form-label">
                Dirección de Residencia *
              </label>
              <input
                id="direccion"
                type="text"
                name="direccion"
                placeholder="Ej. Calle 10 # 43E-22"
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

          <div className="form-grid-3col">
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
                Autorizo el tratamiento de mis datos personales según la <strong>Ley 1581 de 2012</strong> y la política de privacidad.{' '}
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

          <div className="form-submit-row">
            <button
              type="submit"
              className="btn-unirme btn-submit-form"
              disabled={loading}
            >
              {loading ? 'Registrando...' : `Registrarme en ${selectedMarca.nombre}`}
            </button>
          </div>
        </form>
      </div>

      {mostrarModalHabeas && (
        <div className="modal-backdrop" onClick={() => setMostrarModalHabeas(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Tratamiento de Datos Personales (Ley 1581 de 2012)</h3>
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
                Los datos suministrados seran incorporados a la base de datos de fidelizacion de Grupo Uribe (GCO) para las siguientes finalidades:
              </p>
              <ul>
                <li>Administracion del programa de fidelizacion y puntos.</li>
                <li>Envio de novedades, beneficios y promociones exclusivas.</li>
              </ul>
              <p>
                El titular puede ejercer sus derechos de conocer, actualizar o suprimir sus datos a traves de los canales de atencion.
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
                Entendido y Autorizo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
