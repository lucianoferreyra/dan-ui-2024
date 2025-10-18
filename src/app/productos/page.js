'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { buscarProductos } from "@/lib/productos-api";
import styles from './page.module.css';

export default function Productos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const lista = await buscarProductos('abc');
      console.log(lista);
    };
    fetchData();
  }, []);

  const handleSearch = async () => {
    const lista = await buscarProductos(searchTerm);
    console.log(lista);
    // Simulate a search by filtering some dummy data
    const dummyData = [
      { id: 1, name: 'Product 1' },
      { id: 2, name: 'Product 2' },
    ];
    setResults(dummyData.filter(product => product.name.includes(searchTerm) || product.id.toString() === searchTerm));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Productos</h1>

        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Buscar por número o nombre de producto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Buscar</button>
          <Link href="/productos/new">
            <button className={styles.createButton}>+ Crear nuevo producto</button>
          </Link>
        </div>
      </div>

      {results.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {results.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>
                    <Link href={`/productos/${product.id}`}>
                      <button style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                        Ver detalles
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No hay productos para mostrar. Realiza una búsqueda o crea uno nuevo.</p>
        </div>
      )}
    </div>
  );
};
