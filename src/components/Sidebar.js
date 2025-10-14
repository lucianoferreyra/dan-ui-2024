"use client";
import Link from 'next/link';

const Sidebar = () => {
    return (
      <aside>
        <div className="sidebar-header">
          <h3>Menu</h3>
        </div>
        <nav className="sidebar-nav">
          <Link href="/" className="sidebar-link">
            <span className="icon">🏠</span>
            <span>Inicio</span>
          </Link>
          <Link href="/clientes" className="sidebar-link">
            <span className="icon">👥</span>
            <span>Clientes</span>
          </Link>
          <Link href="/productos" className="sidebar-link">
            <span className="icon">📦</span>
            <span>Productos</span>
          </Link>
          <Link href="/pedidos" className="sidebar-link">
            <span className="icon">📋</span>
            <span>Pedidos</span>
          </Link>
        </nav>
        <style jsx>{`
          aside {
            width: 250px;
            min-height: calc(100vh - 73px);
            background: var(--bg-secondary);
            border-right: 1px solid var(--border-color);
            padding: 1.5rem 0;
            z-index: 500;
          }
          
          .sidebar-header {
            padding: 0 1.5rem 1rem 1.5rem;
            border-bottom: 1px solid var(--border-color);
          }
          
          .sidebar-header h3 {
            margin: 0;
            font-size: 1.25rem;
            color: var(--text-primary);
            font-weight: 600;
          }
          
          .sidebar-nav {
            display: flex;
            flex-direction: column;
            padding: 1rem;
            gap: 1rem;
          }
          
          .sidebar-link {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.875rem 1.5rem;
            color: var(--text-secondary);
            transition: var(--transition);
            border-left: 3px solid transparent;
            font-weight: 500;
          }
          
          .sidebar-link:hover {
            background-color: var(--bg-hover);
            color: var(--text-primary);
            border-left-color: var(--accent-primary);
          }
          
          .sidebar-link .icon {
            font-size: 1.25rem;
            width: 24px;
            text-align: center;
          }
          
          .sidebar-link:hover .icon {
            transform: scale(1.1);
            transition: var(--transition);
          }
        `}</style>
      </aside>
    );
  };
  
  export default Sidebar;
  