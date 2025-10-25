'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { obtenerClientePorId, actualizarCliente } from '@/lib/clientes-api';

export default function EditarCliente() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    cuit: '',
    maximoDescubierto: '',
    maximoCantidadObras: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const cargarCliente = async () => {
      try {
        const clienteData = await obtenerClientePorId(params.id);
        
        if (clienteData) {
          setFormData({
            nombre: clienteData.nombre || '',
            email: clienteData.correoElectronico || '',
            cuit: formatCuitInput(clienteData.cuit) || '',
            maximoDescubierto: clienteData.maximoDescubierto?.toString() || '0',
            maximoCantidadObras: clienteData.maximoCantidadObrasEnEjecucion?.toString() || '1'
          });
        }
      } catch (error) {
        console.error('Error al cargar cliente:', error);
        alert('Error al cargar los datos del cliente. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    cargarCliente();
  }, [params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.cuit.trim()) {
      newErrors.cuit = 'El CUIT es requerido';
    } else if (!/^\d{2}-\d{8}-\d{1}$/.test(formData.cuit)) {
      newErrors.cuit = 'El CUIT debe tener el formato XX-XXXXXXXX-X';
    }

    if (!formData.maximoDescubierto) {
      newErrors.maximoDescubierto = 'El máximo descubierto es requerido';
    } else if (parseFloat(formData.maximoDescubierto) < 0) {
      newErrors.maximoDescubierto = 'El valor debe ser positivo';
    }

    if (!formData.maximoCantidadObras) {
      newErrors.maximoCantidadObras = 'La máxima cantidad de obras es requerida';
    } else if (parseInt(formData.maximoCantidadObras) < 1) {
      newErrors.maximoCantidadObras = 'El valor debe ser al menos 1';
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
      // Preparar datos para enviar
      const dataToSend = {
        nombre: formData.nombre.trim(),
        correoElectronico: formData.email.trim(),
        cuit: formData.cuit.trim(),
        maximoDescubierto: parseFloat(formData.maximoDescubierto),
        maximoCantidadObrasEnEjecucion: parseInt(formData.maximoCantidadObras)
      };

      // Llamada a la API para actualizar el cliente
      await actualizarCliente(params.id, dataToSend);
      
      console.log('Cliente actualizado:', params.id, dataToSend);
      
      // Redirigir al detalle del cliente
      router.push(`/clientes/${params.id}`);
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      alert('Error al actualizar el cliente. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCuitInput = (value) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 10) {
      return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 10)}-${numbers.slice(10, 11)}`;
    }
  };

  const handleCuitChange = (e) => {
    const formatted = formatCuitInput(e.target.value);
    setFormData(prev => ({
      ...prev,
      cuit: formatted
    }));
    if (errors.cuit) {
      setErrors(prev => ({
        ...prev,
        cuit: ''
      }));
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className="spinner"></div>
          <p>Cargando información del cliente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href={`/clientes/${params.id}`} className={styles.backLink}>
          ← Volver al Cliente
        </Link>
        <h1>Editar Cliente</h1>
      </div>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="nombre">
                Nombre <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Empresa ABC S.A."
                className={errors.nombre ? styles.inputError : ''}
              />
              {errors.nombre && (
                <span className={styles.errorMessage}>{errors.nombre}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">
                Email <span className={styles.required}>*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ej: contacto@empresa.com"
                className={errors.email ? styles.inputError : ''}
              />
              {errors.email && (
                <span className={styles.errorMessage}>{errors.email}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cuit">
                CUIT <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="cuit"
                name="cuit"
                value={formData.cuit}
                onChange={handleCuitChange}
                placeholder="XX-XXXXXXXX-X"
                maxLength="13"
                className={errors.cuit ? styles.inputError : ''}
              />
              {errors.cuit && (
                <span className={styles.errorMessage}>{errors.cuit}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="maximoDescubierto">
                Máximo Descubierto (ARS) <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="maximoDescubierto"
                name="maximoDescubierto"
                value={formData.maximoDescubierto}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={errors.maximoDescubierto ? styles.inputError : ''}
              />
              {errors.maximoDescubierto && (
                <span className={styles.errorMessage}>{errors.maximoDescubierto}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="maximoCantidadObras">
                Máxima Cantidad de Obras en Ejecución <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="maximoCantidadObras"
                name="maximoCantidadObras"
                value={formData.maximoCantidadObras}
                onChange={handleChange}
                placeholder="0"
                min="1"
                className={errors.maximoCantidadObras ? styles.inputError : ''}
              />
              {errors.maximoCantidadObras && (
                <span className={styles.errorMessage}>{errors.maximoCantidadObras}</span>
              )}
            </div>
          </div>

          <div className={styles.formActions}>
            <Link href={`/clientes/${params.id}`}>
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
