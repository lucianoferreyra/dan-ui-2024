"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

const Navbar = () => {
  const router = useRouter();
  const { selectedUser, clearUser } = useUser();

  const handleChangeUser = () => {
    router.push('/usuarios');
  };

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
        {selectedUser && (
          <div className="user-info">
            <span className="user-name">
              {selectedUser.nombre} {selectedUser.apellido}
            </span>
            <button className="change-user-btn" onClick={handleChangeUser}>
              Cambiar Usuario
            </button>
          </div>
        )}
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

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-name {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .change-user-btn {
          padding: 0.5rem 1rem;
          background-color: var(--accent-primary);
          color: white;
          border: none;
          border-radius: var(--border-radius);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
        }

        .change-user-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
