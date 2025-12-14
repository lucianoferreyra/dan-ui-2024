import styles from "./page.module.css";

export default function UsuariosLayout({ children }) {
  return (
    <main className={styles.main}>
      {children}
    </main>
  );
}
