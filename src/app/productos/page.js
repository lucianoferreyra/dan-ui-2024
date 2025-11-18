'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { buscarProductos, eliminarProducto } from "@/lib/productos-api";
import ConfirmModal from '@/components/ConfirmModal';
import styles from './page.module.css';

export default function Productos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    nombre: '',
    precioMin: '',
    precioMax: '',
    stockMin: '',
    stockMax: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await buscarProductos();
      console.log(res);
      setResults(res || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await buscarProductos(filters);
      setResults(res || []);
    } catch (error) {
      console.error('Error al buscar productos:', error);
      alert('Error al buscar productos. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClearFilters = async () => {
    const clearedFilters = {
      nombre: '',
      precioMin: '',
      precioMax: '',
      stockMin: '',
      stockMax: ''
    };
    setFilters(clearedFilters);
    setLoading(true);
    try {
      const res = await buscarProductos();
      setResults(res || []);
    } catch (error) {
      console.error('Error al buscar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (producto) => {
    setProductoToDelete(producto);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productoToDelete) return;
    
    setIsDeleting(true);
    try {
      await eliminarProducto(productoToDelete.id);
      // Actualizar la lista de productos después de eliminar
      setResults(results.filter(p => p.id !== productoToDelete.id));
      setShowDeleteModal(false);
      setProductoToDelete(null);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto. Por favor, intenta nuevamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductoToDelete(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Productos</h1>

        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Buscar por nombre de producto"
            value={filters.nombre}
            onChange={(e) => handleFilterChange('nombre', e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? '− Ocultar Filtros' : '+ Más Filtros'}
          </button>
          <button onClick={handleSearch} disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
          <Link href="/productos/provision">
            <button className={styles.provisionButton}>📦 Registrar Provisión</button>
          </Link>
          <Link href="/productos/nuevo">
            <button className={styles.createButton}>+ Crear nuevo producto</button>
          </Link>
        </div>

        {showFilters && (
          <div className={styles.filtersPanel}>
            <h3>Filtros Avanzados</h3>
            <div className={styles.filtersGrid}>
              <div className={styles.filterGroup}>
                <label>Precio Mínimo (ARS)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={filters.precioMin}
                  onChange={(e) => handleFilterChange('precioMin', e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className={styles.filterGroup}>
                <label>Precio Máximo (ARS)</label>
                <input
                  type="number"
                  placeholder="999999.99"
                  value={filters.precioMax}
                  onChange={(e) => handleFilterChange('precioMax', e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className={styles.filterGroup}>
                <label>Stock Mínimo</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.stockMin}
                  onChange={(e) => handleFilterChange('stockMin', e.target.value)}
                  min="0"
                  step="1"
                />
              </div>
              <div className={styles.filterGroup}>
                <label>Stock Máximo</label>
                <input
                  type="number"
                  placeholder="9999"
                  value={filters.stockMax}
                  onChange={(e) => handleFilterChange('stockMax', e.target.value)}
                  min="0"
                  step="1"
                />
              </div>
            </div>
            <div className={styles.filterActions}>
              <button onClick={handleClearFilters} className={styles.btnClear}>
                Limpiar Filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {results.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {results.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.nombre}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <Link href={`/productos/${product.id}`}>
                        <button className={styles.btnView}>
                          Ver
                        </button>
                      </Link>
                      <Link href={`/productos/${product.id}/editar`}>
                        <button className={styles.btnEdit}>Editar</button>
                      </Link>
                      <button
                        className={styles.btnDelete}
                        onClick={() => handleDeleteClick(product)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          {!loading && <p>No hay productos para mostrar. Realiza una búsqueda o crea uno nuevo.</p>}
          {loading && <p>Cargando productos...</p>}
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Confirmar Eliminación"
        message={`¿Estás seguro que deseas eliminar el producto "${productoToDelete?.nombre}"?`}
        warningText="Esta acción no se puede deshacer y se eliminarán todos los datos asociados."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText={isDeleting ? 'Eliminando...' : 'Eliminar'}
        cancelText="Cancelar"
        isDanger={true}
      />
    </div>
  );
};
