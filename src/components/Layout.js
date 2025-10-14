import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="container">
        <Sidebar />
        <main>{children}</main>
      </div>
      <style jsx>{`
        .app-wrapper {
          min-height: 100vh;
          background-color: var(--bg-primary);
        }
        
        .container {
          display: flex;
          min-height: calc(100vh - 73px);
        }
        
        main {
          flex: 1;
          padding: 2rem 3rem;
          background-color: var(--bg-primary);
          overflow-y: auto;
        }
        
        @media (max-width: 768px) {
          .container {
            flex-direction: column;
          }
          
          main {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
