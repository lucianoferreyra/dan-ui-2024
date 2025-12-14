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
      <div>
      <h1>Gestion de Pedidos DAN</h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        Usuario: {selectedUser.nombre} {selectedUser.apellido}
      </p>
      <Link href="/clientes">
        <button className={styles.botones}>Go to Clientes</button>
      </Link>
      <Link href="/productos">
        <button className={styles.botones} >Go to Productos</button>
      </Link>
      <Link href="/pedidos">
        <button className={styles.botones}>Go to Pedidos</button>
      </Link>
      <button 
        className={styles.botones}
        onClick={() => router.push('/usuarios')}
        style={{ marginTop: '2rem', backgroundColor: '#666' }}
      >
        Cambiar Usuario
      </button>
      </div>
    </main>
  );
}
