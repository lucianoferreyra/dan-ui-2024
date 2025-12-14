import apiClient from "./api-client";

/**
 * Obtener todos los usuarios de un cliente
 */
export async function obtenerUsuariosPorCliente(clienteId) {
  try {
    const response = await apiClient.get(`/clientes/api/usuarios/cliente/${clienteId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching usuarios by cliente:', error);
    throw error;
  }
}

/**
 * Obtener un usuario por ID
 */
export async function obtenerUsuarioPorId(id) {
  try {
    const response = await apiClient.get(`/clientes/api/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error en obtenerUsuarioPorId:', error);
    throw error;
  }
}

/**
 * Obtener un usuario por DNI
 */
export async function obtenerUsuarioPorDni(dni) {
  try {
    const response = await apiClient.get(`/clientes/api/usuarios/buscar/dni/${dni}`);
    return response.data;
  } catch (error) {
    console.error('Error en obtenerUsuarioPorDni:', error);
    throw error;
  }
}

/**
 * Obtener un usuario por email
 */
export async function obtenerUsuarioPorEmail(email) {
  try {
    const response = await apiClient.get(`/clientes/api/usuarios/buscar/email/${encodeURIComponent(email)}`);
    return response.data;
  } catch (error) {
    console.error('Error en obtenerUsuarioPorEmail:', error);
    throw error;
  }
}

/**
 * Crear un nuevo usuario
 */
export async function crearUsuario(usuarioData) {
  try {
    const response = await apiClient.post('/clientes/api/usuarios', usuarioData);
    return response.data;
  } catch (error) {
    console.error('Error en crearUsuario:', error);
    throw error;
  }
}

/**
 * Actualizar un usuario existente
 */
export async function actualizarUsuario(id, usuarioData) {
  try {
    const response = await apiClient.put(`/clientes/api/usuarios/${id}`, usuarioData);
    return response.data;
  } catch (error) {
    console.error('Error en actualizarUsuario:', error);
    throw error;
  }
}

/**
 * Eliminar un usuario
 */
export async function eliminarUsuario(id) {
  try {
    const response = await apiClient.delete(`/clientes/api/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error en eliminarUsuario:', error);
    throw error;
  }
}

/**
 * Obtener todos los usuarios (sin filtro por cliente)
 */
export async function obtenerTodosLosUsuarios() {
  try {
    const response = await apiClient.get('/clientes/api/usuarios');
    return response.data;
  } catch (error) {
    console.error('Error fetching all usuarios:', error);
    throw error;
  }
}
