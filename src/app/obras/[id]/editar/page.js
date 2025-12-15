'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { obtenerObraPorId, actualizarObra, ESTADOS_OBRA, determinarEstadoObra } from '@/lib/obras-api';
import { obtenerClientes } from '@/lib/clientes-api';
import { useUser } from '@/contexts/UserContext';

export default function EditarObra() {
  const params = useParams();
  const router = useRouter();
  const { selectedUser } = useUser();
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [obraOriginal, setObraOriginal] = useState(null);
  const [mensajeEstado, setMensajeEstado] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    direccion: '',
    esRemodelacion: false,
    lat: '',
    lng: '',
    clienteId: '',
    presupuesto: '',
    estado: 'PENDIENTE'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!selectedUser) return;
      
      try {
        const [obraData, clientesData] = await Promise.all([
          obtenerObraPorId(params.id),
          obtenerClientes(null, selectedUser.id)
        ]);
        
        setClientes(clientesData);
        
        if (obraData) {
          setObraOriginal(obraData);
          const cliente = clientesData.find(c => c.id === obraData.cliente?.id);
          setClienteSeleccionado(cliente);
          
          setFormData({
            direccion: obraData.direccion || '',
            esRemodelacion: obraData.esRemodelacion || false,
            lat: obraData.lat?.toString() || '',
            lng: obraData.lng?.toString() || '',
            clienteId: obraData.cliente?.id?.toString() || '',
            presupuesto: obraData.presupuesto?.toString() || '0',
            estado: obraData.estado || 'PENDIENTE'
          });
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        alert('Error al cargar los datos de la obra. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [params.id, selectedUser]);

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Si cambió el cliente, actualizar el cliente seleccionado y validar estado
    if (name === 'clienteId' && value) {
      const cliente = clientes.find(c => c.id === parseInt(value));
      setClienteSeleccionado(cliente);
      
      // Si el estado actual es HABILITADA, validar si se puede habilitar con el nuevo cliente
      if (formData.estado === 'HABILITADA' && cliente) {
        try {
          const resultado = await determinarEstadoObra(
            'HABILITADA',
            parseInt(value),
            cliente.maximoCantidadObrasEnEjecucion || 1,
            parseInt(params.id)
          );
          
          setFormData(prev => ({
            ...prev,
            estado: resultado.estado
          }));
          
          setMensajeEstado(resultado.mensaje);
        } catch (error) {
          console.error('Error al validar estado:', error);
        }
      }
    }
    
    // Si cambió el estado, validar si se puede habilitar
    if (name === 'estado' && formData.clienteId) {
      const cliente = clientes.find(c => c.id === parseInt(formData.clienteId));
      if (cliente && value === 'HABILITADA') {
        try {
          const resultado = await determinarEstadoObra(
            'HABILITADA',
            parseInt(formData.clienteId),
            cliente.maximoCantidadObrasEnEjecucion || 1,
            parseInt(params.id)
          );
          
          setFormData(prev => ({
            ...prev,
            estado: resultado.estado
          }));
          
          setMensajeEstado(resultado.mensaje);
        } catch (error) {
          console.error('Error al validar estado:', error);
        }
      } else {
        setMensajeEstado('');
      }
    }
    
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }

    if (!formData.lat) {
      newErrors.lat = 'La latitud es requerida';
    } else if (isNaN(parseFloat(formData.lat)) || parseFloat(formData.lat) < -90 || parseFloat(formData.lat) > 90) {
      newErrors.lat = 'La latitud debe estar entre -90 y 90';
    }

    if (!formData.lng) {
      newErrors.lng = 'La longitud es requerida';
    } else if (isNaN(parseFloat(formData.lng)) || parseFloat(formData.lng) < -180 || parseFloat(formData.lng) > 180) {
      newErrors.lng = 'La longitud debe estar entre -180 y 180';
    }

    if (!formData.clienteId) {
      newErrors.clienteId = 'Debe seleccionar un cliente';
    }

    if (!formData.presupuesto) {
      newErrors.presupuesto = 'El presupuesto es requerido';
    } else if (parseFloat(formData.presupuesto) < 0) {
      newErrors.presupuesto = 'El presupuesto debe ser positivo';
    }

    if (!formData.estado) {
      newErrors.estado = 'El estado es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Validar el estado final antes de enviar
      const cliente = clientes.find(c => c.id === parseInt(formData.clienteId));
      const resultado = await determinarEstadoObra(
        formData.estado,
        parseInt(formData.clienteId),
        cliente?.maximoCantidadObrasEnEjecucion || 1,
        parseInt(params.id)
      );
      
      // Preparar datos para enviar
      const dataToSend = {
        direccion: formData.direccion.trim(),
        esRemodelacion: formData.esRemodelacion,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        cliente: {
          id: parseInt(formData.clienteId)
        },
        presupuesto: parseFloat(formData.presupuesto),
        estado: resultado.estado
      };

      // Llamada a la API para actualizar la obra
      await actualizarObra(params.id, dataToSend);
      
      console.log('Obra actualizada:', params.id, dataToSend);
      
      // Redirigir al detalle de la obra
      router.push(`/obras/${params.id}`);
    } catch (error) {
      console.error('Error al actualizar obra:', error);
      alert('Error al actualizar la obra. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className="spinner"></div>
          <p>Cargando información de la obra...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href={`/obras/${params.id}`} className={styles.backLink}>
          ← Volver a la Obra
        </Link>
        <h1>Editar Obra</h1>
      </div>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup + ' ' + styles.fullWidth}>
              <label htmlFor="direccion">
                Dirección <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Ej: Av. Corrientes 1234, CABA"
                className={errors.direccion ? styles.inputError : ''}
              />
              {errors.direccion && (
                <span className={styles.errorMessage}>{errors.direccion}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="clienteId">
                Cliente <span className={styles.required}>*</span>
              </label>
              <select
                id="clienteId"
                name="clienteId"
                value={formData.clienteId}
                onChange={handleChange}
                className={errors.clienteId ? styles.inputError : ''}
              >
                <option value="">-- Seleccionar cliente --</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre}
                  </option>
                ))}
              </select>
              {errors.clienteId && (
                <span className={styles.errorMessage}>{errors.clienteId}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="estado">
                Estado <span className={styles.required}>*</span>
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className={errors.estado ? styles.inputError : ''}
              >
                <option value="HABILITADA">Habilitada</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="FINALIZADA">Finalizada</option>
              </select>
              {errors.estado && (
                <span className={styles.errorMessage}>{errors.estado}</span>
              )}
              {mensajeEstado && (
                <span className={styles.infoMessage}>{mensajeEstado}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="presupuesto">
                Presupuesto (ARS) <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="presupuesto"
                name="presupuesto"
                value={formData.presupuesto}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={errors.presupuesto ? styles.inputError : ''}
              />
              {errors.presupuesto && (
                <span className={styles.errorMessage}>{errors.presupuesto}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lat">
                Latitud <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="lat"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                placeholder="Ej: -34.603722"
                step="any"
                min="-90"
                max="90"
                className={errors.lat ? styles.inputError : ''}
              />
              {errors.lat && (
                <span className={styles.errorMessage}>{errors.lat}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lng">
                Longitud <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="lng"
                name="lng"
                value={formData.lng}
                onChange={handleChange}
                placeholder="Ej: -58.381592"
                step="any"
                min="-180"
                max="180"
                className={errors.lng ? styles.inputError : ''}
              />
              {errors.lng && (
                <span className={styles.errorMessage}>{errors.lng}</span>
              )}
            </div>

            <div className={styles.formGroup + ' ' + styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="esRemodelacion"
                  checked={formData.esRemodelacion}
                  onChange={handleChange}
                />
                <span>Es una remodelación</span>
              </label>
            </div>
          </div>

          <div className={styles.formActions}>
            <Link href={`/obras/${params.id}`}>
              <button type="button" className={styles.btnCancel}>
                Cancelar
              </button>
            </Link>
            <button 
              type="submit" 
              className={styles.btnSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
