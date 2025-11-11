import apiClient from "./api-client";

/**
 * Obtener todas las obras
 */
export async function obtenerObras(searchTerm = null) {
  try {
    const response = await apiClient.get(`/clientes/api/obras?searchTerm=${encodeURIComponent(searchTerm)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching obras:', error);
    throw error;
  }
}

/**
 * Obtener una obra por ID
 */
export async function obtenerObraPorId(id) {
  try {
    const response = await apiClient.get(`/clientes/api/obras/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error en obtenerObraPorId:', error);
    throw error;
  }
}

/**
 * Crear una nueva obra
 */
export async function crearObra(obraData) {
  try {
    const response = await apiClient.post('/clientes/api/obras', obraData);
    return response.data;
  } catch (error) {
    console.error('Error en crearObra:', error);
    throw error;
  }
}

/**
 * Actualizar una obra existente
 */
export async function actualizarObra(id, obraData) {
  try {
    const response = await apiClient.put(`/clientes/api/obras/${id}`, obraData);
    return response.data;
  } catch (error) {
    console.error('Error en actualizarObra:', error);
    throw error;
  }
}

/**
 * Eliminar una obra
 */
export async function eliminarObra(id) {
  try {
    await apiClient.delete(`/clientes/api/obras/${id}`);
    return true;
  } catch (error) {
    console.error('Error en eliminarObra:', error);
    throw error;
  }
}

/**
 * Asignar un cliente a una obra
 */
export async function asignarClienteAObra(obraId, clienteId) {
  try {
    const response = await apiClient.put(`/clientes/api/obras/${obraId}/asignar-cliente/${clienteId}`);
    return response.data;
  } catch (error) {
    console.error('Error en asignarClienteAObra:', error);
    throw error;
  }
}

/**
 * Estados de obra disponibles
 */
export const ESTADOS_OBRA = {
  PENDIENTE: 'PENDIENTE',
  EN_PROGRESO: 'EN_PROGRESO',
  FINALIZADA: 'FINALIZADA',
  CANCELADA: 'CANCELADA'
};

/**
 * Formatear estado de obra para mostrar
 */
export function formatearEstadoObra(estado) {
  const estados = {
    'PENDIENTE': 'Pendiente',
    'EN_PROGRESO': 'En Progreso',
    'FINALIZADA': 'Finalizada',
    'CANCELADA': 'Cancelada'
  };
  return estados[estado] || estado;
}

/**
 * Formatear moneda (pesos argentinos)
 */
export function formatearMoneda(valor) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(valor);
}

/**
 * Formatear coordenadas
 */
export function formatearCoordenadas(lat, lng) {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}
