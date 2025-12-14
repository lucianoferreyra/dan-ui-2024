'use client';

import { useState, useEffect } from 'react';
import { crearUsuario, actualizarUsuario } from '@/lib/usuarios-api';
import styles from '@/app/usuarios/page.module.css';

export default function UsuarioForm({ usuario, clientes, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    clientesIds: []
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        dni: usuario.dni || '',
        email: usuario.email || usuario.correoElectronico || '',
        clientesIds: usuario.clientes?.map(c => c.id) || []
      });
    }
  }, [usuario]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio';
    }

    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es obligatorio';
    } else if (!/^\d+$/.test(formData.dni)) {
      newErrors.dni = 'El DNI debe contener solo números';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (formData.clientesIds.length === 0) {
      newErrors.clientesIds = 'Debe seleccionar al menos un cliente';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleClienteToggle = (clienteId) => {
    setFormData(prev => {
      const clientesIds = prev.clientesIds.includes(clienteId)
        ? prev.clientesIds.filter(id => id !== clienteId)
        : [...prev.clientesIds, clienteId];
      
      return {
        ...prev,
        clientesIds
      };
    });
    
    // Clear error when user selects a cliente
    if (errors.clientesIds) {
      setErrors(prev => ({
        ...prev,
        clientesIds: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        dni: formData.dni.trim(),
        correoElectronico: formData.email.trim(),
        clientes: formData.clientesIds.map(id => ({ id }))
      };

      if (usuario) {
        await actualizarUsuario(usuario.id, payload);
      } else {
        await crearUsuario(payload);
      }

      onSuccess();
    } catch (err) {
      console.error('Error guardando usuario:', err);
      alert('Error al guardar el usuario. Por favor, intente nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>
        {usuario ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      </h2>

      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="nombre">
          Nombre *
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          className={`${styles.formInput} ${errors.nombre ? styles.error : ''}`}
          value={formData.nombre}
          onChange={handleChange}
          disabled={submitting}
        />
        {errors.nombre && (
          <div className={styles.errorMessage}>{errors.nombre}</div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="apellido">
          Apellido *
        </label>
        <input
          type="text"
          id="apellido"
          name="apellido"
          className={`${styles.formInput} ${errors.apellido ? styles.error : ''}`}
          value={formData.apellido}
          onChange={handleChange}
          disabled={submitting}
        />
        {errors.apellido && (
          <div className={styles.errorMessage}>{errors.apellido}</div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="dni">
          DNI *
        </label>
        <input
          type="text"
          id="dni"
          name="dni"
          className={`${styles.formInput} ${errors.dni ? styles.error : ''}`}
          value={formData.dni}
          onChange={handleChange}
          disabled={submitting}
        />
        {errors.dni && (
          <div className={styles.errorMessage}>{errors.dni}</div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="email">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className={`${styles.formInput} ${errors.email ? styles.error : ''}`}
          value={formData.email}
          onChange={handleChange}
          disabled={submitting}
        />
        {errors.email && (
          <div className={styles.errorMessage}>{errors.email}</div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Clientes Asociados *
        </label>
        <div className={styles.clientesList}>
          {clientes.length === 0 ? (
            <div className={styles.noUsers}>No hay clientes disponibles</div>
          ) : (
            clientes.map((cliente) => (
              <div key={cliente.id} className={styles.clienteItem}>
                <input
                  type="checkbox"
                  id={`cliente-${cliente.id}`}
                  className={styles.clienteCheckbox}
                  checked={formData.clientesIds.includes(cliente.id)}
                  onChange={() => handleClienteToggle(cliente.id)}
                  disabled={submitting}
                />
                <label
                  htmlFor={`cliente-${cliente.id}`}
                  className={styles.clienteLabel}
                >
                  {cliente.nombre} - {cliente.cuit}
                </label>
              </div>
            ))
          )}
        </div>
        {errors.clientesIds && (
          <div className={styles.errorMessage}>{errors.clientesIds}</div>
        )}
      </div>

      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
          disabled={submitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={submitting}
        >
          {submitting ? 'Guardando...' : usuario ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
}
