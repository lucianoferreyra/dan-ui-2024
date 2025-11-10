'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { obtenerProductoPorId, obtenerCategorias, actualizarProducto } from '@/lib/productos-api';

export default function EditarProducto() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    stockMinimo: '0',
    precio: '0',
    descuentoPromocional: '0'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar categorías y producto en paralelo
        const [categoriasData, productoData] = await Promise.all([
          obtenerCategorias(),
          obtenerProductoPorId(params.id)
        ]);
        console.log("categorias", categoriasData);
        setCategorias(categoriasData);

        if (productoData) {
          console.log('productoData', productoData);
          setFormData({
            nombre: productoData.nombre || '',
            descripcion: productoData.descripcion || '',
            categoria: productoData.categoria.id?.toString() || '',
            stockMinimo: productoData.stockMinimo?.toString() || '0',
            precio: productoData.precio?.toString() || '0',
            descuentoPromocional: productoData.descuentoPromocional?.toString() || '0'
          });
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        alert('Error al cargar los datos del producto. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
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

      // Llamada a la API para actualizar el producto
      await actualizarProducto(params.id, dataToSend);

      console.log('Producto actualizado:', params.id, dataToSend);

      // Redirigir al detalle del producto
      router.push(`/productos/${params.id}`);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      alert('Error al actualizar el producto. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className="spinner"></div>
          <p>Cargando información del producto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href={`/productos/${params.id}`} className={styles.backLink}>
          ← Volver al Producto
        </Link>
        <h1>Editar Producto</h1>
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
              {console.log(formData.categoria)}
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
            <Link href={`/productos/${params.id}`}>
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
