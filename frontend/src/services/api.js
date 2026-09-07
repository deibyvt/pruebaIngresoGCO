const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  async getTiposDocumento() {
    const res = await fetch(`${API_BASE_URL}/catalogos/tipos-documento`);
    if (!res.ok) throw new Error('Error al cargar tipos de documento');
    return res.json();
  },

  async getMarcas() {
    const res = await fetch(`${API_BASE_URL}/catalogos/marcas`);
    if (!res.ok) throw new Error('Error al cargar marcas');
    return res.json();
  },

  async getPaises() {
    const res = await fetch(`${API_BASE_URL}/catalogos/paises`);
    if (!res.ok) throw new Error('Error al cargar paises');
    return res.json();
  },

  async getDepartamentos(paisId) {
    const res = await fetch(`${API_BASE_URL}/catalogos/departamentos/${paisId}`);
    if (!res.ok) throw new Error('Error al cargar departamentos');
    return res.json();
  },

  async getCiudades(departamentoId) {
    const res = await fetch(`${API_BASE_URL}/catalogos/ciudades/${departamentoId}`);
    if (!res.ok) throw new Error('Error al cargar ciudades');
    return res.json();
  },

  async registrarCliente(clienteData) {
    const res = await fetch(`${API_BASE_URL}/clientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clienteData),
    });

    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.mensaje || data.error || 'Error al registrar cliente');
      error.status = res.status;
      error.detalles = data.errores || null;
      throw error;
    }

    return data;
  },

  async getClientes() {
    const res = await fetch(`${API_BASE_URL}/clientes`);
    if (!res.ok) throw new Error('Error al consultar clientes');
    return res.json();
  },
};
