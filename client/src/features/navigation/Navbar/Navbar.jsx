import { Link, useNavigate } from "react-router-dom";
import UserMenu from "../UserMenu/UserMenu";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="mt-navbar" role="banner">
      <nav className="mt-nav">
        {/* Izquierda: logo + menú */}
        <div className="mt-left">
          <Link to="/" className="mt-logo" aria-label="Mercado Trueque">
            <span className="mt-logo-word mt-logo-primary">Mercado</span>
            <span className="mt-logo-dot" aria-hidden="true">
              •
            </span>
            <span className="mt-logo-word">Trueque</span>
          </Link>

          <ul className="mt-menu" aria-label="Menú principal">
            <li>
              <Link to="/productos" className="mt-link">
                Ver Productos
              </Link>
            </li>
            <li>
              <a href="#" className="mt-link">
                Mis trueques
              </a>
            </li>
          </ul>
        </div>

        {/* Centro: buscador */}
        <form className="mt-search" role="search" aria-label="Buscar">
          <svg className="mt-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle
              cx="11"
              cy="11"
              r="7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M21 21l-4.3-4.3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="search"
            placeholder="Buscar artículos para trueque"
            aria-label="Buscar artículos para trueque"
          />
        </form>

        {/* Derecha: acciones */}
        <div className="mt-actions">
          <a href="#" className="mt-icon-btn" aria-label="Carrito">
            <svg className="mt-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M3 4h2l2.4 10.4A2 2 0 0 0 9.4 16h7.8a2 2 0 0 0 2-1.6L21 8H6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="10" cy="20" r="1.7" />
              <circle cx="18" cy="20" r="1.7" />
            </svg>
          </a>
          
          {/* Menú de usuario */}
          <UserMenu />
        </div>
      </nav>
    </header>
  );
}
