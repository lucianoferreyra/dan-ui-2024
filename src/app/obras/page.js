'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { obtenerObras, formatearEstadoObra, formatearMoneda, asignarClienteAObra } from '@/lib/obras-api';
import { obtenerClientes } from '@/lib/clientes-api';

export default function Obras() {
  const [obras, setObras] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredObras, setFilteredObras] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAsignarModal, setShowAsignarModal] = useState(false);
  const [obraToDelete, setObraToDelete] = useState(null);
  const [obraToAsignar, setObraToAsignar] = useState(null);
  const [selectedClienteId, setSelectedClienteId] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async (filters) => {
    setLoading(true);
    try {
      const [obrasData, clientesData] = await Promise.all([
        obtenerObras(filters),
        obtenerClientes()
      ]);
      setObras(obrasData);
      setFilteredObras(obrasData);
      setClientes(clientesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      return;
    }
    await fetchData(searchTerm);
  };

  const handleDeleteClick = (obra) => {
    setObraToDelete(obra);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setObras(obras.filter(o => o.id !== obraToDelete.id));
    setFilteredObras(filteredObras.filter(o => o.id !== obraToDelete.id));
    setShowDeleteModal(false);
    setObraToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setObraToDelete(null);
  };

  const handleAsignarClick = (obra) => {
    setObraToAsignar(obra);
    setSelectedClienteId(obra.cliente?.id?.toString() || '');
    setShowAsignarModal(true);
  };

  const confirmAsignar = async () => {
    if (!selectedClienteId) {
      alert('Por favor, selecciona un cliente');
      return;
    }

    try {
      const res = await asignarClienteAObra(obraToAsignar.id, selectedClienteId);
      console.log('res', res)
      // Actualizar la lista de obras
      await fetchData();
      
      setShowAsignarModal(false);
      setObraToAsignar(null);
      setSelectedClienteId('');
      
      alert(res.mensaje || 'Cliente asignado correctamente');
    } catch (error) {
      console.error('Error al asignar cliente:', error);
      alert(error.response?.data?.error || 'Error al asignar cliente. Por favor, intenta nuevamente.');
    }
  };

  const cancelAsignar = () => {
    setShowAsignarModal(false);
    setObraToAsignar(null);
    setSelectedClienteId('');
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Gestión de Obras</h1>

        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Buscar por dirección, cliente o estado"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>Buscar</button>
          <Link href="/obras/nuevo">
            <button className={styles.createButton}>+ Nueva Obra</button>
          </Link>
        </div>
      </div>

      {obras.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Dirección</th>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Presupuesto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {obras.map(obra => (
                <tr key={obra.id}>
                  <td className={styles.direccionCell}>{obra.direccion}</td>
                  <td>{obra.cliente?.nombre || 'Sin asignar'}</td>
                  <td>
                    <span className={obra.esRemodelacion ? styles.badgeRemodelacion : styles.badgeNueva}>
                      {obra.esRemodelacion ? 'Remodelación' : 'Nueva'}
                    </span>
                  </td>
                  <td className={styles.currencyCell}>{formatearMoneda(obra.presupuesto)}</td>
                  <td>
                    <span className={`${styles.badge} ${getEstadoBadgeClass(obra.estado)}`}>
                      {formatearEstadoObra(obra.estado)}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <Link href={`/obras/${obra.id}`}>
                        <button className={styles.btnView}>Ver</button>
                      </Link>
                      <Link href={`/obras/${obra.id}/editar`}>
                        <button className={styles.btnEdit}>Editar</button>
                      </Link>
                      <button
                        className={styles.btnAsignar}
                        onClick={() => handleAsignarClick(obra)}
                      >
                        Asignar Cliente
                      </button>
                      <button
                        className={styles.btnDelete}
                        onClick={() => handleDeleteClick(obra)}
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
          {loading ? <p>Cargando obras...</p> : <p>No se encontraron obras. {searchTerm && 'Intenta con otra búsqueda o '}Crea una nueva.</p>}
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirmar Eliminación</h3>
            <p>¿Estás seguro que deseas eliminar la obra en <strong>{obraToDelete?.direccion}</strong>?</p>
            <p className={styles.warningText}>Esta acción no se puede deshacer.</p>
            <div className={styles.modalActions}>
              <button className={styles.btnCancel} onClick={cancelDelete}>
                Cancelar
              </button>
              <button className={styles.btnConfirmDelete} onClick={confirmDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de asignación de cliente */}
      {showAsignarModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Asignar Cliente a Obra</h3>
            <p><strong>Obra:</strong> {obraToAsignar?.direccion}</p>
            <p><strong>Cliente actual:</strong> {obraToAsignar?.cliente?.nombre || 'Sin asignar'}</p>
            
            <div className={styles.formGroup}>
              <label htmlFor="clienteSelect">Seleccionar Cliente:</label>
              <select
                id="clienteSelect"
                value={selectedClienteId}
                onChange={(e) => setSelectedClienteId(e.target.value)}
                className={styles.select}
              >
                <option value="">-- Seleccionar cliente --</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.btnCancel} onClick={cancelAsignar}>
                Cancelar
              </button>
              <button className={styles.btnConfirm} onClick={confirmAsignar}>
                Asignar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
