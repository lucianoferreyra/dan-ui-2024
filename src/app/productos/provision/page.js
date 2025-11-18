'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { buscarProductos, provisionarProducto } from '@/lib/productos-api';

export default function ProvisionProducto() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    idProducto: '',
    cantidadRecibida: '',
    precio: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [selectedProducto, setSelectedProducto] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await buscarProductos();
        setProductos(data || []);
      } catch (error) {
        console.error('Error fetching productos:', error);
        alert('Error al cargar los productos. Por favor, recarga la página.');
      } finally {
        setLoadingProductos(false);
      }
    };

    fetchProductos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'idProducto') {
      const producto = productos.find(p => p.id === parseInt(value));
      setSelectedProducto(producto);
    }
    
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

    if (!formData.idProducto) {
      newErrors.idProducto = 'Debe seleccionar un producto';
    }

    if (!formData.cantidadRecibida) {
      newErrors.cantidadRecibida = 'La cantidad recibida es requerida';
    } else if (parseInt(formData.cantidadRecibida) < 1) {
      newErrors.cantidadRecibida = 'La cantidad debe ser mayor a 0';
    }

    if (!formData.precio) {
      newErrors.precio = 'El precio es requerido';
    } else if (parseFloat(formData.precio) <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
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
        idProducto: parseInt(formData.idProducto),
        cantidadRecibida: parseInt(formData.cantidadRecibida),
        precio: parseFloat(formData.precio)
      };

      // Llamar a la API
      await provisionarProducto(dataToSend);

      alert(`Provisión registrada exitosamente.\nProducto: ${selectedProducto?.nombre}\nCantidad: ${formData.cantidadRecibida}\nNuevo precio: $${formData.precio}`);

      // Redirigir a la lista de productos
      router.push('/productos');
    } catch (error) {
      console.error('Error al registrar provisión:', error);
      alert('Error al registrar la provisión. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/productos" className={styles.backLink}>
          ← Volver a Productos
        </Link>
        <h1>Registrar Provisión de Producto</h1>
        <p className={styles.subtitle}>
          Registre la recepción de mercadería de un proveedor para actualizar el stock y precio del producto.
        </p>
      </div>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="idProducto">
                Producto <span className={styles.required}>*</span>
              </label>
              <select
                id="idProducto"
                name="idProducto"
                value={formData.idProducto}
                onChange={handleChange}
                className={errors.idProducto ? styles.inputError : ''}
                disabled={loadingProductos}
              >
                <option value="">
                  {loadingProductos ? 'Cargando productos...' : 'Seleccione un producto'}
                </option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre} (ID: {producto.id}) - Stock actual: {producto.stockActual || 0}
                  </option>
                ))}
              </select>
              {errors.idProducto && (
                <span className={styles.errorMessage}>{errors.idProducto}</span>
              )}
            </div>

            {selectedProducto && (
              <div className={`${styles.infoBox} ${styles.fullWidth}`}>
                <h3>Información del Producto Seleccionado</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Nombre:</span>
                    <span className={styles.infoValue}>{selectedProducto.nombre}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Stock Actual:</span>
                    <span className={styles.infoValue}>{selectedProducto.stockActual || 0} unidades</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Precio Actual:</span>
                    <span className={styles.infoValue}>ARS ${selectedProducto.precio?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Stock Mínimo:</span>
                    <span className={styles.infoValue}>{selectedProducto.stockMinimo || 0} unidades</span>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="cantidadRecibida">
                Cantidad Recibida <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="cantidadRecibida"
                name="cantidadRecibida"
                value={formData.cantidadRecibida}
                onChange={handleChange}
                placeholder="Ej: 100"
                min="1"
                step="1"
                className={errors.cantidadRecibida ? styles.inputError : ''}
              />
              {errors.cantidadRecibida && (
                <span className={styles.errorMessage}>{errors.cantidadRecibida}</span>
              )}
              <span className={styles.helpText}>
                Ingrese la cantidad de unidades recibidas del proveedor
              </span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="precio">
                Nuevo Precio Unitario (ARS) <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className={errors.precio ? styles.inputError : ''}
              />
              {errors.precio && (
                <span className={styles.errorMessage}>{errors.precio}</span>
              )}
              <span className={styles.helpText}>
                El precio del producto se actualizará con este valor
              </span>
            </div>

            {selectedProducto && formData.cantidadRecibida && (
              <div className={`${styles.summaryBox} ${styles.fullWidth}`}>
                <h3>Resumen de la Provisión</h3>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Stock Actual:</span>
                    <span className={styles.summaryValue}>{selectedProducto.stockActual || 0} unidades</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Cantidad a Agregar:</span>
                    <span className={styles.summaryValue}>+{formData.cantidadRecibida} unidades</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Nuevo Stock:</span>
                    <span className={styles.summaryValueHighlight}>
                      {(selectedProducto.stockActual || 0) + parseInt(formData.cantidadRecibida)} unidades
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            <Link href="/productos">
              <button type="button" className={styles.btnCancel}>
                Cancelar
              </button>
            </Link>
            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={isSubmitting || loadingProductos}
            >
              {isSubmitting ? 'Registrando...' : 'Registrar Provisión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
