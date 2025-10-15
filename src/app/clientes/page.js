'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);

  // Simular carga de datos (reemplazar con API real)
  useEffect(() => {
    const mockClientes = [
      {
        id: 1,
        nombre: 'Empresa ABC S.A.',
        email: 'contacto@empresaabc.com',
        cuit: '30-12345678-9',
        maximoDescubierto: 150000.00,
        maximoCantidadObras: 5
      },
      {
        id: 2,
        nombre: 'Constructora XYZ',
        email: 'info@constructoraxyz.com',
        cuit: '30-98765432-1',
        maximoDescubierto: 250000.00,
        maximoCantidadObras: 8
      }
    ];
    setClientes(mockClientes);
    setFilteredClientes(mockClientes);
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredClientes(clientes);
      return;
    }

    const filtered = clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.cuit.includes(searchTerm)
    );
    setFilteredClientes(filtered);
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

      {filteredClientes.length > 0 ? (
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
              {filteredClientes.map(cliente => (
                <tr key={cliente.id}>
                  <td className={styles.nombreCell}>{cliente.nombre}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.cuit}</td>
                  <td className={styles.currencyCell}>{formatCurrency(cliente.maximoDescubierto)}</td>
                  <td className={styles.centerCell}>{cliente.maximoCantidadObras}</td>
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
          <p>No se encontraron clientes. {searchTerm && 'Intenta con otra búsqueda o '}Crea uno nuevo.</p>
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
