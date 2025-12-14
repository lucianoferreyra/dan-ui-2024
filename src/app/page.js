'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const { selectedUser, loading } = useUser();

  useEffect(() => {
    if (!loading && !selectedUser) {
      router.push('/usuarios');
    }
  }, [selectedUser, loading, router]);

  if (loading) {
    return (
      <main className={styles.main}>
        <div>Cargando...</div>
      </main>
    );
  }

  if (!selectedUser) {
    return null;
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>Sistema de Gestión de Pedidos - DAN</h1>
        <p className={styles.userInfo}>
          Usuario: <strong>{selectedUser.nombre} {selectedUser.apellido}</strong>
        </p>
        
        <div className={styles.menuGrid}>
          <Link href="/clientes" className={styles.menuCard}>
            <div className={styles.cardContent}>
              <span className={styles.icon}>👥</span>
              <h2>Clientes</h2>
              <p>Gestionar información de clientes</p>
            </div>
          </Link>

          <Link href="/obras" className={styles.menuCard}>
            <div className={styles.cardContent}>
              <span className={styles.icon}>🏗️</span>
              <h2>Obras</h2>
              <p>Administrar obras y proyectos</p>
            </div>
          </Link>

          <Link href="/productos" className={styles.menuCard}>
            <div className={styles.cardContent}>
              <span className={styles.icon}>📦</span>
              <h2>Productos</h2>
              <p>Catálogo y gestión de productos</p>
            </div>
          </Link>

          <Link href="/pedidos" className={styles.menuCard}>
            <div className={styles.cardContent}>
              <span className={styles.icon}>📋</span>
              <h2>Pedidos</h2>
              <p>Gestionar pedidos y órdenes</p>
            </div>
          </Link>
        </div>

        <button 
          className={styles.changeUserBtn}
          onClick={() => router.push('/usuarios')}
        >
          Cambiar Usuario
        </button>
      </div>
    </main>
  );
}
