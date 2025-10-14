"use client";
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav>
      <div className="nav-container">
        <div className="nav-brand">
          <h2>DAN</h2>
        </div>
        <div className="nav-links">
          <Link href="/clientes">Clientes</Link>
          <Link href="/productos">Productos</Link>
          <Link href="/pedidos">Pedidos</Link>
        </div>
      </div>
      <style jsx>{`
        nav {
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
          box-shadow: var(--shadow-md);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .nav-brand h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--accent-primary);
          letter-spacing: 0.5px;
        }
        
        .nav-links {
          display: flex;
          gap: 2rem;
        }
        
        .nav-links a {
          color: var(--text-secondary);
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: var(--border-radius);
          transition: var(--transition);
          position: relative;
        }
        
        .nav-links a:hover {
          color: var(--text-primary);
          background-color: var(--bg-hover);
        }
        
        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background-color: var(--accent-primary);
          transition: var(--transition);
          transform: translateX(-50%);
        }
        
        .nav-links a:hover::after {
          width: 80%;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
