'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { obtenerClientePorId, eliminarCliente, formatearMoneda } from '@/lib/clientes-api';

export default function DetalleCliente() {
  const params = useParams();
  const router = useRouter();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const cargarCliente = async () => {
      try {
        const clienteData = await obtenerClientePorId(params.id);
        setCliente(clienteData);
      } catch (error) {
        console.error('Error al cargar cliente:', error);
        alert('Error al cargar los datos del cliente.');
      } finally {
        setLoading(false);
      }
    };

    cargarCliente();
  }, [params.id]);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await eliminarCliente(cliente.id);
      console.log('Cliente eliminado:', cliente.id);
      router.push('/clientes');
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      alert('Error al eliminar el cliente. Por favor, intenta nuevamente.');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUsagePercentage = (current, max) => {
    return ((current / max) * 100).toFixed(1);
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

  if (!cliente) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>Cliente no encontrado</h2>
          <p>El cliente que buscas no existe o ha sido eliminado.</p>
          <Link href="/clientes">
            <button>Volver a Clientes</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/clientes" className={styles.backLink}>
          ← Volver a Clientes
        </Link>
        <div className={styles.headerContent}>
          <div>
            <h1>{cliente.nombre}</h1>
            {cliente.fechaCreacion && (
              <p className={styles.subtitle}>Cliente desde {formatDate(cliente.fechaCreacion)}</p>
            )}
          </div>
          <div className={styles.headerActions}>
            <Link href={`/clientes/${cliente.id}/editar`}>
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
              <span className={styles.infoValue}>{cliente.nombre}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>{cliente.correoElectronico}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>CUIT</span>
              <span className={styles.infoValue}>{cliente.cuit}</span>
            </div>
            {cliente.fechaCreacion && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Fecha de Creación</span>
                <span className={styles.infoValue}>{formatDate(cliente.fechaCreacion)}</span>
              </div>
            )}
          </div>
        </div>

        {/* {(cliente.descubiertoActual !== undefined || cliente.obrasActivas !== undefined) && ( */}
          <>
            {/* <div className={styles.section}>
              <h2>Límites y Capacidad</h2>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <span className={styles.statLabel}>Descubierto</span>
                    <span className={styles.statBadge}>
                      {getUsagePercentage(cliente.descubiertoActual || 0, cliente.maximoDescubierto)}% usado
                    </span>
                  </div>
                  <div className={styles.statValue}>
                    {formatearMoneda(cliente.descubiertoActual || 0)}
                  </div>
                  <div className={styles.statSubtext}>
                    de {formatearMoneda(cliente.maximoDescubierto)} máximo
                  </div>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${getUsagePercentage(cliente.descubiertoActual || 0, cliente.maximoDescubierto)}%` }}
                    ></div>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <span className={styles.statLabel}>Obras en Ejecución</span>
                    <span className={styles.statBadge}>
                      {getUsagePercentage(cliente.obrasActivas || 0, cliente.maximoCantidadObras)}% ocupado
                    </span>
                  </div>
                  <div className={styles.statValue}>
                    {cliente.obrasActivas || 0}
                  </div>
                  <div className={styles.statSubtext}>
                    de {cliente.maximoCantidadObras} máximo
                  </div>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${getUsagePercentage(cliente.obrasActivas || 0, cliente.maximoCantidadObras)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div> */}
  
            <div className={styles.section}>
              <h2>Resumen Financiero</h2>
              <div className={styles.financialGrid}>
                <div className={styles.financialItem}>
                  <span className={styles.financialLabel}>Máximo Descubierto</span>
                  <span className={styles.financialValue + ' ' + styles.success}>
                    {formatearMoneda(cliente.maximoDescubierto || 0)}
                  </span>
                </div>
                <div className={styles.financialItem}>
                  <span className={styles.financialLabel}>Máx. cantidad de obras en ejecución</span>
                  <span className={styles.financialValue + ' ' + styles.info}>
                    {cliente.maximoCantidadObrasEnEjecucion || 0} obras disponibles
                  </span>
                </div>
              </div>
            </div>
          </>
        {/* )} */}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirmar Eliminación</h3>
            <p>¿Estás seguro que deseas eliminar el cliente <strong>{cliente.nombre}</strong>?</p>
            <p className={styles.warningText}>Esta acción no se puede deshacer y se eliminarán todos los datos asociados.</p>
            <div className={styles.modalActions}>
              <button 
                className={styles.btnCancel} 
                onClick={cancelDelete}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button 
                className={styles.btnConfirmDelete} 
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
