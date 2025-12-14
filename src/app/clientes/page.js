'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { obtenerClientes } from '@/lib/clientes-api';
import { useUser } from '@/contexts/UserContext';

export default function Clientes() {
  const router = useRouter();
  const { selectedUser, loading: userLoading } = useUser();
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const fetchData = async (filters) => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      // Send the usuario ID instead of cliente ID
      const usuarioId = selectedUser.id;
      const data = await obtenerClientes(filters, usuarioId);
      setClientes(data);
      setFilteredClientes(data);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userLoading) return;
    if (!selectedUser) {
      router.push('/usuarios');
      return;
    }
    fetchData();
  }, [selectedUser, userLoading, router]);

  const handleSearch = async () => {
    // if (!searchTerm.trim()) {
    //   return;
    // }

    setSearching(true);
    try {
      await fetchData(searchTerm);
    } finally {
      setSearching(false);
    }
  };

  const handleDeleteClick = (cliente) => {
    setClienteToDelete(cliente);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Aquí iría la llamada a la API para eliminar
    setClientes(clientes.filter(c => c.id !== clienteToDelete.id));
    setFilteredClientes(filteredClientes.filter(c => c.id !== clienteToDelete.id));
    setShowDeleteModal(false);
    setClienteToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setClienteToDelete(null);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Gestión de Clientes</h1>

        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Buscar por nombre, email o CUIT"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>Buscar</button>
          <Link href="/clientes/nuevo">
            <button className={styles.createButton}>+ Nuevo Cliente</button>
          </Link>
        </div>
      </div>

      {clientes.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>CUIT</th>
                <th>Máx. Descubierto</th>
                <th>Máx. Obras</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(cliente => (
                <tr key={cliente.id}>
                  <td className={styles.nombreCell}>{cliente.nombre}</td>
                  <td>{cliente.correoElectronico}</td>
                  <td>{cliente.cuit}</td>
                  <td className={styles.currencyCell}>{formatCurrency(cliente.maximoDescubierto)}</td>
                  <td className={styles.centerCell}>{cliente.maximoCantidadObrasEnEjecucion}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <Link href={`/clientes/${cliente.id}`}>
                        <button className={styles.btnView}>Ver</button>
                      </Link>
                      <Link href={`/clientes/${cliente.id}/editar`}>
                        <button className={styles.btnEdit}>Editar</button>
                      </Link>
                      <button
                        className={styles.btnDelete}
                        onClick={() => handleDeleteClick(cliente)}
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
          {loading ? <p>Cargando clientes...</p> : <p>No se encontraron clientes. {searchTerm && 'Intenta con otra búsqueda o '}Crea uno nuevo.</p>}
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirmar Eliminación</h3>
            <p>¿Estás seguro que deseas eliminar el cliente <strong>{clienteToDelete?.nombre}</strong>?</p>
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
    </div>
  );
}
