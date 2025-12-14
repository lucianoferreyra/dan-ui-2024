'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { createPedido } from '@/lib/pedidos-api';
import { obtenerClientes } from '@/lib/clientes-api';
import { obtenerObras } from '@/lib/obras-api';
import { buscarProductos } from '@/lib/productos-api';
import { useUser } from '@/contexts/UserContext';

export default function NuevoPedido() {
  const router = useRouter();
  const { selectedUser } = useUser();
  
  // Estados para los formularios
  const [clientes, setClientes] = useState([]);
  const [obras, setObras] = useState([]);
  const [obrasFiltradas, setObrasFiltradas] = useState([]);
  const [productos, setProductos] = useState([]);
  
  // Datos del pedido
  const [clienteId, setClienteId] = useState('');
  const [obraId, setObraId] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [detalles, setDetalles] = useState([]);
  
  // Estados para agregar productos
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  
  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientesData, obrasData, productosData] = await Promise.all([
          obtenerClientes(null, selectedUser?.id),
          obtenerObras(),
          buscarProductos()
        ]);
        setClientes(clientesData);
        setObras(obrasData);
        setProductos(productosData);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setError('Error al cargar los datos necesarios');
      }
    };
    loadData();
  }, [selectedUser]);

  // Filtrar obras cuando se selecciona un cliente
  useEffect(() => {
    if (clienteId) {
      const obrasFiltradas = obras.filter(obra => 
        obra.cliente?.id === parseInt(clienteId)
      );
      setObrasFiltradas(obrasFiltradas);
      setObraId(''); // Reset obra selection
    } else {
      setObrasFiltradas([]);
      setObraId('');
    }
  }, [clienteId, obras]);

  const handleAgregarProducto = () => {
    if (!productoSeleccionado || cantidad <= 0) {
      setError('Selecciona un producto y una cantidad válida');
      return;
    }

    const producto = productos.find(p => p.id === parseInt(productoSeleccionado));
    
    if (!producto) {
      setError('Producto no encontrado');
      return;
    }

    // Verificar si el producto ya está en la lista
    const existente = detalles.find(d => d.productoId === producto.id);
    
    if (existente) {
      setError('El producto ya está en la lista. Edita la cantidad en la tabla.');
      return;
    }

    const nuevoDetalle = {
      productoId: producto.id,
      productoNombre: producto.nombre,
      productoCodigo: producto.codigo,
      cantidad: parseInt(cantidad),
      precioUnitario: producto.precio,
      montoLinea: producto.precio * parseInt(cantidad)
    };

    setDetalles([...detalles, nuevoDetalle]);
    setProductoSeleccionado('');
    setCantidad(1);
    setError('');
  };

  const handleEliminarDetalle = (productoId) => {
    setDetalles(detalles.filter(d => d.productoId !== productoId));
  };

  const handleCantidadChange = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) return;
    
    setDetalles(detalles.map(d => {
      if (d.productoId === productoId) {
        return {
          ...d,
          cantidad: parseInt(nuevaCantidad),
          montoLinea: d.precioUnitario * parseInt(nuevaCantidad)
        };
      }
      return d;
    }));
  };

  const calcularMontoTotal = () => {
    return detalles.reduce((total, d) => total + d.montoLinea, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!clienteId) {
      setError('Selecciona un cliente');
      return;
    }

    if (!obraId) {
      setError('Selecciona una obra');
      return;
    }

    if (detalles.length === 0) {
      setError('Agrega al menos un producto al pedido');
      return;
    }

    setLoading(true);

    try {
      const pedidoData = {
        clienteId: parseInt(clienteId),
        obraId: parseInt(obraId),
        observaciones: observaciones.trim() || null,
        detalles: detalles.map(d => ({
          productoId: d.productoId,
          cantidad: d.cantidad
        }))
      };

      const pedidoCreado = await createPedido(pedidoData);
      router.push(`/pedidos/${pedidoCreado.id}`);
    } catch (error) {
      console.error('Error creando pedido:', error);
      setError(error.response?.data?.message || 'Error al crear el pedido. Verifica que el cliente tenga saldo disponible.');
    } finally {
      setLoading(false);
    }
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
        <div>
          <h1>Nuevo Pedido</h1>
          <p className={styles.subtitle}>Crear un nuevo pedido para un cliente</p>
        </div>
        <Link href="/pedidos">
          <button className={styles.btnCancel}>Cancelar</button>
        </Link>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Sección: Cliente y Obra */}
        <div className={styles.card}>
          <h2>Cliente y Obra</h2>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="cliente">
                Cliente <span className={styles.required}>*</span>
              </label>
              <select
                id="cliente"
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                required
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} - {cliente.cuit}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="obra">
                Obra <span className={styles.required}>*</span>
              </label>
              <select
                id="obra"
                value={obraId}
                onChange={(e) => setObraId(e.target.value)}
                required
                disabled={!clienteId}
              >
                <option value="">
                  {clienteId ? 'Seleccionar obra' : 'Primero selecciona un cliente'}
                </option>
                {obrasFiltradas.map(obra => (
                  <option key={obra.id} value={obra.id}>
                    {obra.descripcion} - {obra.direccion}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="observaciones">Observaciones</label>
            <textarea
              id="observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows="3"
              placeholder="Observaciones adicionales sobre el pedido"
            />
          </div>
        </div>

        {/* Sección: Agregar Productos */}
        <div className={styles.card}>
          <h2>Productos</h2>
          
          <div className={styles.addProductSection}>
            <div className={styles.addProductGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="producto">Producto</label>
                <select
                  id="producto"
                  value={productoSeleccionado}
                  onChange={(e) => setProductoSeleccionado(e.target.value)}
                >
                  <option value="">Seleccionar producto</option>
                  {productos.map(producto => (
                    <option key={producto.id} value={producto.id}>
                      {producto.codigo} - {producto.nombre} ({formatCurrency(producto.precio)})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="cantidad">Cantidad</label>
                <input
                  type="number"
                  id="cantidad"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  min="1"
                />
              </div>

              <div className={styles.formGroup}>
                <label>&nbsp;</label>
                <button
                  type="button"
                  onClick={handleAgregarProducto}
                  className={styles.btnAdd}
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>

          {/* Tabla de productos agregados */}
          {detalles.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.map((detalle) => (
                    <tr key={detalle.productoId}>
                      <td className={styles.codigoCell}>{detalle.productoCodigo}</td>
                      <td>{detalle.productoNombre}</td>
                      <td>
                        <input
                          type="number"
                          value={detalle.cantidad}
                          onChange={(e) => handleCantidadChange(detalle.productoId, e.target.value)}
                          min="1"
                          className={styles.cantidadInput}
                        />
                      </td>
                      <td className={styles.currencyCell}>
                        {formatCurrency(detalle.precioUnitario)}
                      </td>
                      <td className={styles.currencyCell}>
                        {formatCurrency(detalle.montoLinea)}
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleEliminarDetalle(detalle.productoId)}
                          className={styles.btnDelete}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className={styles.totalLabel}>Total:</td>
                    <td className={styles.totalAmount} colSpan="2">
                      {formatCurrency(calcularMontoTotal())}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className={styles.emptyProducts}>
              <p>No hay productos agregados. Selecciona productos para agregar al pedido.</p>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className={styles.formActions}>
          <Link href="/pedidos">
            <button type="button" className={styles.btnSecondary}>
              Cancelar
            </button>
          </Link>
          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={loading || detalles.length === 0}
          >
            {loading ? 'Creando pedido...' : 'Crear Pedido'}
          </button>
        </div>
      </form>
    </div>
  );
}
