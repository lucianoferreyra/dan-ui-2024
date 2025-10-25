import apiClient from "./api-client";

/**
 * Obtener todos los clientes
 */
export async function obtenerClientes(searchTerm = null) {
  try {
    const response = await apiClient.get(`/clientes/api/clientes?searchTerm=${encodeURIComponent(searchTerm)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching clientes:', error);
    throw error;
  }
}

/**
 * Obtener un cliente por ID
 */
export async function obtenerClientePorId(id) {
  try {
    const response = await apiClient.get(`/clientes/api/clientes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error en obtenerClientePorId:', error);
    throw error;
  }
}

/**
 * Crear un nuevo cliente
 */
export async function crearCliente(clienteData) {
  try {
    const response = await apiClient.post('/clientes/api/clientes', clienteData);
    return response.data;
  } catch (error) {
    console.error('Error en crearCliente:', error);
    throw error;
  }
}

/**
 * Actualizar un cliente existente
 */
export async function actualizarCliente(id, clienteData) {
  try {
    const response = await apiClient.put(`/clientes/api/clientes/${id}`, clienteData);
    return response.data;
  } catch (error) {
    console.error('Error en actualizarCliente:', error);
    throw error;
  }
}

/**
 * Eliminar un cliente
 */
export async function eliminarCliente(id) {
  try {
    await apiClient.delete(`/clientes/api/clientes/${id}`);
    return true;
  } catch (error) {
    console.error('Error en eliminarCliente:', error);
    throw error;
  }
}

/**
 * Validar CUIT (formato argentino)
 */
export function validarCUIT(cuit) {
  const cuitLimpio = cuit.replace(/[-_]/g, '');

  if (cuitLimpio.length !== 11) {
    return false;
  }

  const [checkDigit, ...rest] = cuitLimpio.split('').map(Number).reverse();
  const total = rest.reduce((acc, cur, index) => {
    const multiplier = 2 + (index % 6);
    return acc + cur * multiplier;
  }, 0);

  const mod11 = 11 - (total % 11);
  const computedCheckDigit = mod11 === 11 ? 0 : mod11 === 10 ? 9 : mod11;

  return checkDigit === computedCheckDigit;
}

/**
 * Formatear CUIT con guiones
 */
export function formatearCUIT(cuit) {
  const numbers = cuit.replace(/\D/g, '');

  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 10) {
    return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
  } else {
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 10)}-${numbers.slice(10, 11)}`;
  }
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
