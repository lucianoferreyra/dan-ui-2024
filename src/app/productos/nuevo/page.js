'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { crearProducto, obtenerCategorias } from '@/lib/productos-api';

export default function NuevoProducto() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '0',
    stockMinimo: '0',
    precio: '0',
    descuentoPromocional: '0'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await obtenerCategorias();
        setCategorias(data);
      } catch (error) {
        console.error('Error fetching categorias:', error);
      }
    };

    fetchCategorias();
  }, []);

  // Categorías disponibles
  // const categorias = [
  //   'Materiales de Construcción',
  //   'Herramientas',
  //   'Electricidad',
  //   'Plomería',
  //   'Pintura',
  //   'Pisos y Revestimientos',
  //   'Ferretería',
  //   'Otros'
  // ];

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

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'Debe seleccionar una categoría';
    }

    if (!formData.stockMinimo) {
      newErrors.stockMinimo = 'El stock mínimo es requerido';
    } else if (parseInt(formData.stockMinimo) < 0) {
      newErrors.stockMinimo = 'El stock mínimo no puede ser negativo';
    }

    if (!formData.precio) {
      newErrors.precio = 'El precio es requerido';
    } else if (parseFloat(formData.precio) < 0) {
      newErrors.precio = 'El precio no puede ser negativo';
    }

    if (!formData.descuentoPromocional) {
      newErrors.descuentoPromocional = 'El descuento promocional es requerido';
    } else {
      const descuento = parseFloat(formData.descuentoPromocional);
      if (descuento < 0 || descuento > 100) {
        newErrors.descuentoPromocional = 'El descuento debe estar entre 0 y 100';
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
      // Preparar datos para enviar
      const dataToSend = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        categoriaId: parseInt(formData.categoria),
        stockMinimo: parseInt(formData.stockMinimo),
        precio: parseFloat(formData.precio),
        descuentoPromocional: parseFloat(formData.descuentoPromocional)
      };

      // Aquí iría la llamada a la API
      await crearProducto(dataToSend);

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Producto creado:', dataToSend);

      // Redirigir a la lista de productos
      router.push('/productos');
    } catch (error) {
      console.error('Error al crear producto:', error);
      alert('Error al crear el producto. Por favor, intenta nuevamente.');
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
        <h1>Nuevo Producto</h1>
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
                placeholder="Ej: Cemento Portland 50kg"
                className={errors.nombre ? styles.inputError : ''}
              />
              {errors.nombre && (
                <span className={styles.errorMessage}>{errors.nombre}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="categoria">
                Categoría <span className={styles.required}>*</span>
              </label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className={errors.categoria ? styles.inputError : ''}
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
              {errors.categoria && (
                <span className={styles.errorMessage}>{errors.categoria}</span>
              )}
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="descripcion">
                Descripción <span className={styles.required}>*</span>
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Ej: Cemento de alta calidad para construcción..."
                rows="4"
                className={errors.descripcion ? styles.inputError : ''}
              />
              {errors.descripcion && (
                <span className={styles.errorMessage}>{errors.descripcion}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="stockMinimo">
                Stock Mínimo <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="stockMinimo"
                name="stockMinimo"
                value={formData.stockMinimo}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="1"
                className={errors.stockMinimo ? styles.inputError : ''}
              />
              {errors.stockMinimo && (
                <span className={styles.errorMessage}>{errors.stockMinimo}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="precio">
                Precio (ARS) <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={errors.precio ? styles.inputError : ''}
              />
              {errors.precio && (
                <span className={styles.errorMessage}>{errors.precio}</span>
              )}
            </div>

            <div className={styles.formGroup}>
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
            </div>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
