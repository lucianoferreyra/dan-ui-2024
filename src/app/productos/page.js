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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await buscarProductos('abc');
      console.log(res);
      setResults(res || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSearch = async () => {
    const res = await buscarProductos(searchTerm);
    setResults(res || []);
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
            placeholder="Buscar por número o nombre de producto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Buscar</button>
          <Link href="/productos/nuevo">
            <button className={styles.createButton}>+ Crear nuevo producto</button>
          </Link>
        </div>
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
