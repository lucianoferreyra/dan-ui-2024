'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { obtenerProductoPorId, eliminarProducto } from '@/lib/productos-api';
import ConfirmModal from '@/components/ConfirmModal';

export default function DetalleProducto() {
  const params = useParams();
  const router = useRouter();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const productoData = await obtenerProductoPorId(params.id);
        setProducto(productoData);
      } catch (error) {
        console.error('Error al cargar producto:', error);
        alert('Error al cargar los datos del producto.');
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [params.id]);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await eliminarProducto(producto.id);
      console.log('Producto eliminado:', producto.id);
      router.push('/productos');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto. Por favor, intenta nuevamente.');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(value);
  };

  const calculateDiscountedPrice = () => {
    if (!producto) return 0;
    const discount = producto.descuentoPromocional || 0;
    return producto.precio * (1 - discount / 100);
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

  if (!producto) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>Producto no encontrado</h2>
          <p>El producto que buscas no existe o ha sido eliminado.</p>
          <Link href="/productos">
            <button>Volver a Productos</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/productos" className={styles.backLink}>
          ← Volver a Productos
        </Link>
        <div className={styles.headerContent}>
          <div>
            <h1>{producto.nombre}</h1>
            <p className={styles.subtitle}>
              {producto.categoria?.nombre || 'Sin categoría'}
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link href={`/productos/${producto.id}/editar`}>
              <button className={styles.btnEdit}>Editar</button>
            </Link>
            <button className={styles.btnDelete} onClick={handleDelete}>
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Información General</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Nombre</span>
              <span className={styles.infoValue}>{producto.nombre}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Categoría</span>
              <span className={styles.infoValue}>
                {producto.categoria?.nombre || 'Sin categoría'}
              </span>
            </div>
            <div className={`${styles.infoItem} ${styles.fullWidth}`}>
              <span className={styles.infoLabel}>Descripción</span>
              <span className={styles.infoValue}>{producto.descripcion}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Precios y Descuentos</h2>
          <div className={styles.priceGrid}>
            <div className={styles.priceCard}>
              <div className={styles.priceLabel}>Precio Base</div>
              <div className={styles.priceValue}>
                {formatCurrency(producto.precio || 0)}
              </div>
            </div>
            <div className={styles.priceCard}>
              <div className={styles.priceLabel}>Descuento Promocional</div>
              <div className={styles.priceValue + ' ' + styles.discount}>
                {producto.descuentoPromocional || 0}%
              </div>
            </div>
            {producto.descuentoPromocional > 0 && (
              <div className={styles.priceCard + ' ' + styles.highlighted}>
                <div className={styles.priceLabel}>Precio con Descuento</div>
                <div className={styles.priceValue + ' ' + styles.success}>
                  {formatCurrency(calculateDiscountedPrice())}
                </div>
                <div className={styles.savings}>
                  Ahorro: {formatCurrency(producto.precio - calculateDiscountedPrice())}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Inventario</h2>
          <div className={styles.inventoryGrid}>
            <div className={styles.inventoryItem}>
              <span className={styles.inventoryLabel}>Stock Mínimo</span>
              <span className={styles.inventoryValue}>
                {producto.stockMinimo || 0} unidades
              </span>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Confirmar Eliminación"
        message={`¿Estás seguro que deseas eliminar el producto "${producto.nombre}"?`}
        warningText="Esta acción no se puede deshacer y se eliminarán todos los datos asociados."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText={isDeleting ? 'Eliminando...' : 'Eliminar'}
        cancelText="Cancelar"
        isDanger={true}
      />
    </div>
  );
}
