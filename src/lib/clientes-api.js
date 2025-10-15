// API helper para la gestión de clientes
// Este archivo contiene todas las funciones para interactuar con la API de clientes

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * Obtener todos los clientes
 */
export async function obtenerClientes() {
  try {
    const response = await fetch(`${API_BASE_URL}/clientes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los clientes');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en obtenerClientes:', error);
    throw error;
  }
}

/**
 * Obtener un cliente por ID
 */
export async function obtenerClientePorId(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener el cliente');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en obtenerClientePorId:', error);
    throw error;
  }
}

/**
 * Buscar clientes por término de búsqueda
 */
export async function buscarClientes(searchTerm) {
  try {
    const response = await fetch(`${API_BASE_URL}/clientes/buscar?q=${encodeURIComponent(searchTerm)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al buscar clientes');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en buscarClientes:', error);
    throw error;
  }
}

/**
 * Crear un nuevo cliente
 */
export async function crearCliente(clienteData) {
  try {
    const response = await fetch(`${API_BASE_URL}/clientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clienteData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el cliente');
    }

    const data = await response.json();
    return data;
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
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clienteData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar el cliente');
    }

    const data = await response.json();
    return data;
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
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el cliente');
    }

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
