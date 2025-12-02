'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { getPedidoById, updateEstadoPedido, ESTADO_LABELS, ESTADO_COLORS } from '@/lib/pedidos-api';
import ConfirmModal from '@/components/ConfirmModal';

export default function PedidoDetalle({ params }) {
  const router = useRouter();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [accionEstado, setAccionEstado] = useState(null);

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const data = await getPedidoById(params.id);
        setPedido(data);
      } catch (error) {
        console.error('Error cargando pedido:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedido();
  }, [params.id]);

  const handleEstadoChange = (nuevoEstado) => {
    setAccionEstado(nuevoEstado);
    setShowModal(true);
  };

  const confirmarCambioEstado = async () => {
    try {
      const pedidoActualizado = await updateEstadoPedido(params.id, accionEstado);
      setPedido(pedidoActualizado);
      setShowModal(false);
      setAccionEstado(null);
    } catch (error) {
      console.error('Error actualizando estado:', error);
      alert('Error al actualizar el estado del pedido');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getEstadoBadge = (estado) => {
    return (
      <span
        className={styles.estadoBadge}
        style={{ backgroundColor: ESTADO_COLORS[estado] }}
      >
        {ESTADO_LABELS[estado]}
      </span>
    );
  };

  const puedeActualizarEstado = (estadoActual) => {
    // Solo se puede actualizar a ENTREGADO o CANCELADO según la lógica de negocio
    const estadosNoModificables = ['ENTREGADO', 'CANCELADO'];
    return !estadosNoModificables.includes(estadoActual);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Cargando pedido...</p>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className={styles.container}>
        <p>Pedido no encontrado</p>
        <Link href="/pedidos">
          <button className={styles.btnBack}>Volver a Pedidos</button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Pedido {pedido.numeroPedido}</h1>
          <p className={styles.subtitle}>Detalles del pedido</p>
        </div>
        <Link href="/pedidos">
          <button className={styles.btnBack}>Volver</button>
        </Link>
      </div>

      <div className={styles.contentGrid}>
        {/* Información general */}
        <div className={styles.card}>
          <h2>Información General</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Número de Pedido:</span>
              <span className={styles.value}>{pedido.numeroPedido}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Fecha:</span>
              <span className={styles.value}>{formatDate(pedido.fechaPedido)}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Estado:</span>
              <span className={styles.value}>{getEstadoBadge(pedido.estado)}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Monto Total:</span>
              <span className={`${styles.value} ${styles.montoTotal}`}>
                {formatCurrency(pedido.montoTotal)}
              </span>
            </div>
          </div>

          {pedido.observaciones && (
            <div className={styles.observaciones}>
              <span className={styles.label}>Observaciones:</span>
              <p>{pedido.observaciones}</p>
            </div>
          )}
        </div>

        {/* Información del cliente */}
        <div className={styles.card}>
          <h2>Cliente</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Nombre:</span>
              <span className={styles.value}>{pedido.cliente?.nombre || 'N/A'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{pedido.cliente?.correoElectronico || 'N/A'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>CUIT:</span>
              <span className={styles.value}>{pedido.cliente?.cuit || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Información de la obra */}
        <div className={styles.card}>
          <h2>Obra</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Descripción:</span>
              <span className={styles.value}>{pedido.obra?.descripcion || 'N/A'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Dirección:</span>
              <span className={styles.value}>{pedido.obra?.direccion || 'N/A'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Estado:</span>
              <span className={styles.value}>{pedido.obra?.estado || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detalle de productos */}
      <div className={styles.card}>
        <h2>Detalle de Productos</h2>
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Código</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {pedido.detalles && pedido.detalles.length > 0 ? (
                pedido.detalles.map((detalle, index) => (
                  <tr key={detalle.id || index}>
                    <td>{detalle.producto?.nombre || 'N/A'}</td>
                    <td className={styles.codigoCell}>{detalle.producto?.codigo || 'N/A'}</td>
                    <td className={styles.centerCell}>{detalle.cantidad}</td>
                    <td className={styles.currencyCell}>{formatCurrency(detalle.precioUnitario)}</td>
                    <td className={styles.currencyCell}>{formatCurrency(detalle.montoLinea)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={styles.noData}>No hay detalles disponibles</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" className={styles.totalLabel}>Total:</td>
                <td className={styles.totalAmount}>{formatCurrency(pedido.montoTotal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Acciones de actualización de estado */}
      {puedeActualizarEstado(pedido.estado) && (
        <div className={styles.card} style={{ marginTop: '1.5rem' }}>
          <h2>Actualizar Estado</h2>
          <p className={styles.estadoInfo}>
            Estado actual: {getEstadoBadge(pedido.estado)}
          </p>
          <div className={styles.actionButtons}>
            <button
              className={styles.btnEntregado}
              onClick={() => handleEstadoChange('ENTREGADO')}
            >
              Marcar como Entregado
            </button>
            <button
              className={styles.btnCancelado}
              onClick={() => handleEstadoChange('CANCELADO')}
            >
              Cancelar Pedido
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={showModal}
        title={`Actualizar Estado a ${ESTADO_LABELS[accionEstado]}`}
        message={`¿Estás seguro que deseas cambiar el estado del pedido ${pedido.numeroPedido} a ${ESTADO_LABELS[accionEstado]}?`}
        warningText={accionEstado === 'CANCELADO' ? 'Esta acción devolverá el stock de los productos.' : null}
        onConfirm={confirmarCambioEstado}
        onCancel={() => {
          setShowModal(false);
          setAccionEstado(null);
        }}
        confirmText="Confirmar"
        cancelText="Cancelar"
        isDanger={accionEstado === 'CANCELADO'}
      />
    </div>
  );
}
