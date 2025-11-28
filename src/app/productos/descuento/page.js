'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { buscarProductos, actualizarDescuentoPromocional } from '@/lib/productos-api';

export default function DescuentoPromocional() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    idProducto: '',
    descuentoPromocional: ''
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
      // Prellenar con el descuento actual si existe
      if (producto && producto.descuentoPromocional !== null && producto.descuentoPromocional !== undefined) {
        setFormData(prev => ({
          ...prev,
          idProducto: value,
          descuentoPromocional: producto.descuentoPromocional.toString()
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          idProducto: value,
          descuentoPromocional: '0'
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
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

    if (!formData.idProducto) {
      newErrors.idProducto = 'Debe seleccionar un producto';
    }

    if (formData.descuentoPromocional === '') {
      newErrors.descuentoPromocional = 'El descuento promocional es requerido';
    } else {
      const descuento = parseFloat(formData.descuentoPromocional);
      if (isNaN(descuento)) {
        newErrors.descuentoPromocional = 'El descuento debe ser un número válido';
      } else if (descuento < 0) {
        newErrors.descuentoPromocional = 'El descuento no puede ser negativo';
      } else if (descuento > 100) {
        newErrors.descuentoPromocional = 'El descuento no puede ser mayor a 100%';
      }
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
      const descuento = parseFloat(formData.descuentoPromocional);
      
      // Llamar a la API
      await actualizarDescuentoPromocional(parseInt(formData.idProducto), descuento);

      const mensaje = descuento > 0 
        ? `Descuento promocional actualizado exitosamente.\nProducto: ${selectedProducto?.nombre}\nDescuento aplicado: ${descuento}%`
        : `Descuento promocional removido exitosamente.\nProducto: ${selectedProducto?.nombre}`;
      
      alert(mensaje);

      // Redirigir a la lista de productos
      router.push('/productos');
    } catch (error) {
      console.error('Error al actualizar descuento promocional:', error);
      alert('Error al actualizar el descuento promocional. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calcularPrecioConDescuento = () => {
    if (!selectedProducto || !formData.descuentoPromocional) return null;
    
    const precio = selectedProducto.precio || 0;
    const descuento = parseFloat(formData.descuentoPromocional) || 0;
    const precioFinal = precio * (1 - descuento / 100);
    
    return precioFinal;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/productos" className={styles.backLink}>
          ← Volver a Productos
        </Link>
        <h1>Aplicar Descuento Promocional</h1>
        <p className={styles.subtitle}>
          Aplique o modifique el descuento promocional de un producto para realizar promociones especiales.
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
                    {producto.nombre} (ID: {producto.id}) - Precio: ARS ${producto.precio?.toFixed(2) || '0.00'}
                    {producto.descuentoPromocional > 0 && ` - Descuento actual: ${producto.descuentoPromocional}%`}
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
                    <span className={styles.infoLabel}>Precio Base:</span>
                    <span className={styles.infoValue}>ARS ${selectedProducto.precio?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Descuento Actual:</span>
                    <span className={styles.infoValue}>
                      {selectedProducto.descuentoPromocional > 0 
                        ? `${selectedProducto.descuentoPromocional}%` 
                        : 'Sin descuento'}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Stock Actual:</span>
                    <span className={styles.infoValue}>{selectedProducto.stockActual || 0} unidades</span>
                  </div>
                </div>
              </div>
            )}

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="descuentoPromocional">
                Descuento Promocional (%) <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="descuentoPromocional"
                name="descuentoPromocional"
                value={formData.descuentoPromocional}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                max="100"
                step="0.01"
                className={errors.descuentoPromocional ? styles.inputError : ''}
              />
              {errors.descuentoPromocional && (
                <span className={styles.errorMessage}>{errors.descuentoPromocional}</span>
              )}
              <span className={styles.helpText}>
                Ingrese el porcentaje de descuento a aplicar (0-100). Use 0 para remover el descuento.
              </span>
            </div>

            {selectedProducto && formData.descuentoPromocional !== '' && (
              <div className={`${styles.summaryBox} ${styles.fullWidth}`}>
                <h3>Resumen de Precios</h3>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Precio Original:</span>
                    <span className={styles.summaryValue}>
                      ARS ${selectedProducto.precio?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Descuento:</span>
                    <span className={styles.summaryValue}>
                      {formData.descuentoPromocional}%
                    </span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Precio Final:</span>
                    <span className={styles.summaryValueHighlight}>
                      ARS ${calcularPrecioConDescuento()?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
                {parseFloat(formData.descuentoPromocional) > 0 && (
                  <div className={styles.savingsBox}>
                    <span className={styles.savingsLabel}>El cliente ahorra:</span>
                    <span className={styles.savingsValue}>
                      ARS ${((selectedProducto.precio || 0) - (calcularPrecioConDescuento() || 0)).toFixed(2)}
                    </span>
                  </div>
                )}
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
              {isSubmitting ? 'Actualizando...' : 'Aplicar Descuento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
