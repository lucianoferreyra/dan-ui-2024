'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { obtenerObraPorId, eliminarObra, formatearEstadoObra, formatearMoneda } from '@/lib/obras-api';

export default function DetalleObra() {
  const params = useParams();
  const router = useRouter();
  const [obra, setObra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const cargarObra = async () => {
      try {
        const obraData = await obtenerObraPorId(params.id);
        setObra(obraData);
      } catch (error) {
        console.error('Error al cargar obra:', error);
        alert('Error al cargar los datos de la obra.');
      } finally {
        setLoading(false);
      }
    };

    cargarObra();
  }, [params.id]);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await eliminarObra(obra.id);
      console.log('Obra eliminada:', obra.id);
      router.push('/obras');
    } catch (error) {
      console.error('Error al eliminar obra:', error);
      alert('Error al eliminar la obra. Por favor, intenta nuevamente.');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case 'HABILITADA':
        return styles.badgeEnProgreso;
      case 'PENDIENTE':
        return styles.badgePendiente;
      case 'FINALIZADA':
        return styles.badgeFinalizada;
      default:
        return '';
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

  if (!obra) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>Obra no encontrada</h2>
          <p>La obra que buscas no existe o ha sido eliminada.</p>
          <Link href="/obras">
            <button>Volver a Obras</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/obras" className={styles.backLink}>
          ← Volver a Obras
        </Link>
        <div className={styles.headerContent}>
          <div>
            <h1>{obra.direccion}</h1>
            <div className={styles.headerBadges}>
              <span className={`${styles.badge} ${getEstadoBadgeClass(obra.estado)}`}>
                {formatearEstadoObra(obra.estado)}
              </span>
              <span className={`${styles.badge} ${obra.esRemodelacion ? styles.badgeRemodelacion : styles.badgeNueva}`}>
                {obra.esRemodelacion ? 'Remodelación' : 'Nueva'}
              </span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <Link href={`/obras/${obra.id}/editar`}>
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
              <span className={styles.infoLabel}>Dirección</span>
              <span className={styles.infoValue}>{obra.direccion}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Estado</span>
              <span className={styles.infoValue}>
                <span className={`${styles.badge} ${getEstadoBadgeClass(obra.estado)}`}>
                  {formatearEstadoObra(obra.estado)}
                </span>
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Tipo de Obra</span>
              <span className={styles.infoValue}>
                {obra.esRemodelacion ? 'Remodelación' : 'Construcción Nueva'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Presupuesto</span>
              <span className={styles.infoValue + ' ' + styles.highlight}>
                {formatearMoneda(obra.presupuesto)}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Cliente Asignado</h2>
          {obra.cliente ? (
            <div className={styles.clienteCard}>
              <div className={styles.clienteInfo}>
                <h3>{obra.cliente.nombre}</h3>
                <div className={styles.clienteDetails}>
                  <div className={styles.clienteItem}>
                    <span className={styles.clienteLabel}>Email:</span>
                    <span className={styles.clienteValue}>{obra.cliente.correoElectronico}</span>
                  </div>
                  <div className={styles.clienteItem}>
                    <span className={styles.clienteLabel}>CUIT:</span>
                    <span className={styles.clienteValue}>{obra.cliente.cuit}</span>
                  </div>
                  <div className={styles.clienteItem}>
                    <span className={styles.clienteLabel}>Máximo Descubierto:</span>
                    <span className={styles.clienteValue}>
                      {formatearMoneda(obra.cliente.maximoDescubierto)}
                    </span>
                  </div>
                  <div className={styles.clienteItem}>
                    <span className={styles.clienteLabel}>Máx. Obras en Ejecución:</span>
                    <span className={styles.clienteValue}>
                      {obra.cliente.maximoCantidadObrasEnEjecucion}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.clienteActions}>
                <Link href={`/clientes/${obra.cliente.id}`}>
                  <button className={styles.btnViewCliente}>Ver Cliente</button>
                </Link>
              </div>
            </div>
          ) : (
            <div className={styles.noCliente}>
              <p>No hay cliente asignado a esta obra</p>
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h2>Ubicación</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Latitud</span>
              <span className={styles.infoValue}>{obra.lat?.toFixed(6)}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Longitud</span>
              <span className={styles.infoValue}>{obra.lng?.toFixed(6)}</span>
            </div>
          </div>
          {obra.lat && obra.lng && (
            <div className={styles.mapPlaceholder}>
              <p>Coordenadas: {obra.lat.toFixed(6)}, {obra.lng.toFixed(6)}</p>
              <a 
                href={`https://www.google.com/maps?q=${obra.lat},${obra.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnMap}
              >
                Ver en Google Maps
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirmar Eliminación</h3>
            <p>¿Estás seguro que deseas eliminar la obra en <strong>{obra.direccion}</strong>?</p>
            <p className={styles.warningText}>Esta acción no se puede deshacer.</p>
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
