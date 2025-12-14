'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { obtenerTodosLosUsuarios, eliminarUsuario } from '@/lib/usuarios-api';
import { obtenerClientes } from '@/lib/clientes-api';
import UsuarioForm from '@/components/UsuarioForm';
import styles from './page.module.css';

export default function UsuariosPage() {
  const router = useRouter();
  const { selectUser } = useUser();
  const [usuarios, setUsuarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usuariosData, clientesData] = await Promise.all([
        obtenerTodosLosUsuarios(),
        obtenerClientes()
      ]);
      setUsuarios(usuariosData);
      setClientes(clientesData);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los datos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (usuario) => {
    selectUser(usuario);
    router.push('/');
  };

  const handleEditUser = (usuario) => {
    setEditingUsuario(usuario);
    setShowForm(true);
  };

  const handleNewUser = () => {
    setEditingUsuario(null);
    setShowForm(true);
  };

  const handleDeleteUser = async (usuario) => {
    if (!confirm(`¿Está seguro que desea eliminar el usuario ${usuario.nombre} ${usuario.apellido}?`)) {
      return;
    }

    try {
      await eliminarUsuario(usuario.id);
      await cargarDatos();
    } catch (err) {
      console.error('Error eliminando usuario:', err);
      alert('Error al eliminar el usuario. Por favor, intente nuevamente.');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingUsuario(null);
    cargarDatos();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingUsuario(null);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando usuarios...</div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className={styles.container}>
        <UsuarioForm
          usuario={editingUsuario}
          clientes={clientes}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Seleccionar Usuario</h1>
        <p className={styles.subtitle}>Elija un usuario para continuar o cree uno nuevo</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.userList}>
        <h2 className={styles.userListTitle}>Usuarios Disponibles</h2>
        
        {usuarios.length === 0 ? (
          <div className={styles.noUsers}>
            No hay usuarios disponibles. Cree uno nuevo para comenzar.
          </div>
        ) : (
          usuarios.map((usuario) => (
            <div key={usuario.id} className={styles.userItem}>
              <div className={styles.userInfo}>
                <div className={styles.userName}>
                  {usuario.nombre} {usuario.apellido}
                </div>
                <div className={styles.userDetails}>
                  DNI: {usuario.dni} | Email: {usuario.correoElectronico}
                  {usuario.clientes && usuario.clientes.length > 0 && (
                    <> | Clientes: {usuario.clientes.map(c => c.nombre).join(', ')}</>
                  )}
                </div>
              </div>
              <div className={styles.userActions}>
                <button
                  className={styles.selectButton}
                  onClick={() => handleSelectUser(usuario)}
                >
                  Seleccionar
                </button>
                <button
                  className={styles.editButton}
                  onClick={() => handleEditUser(usuario)}
                >
                  Editar
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteUser(usuario)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button className={styles.newUserButton} onClick={handleNewUser}>
        + Crear Nuevo Usuario
      </button>
    </div>
  );
}
