'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { getPedidos, ESTADO_LABELS, ESTADO_COLORS } from '@/lib/pedidos-api';
import { obtenerClientes } from '@/lib/clientes-api';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filtros
  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');

  useEffect(() => {
    // Cargar clientes para el filtro
    const loadClientes = async () => {
      try {
        const data = await obtenerClientes();
        setClientes(data);
      } catch (error) {
        console.error('Error cargando clientes:', error);
      }
    };
    loadClientes();
    fetchPedidos();
  }, []);

  const fetchPedidos = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await getPedidos(filters);
      setPedidos(data);
    } catch (error) {
      console.error('Error fetching pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const filters = {};
    if (selectedCliente) filters.clienteId = selectedCliente;
    if (selectedEstado) filters.estado = selectedEstado;
    
    fetchPedidos(filters);
  };

  const handleClearFilters = () => {
    setSelectedCliente('');
    setSelectedEstado('');
    fetchPedidos();
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Gestión de Pedidos</h1>

        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <select
              value={selectedCliente}
              onChange={(e) => setSelectedCliente(e.target.value)}
            >
              <option value="">Todos los clientes</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>

            <select
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              {Object.entries(ESTADO_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            <button onClick={handleSearch} className={styles.btnSearch}>
              Buscar
            </button>
            <button onClick={handleClearFilters} className={styles.btnClear}>
              Limpiar
            </button>
          </div>

          <Link href="/pedidos/nuevo">
            <button className={styles.createButton}>+ Nuevo Pedido</button>
          </Link>
        </div>
      </div>

      {pedidos.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Nº Pedido</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Obra</th>
                <th>Monto Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(pedido => (
                <tr key={pedido.id}>
                  <td className={styles.numeroPedido}>{pedido.numeroPedido}</td>
                  <td>{formatDate(pedido.fechaPedido)}</td>
                  <td>{pedido.cliente?.nombre || 'N/A'}</td>
                  <td>{pedido.obra?.descripcion || 'N/A'}</td>
                  <td className={styles.currencyCell}>
                    {formatCurrency(pedido.montoTotal)}
                  </td>
                  <td>{getEstadoBadge(pedido.estado)}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <Link href={`/pedidos/${pedido.id}`}>
                        <button className={styles.btnView}>Ver Detalle</button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          {loading ? (
            <p>Cargando pedidos...</p>
          ) : (
            <p>No se encontraron pedidos. Crea uno nuevo.</p>
          )}
        </div>
      )}
    </div>
  );
}
