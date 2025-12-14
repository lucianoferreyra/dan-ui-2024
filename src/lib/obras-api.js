import apiClient from "./api-client";

/**
 * Obtener todas las obras
 */
export async function obtenerObras(searchTerm = null, usuarioId = null) {
  try {
    const params = new URLSearchParams();
    if (searchTerm) params.append('searchTerm', searchTerm);
    if (usuarioId) params.append('usuarioId', usuarioId);
    
    const queryString = params.toString();
    const response = await apiClient.get(`/clientes/api/obras${queryString ? `?${queryString}` : ''}`);
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
  HABILITADA: 'HABILITADA',
  PENDIENTE: 'PENDIENTE',
  FINALIZADA: 'FINALIZADA'
};

/**
 * Formatear estado de obra para mostrar
 */
export function formatearEstadoObra(estado) {
  const estados = {
    'HABILITADA': 'Habilitada',
    'PENDIENTE': 'Pendiente',
    'FINALIZADA': 'Finalizada'
  };
  return estados[estado] || estado;
}

/**
 * Obtener obras habilitadas de un cliente
 */
export async function obtenerObrasHabilitadasPorCliente(clienteId) {
  try {
    const response = await apiClient.get(`/clientes/api/obras?clienteId=${clienteId}&estado=HABILITADA`);
    return response.data;
  } catch (error) {
    console.error('Error en obtenerObrasHabilitadasPorCliente:', error);
    throw error;
  }
}

/**
 * Validar si un cliente puede tener una nueva obra habilitada
 * @param {number} clienteId - ID del cliente
 * @param {number} maximoObras - Máximo de obras permitidas para el cliente
 * @param {number|null} obraActualId - ID de la obra actual (para edición, null para creación)
 * @returns {Promise<{puedeHabilitar: boolean, obrasHabilitadas: number, mensaje: string}>}
 */
export async function validarEstadoObra(clienteId, maximoObras, obraActualId = null) {
  try {
    // Obtener todas las obras del cliente
    const response = await apiClient.get(`/clientes/api/obras?clienteId=${clienteId}`);
    const obrasCliente = response.data || [];
    
    // Contar obras habilitadas (excluyendo la obra actual si estamos editando)
    const obrasHabilitadas = obrasCliente.filter(obra => 
      obra.estado === 'HABILITADA' && 
      (obraActualId === null || obra.id !== parseInt(obraActualId))
    ).length;
    
    const puedeHabilitar = obrasHabilitadas < maximoObras;
    
    return {
      puedeHabilitar,
      obrasHabilitadas,
      mensaje: puedeHabilitar 
        ? `El cliente tiene ${obrasHabilitadas} de ${maximoObras} obras habilitadas` 
        : `El cliente alcanzó el máximo de ${maximoObras} obras habilitadas`
    };
  } catch (error) {
    console.error('Error en validarEstadoObra:', error);
    throw error;
  }
}

/**
 * Determinar el estado correcto para una obra según las reglas de negocio
 * @param {string} estadoDeseado - Estado que el usuario desea asignar
 * @param {number} clienteId - ID del cliente
 * @param {number} maximoObras - Máximo de obras permitidas para el cliente
 * @param {number|null} obraActualId - ID de la obra actual (para edición)
 * @returns {Promise<{estado: string, mensaje: string}>}
 */
export async function determinarEstadoObra(estadoDeseado, clienteId, maximoObras, obraActualId = null) {
  try {
    // Si quiere finalizar la obra, siempre se puede
    if (estadoDeseado === 'FINALIZADA') {
      return {
        estado: 'FINALIZADA',
        mensaje: 'La obra será finalizada'
      };
    }
    
    // Si quiere habilitar la obra, validar si hay cupo
    if (estadoDeseado === 'HABILITADA') {
      const validacion = await validarEstadoObra(clienteId, maximoObras, obraActualId);
      
      if (validacion.puedeHabilitar) {
        return {
          estado: 'HABILITADA',
          mensaje: `Obra habilitada. ${validacion.mensaje}`
        };
      } else {
        return {
          estado: 'PENDIENTE',
          mensaje: `La obra quedará en estado PENDIENTE porque el cliente alcanzó el máximo de ${maximoObras} obras habilitadas`
        };
      }
    }
    
    // Si quiere dejar en pendiente, siempre se puede
    if (estadoDeseado === 'PENDIENTE') {
      return {
        estado: 'PENDIENTE',
        mensaje: 'La obra quedará en estado pendiente'
      };
    }
    
    // Estado por defecto
    return {
      estado: 'PENDIENTE',
      mensaje: 'Estado no reconocido, se asignará PENDIENTE'
    };
  } catch (error) {
    console.error('Error en determinarEstadoObra:', error);
    throw error;
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

/**
 * Formatear coordenadas
 */
export function formatearCoordenadas(lat, lng) {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}
