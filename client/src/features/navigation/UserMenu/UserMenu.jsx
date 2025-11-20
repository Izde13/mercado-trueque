import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./UserMenu.css";

export default function UserMenu() {
  const { user, isAuth, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Cerrar menú cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  if (!isAuth) {
    return (
      <div className="user-menu-guest">
        <Link to="/login" className="user-menu-link">
          Inicia sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button
        className="user-menu-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menú de usuario"
      >
        <svg className="user-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            fill="currentColor"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="user-menu-header">
            <p className="user-name">
              {user?.nombre} {user?.apellido}
            </p>
            <p className="user-email">{user?.email}</p>
            {user?.rol && (
              <p className="user-role">
                <span className="role-badge">{user.rol}</span>
              </p>
            )}
          </div>

          <div className="user-menu-divider"></div>

          {/* Opciones solo para usuarios normales (no revisores) */}
          {user?.rol !== 'revisor' && (
            <>
              <Link
                to="/perfil"
                className="user-menu-item"
                onClick={() => setIsOpen(false)}
              >
                <svg className="menu-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                </svg>
                Mi Perfil
              </Link>

              <Link
                to="/mis-intercambios"
                className="user-menu-item"
                onClick={() => setIsOpen(false)}
              >
                <svg className="menu-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-0.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l0.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-0.9-2-2-2z" fill="currentColor"/>
                </svg>
                Mis Intercambios
              </Link>

              <Link
                to="/publicar"
                className="user-menu-item"
                onClick={() => setIsOpen(false)}
              >
                <svg className="menu-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17 13h-5v5h5v-5zM16 2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-1V2h-2z" fill="currentColor"/>
                </svg>
                Publicar Producto
              </Link>

              <Link
                to="/propuestas-recibidas"
                className="user-menu-item"
                onClick={() => setIsOpen(false)}
              >
                <svg className="menu-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7l-4-2zm4 18H5c-1.1 0-2-.9-2-2s.9-2 2-2h14v2c0 1.1.9 2 2 2zm0-4H5V7h10v12z" fill="currentColor"/>
                </svg>
                Propuestas Recibidas
              </Link>

              <div className="user-menu-divider"></div>
            </>
          )}

          {/* Panel de Revisor - Solo visible para revisores */}
          {user?.rol === 'revisor' && (
            <>
              <Link
                to="/revisor"
                className="user-menu-item reviewer-item"
                onClick={() => setIsOpen(false)}
              >
                <svg className="menu-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                </svg>
                Panel de Revisor
              </Link>

              <div className="user-menu-divider"></div>
            </>
          )}

          <button
            className="user-menu-item logout-item"
            onClick={handleLogout}
          >
            <svg className="menu-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
            </svg>
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}
