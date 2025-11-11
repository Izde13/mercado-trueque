import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserMenu.css";

export default function UserMenu() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handlePublishProduct = () => {
    navigate("/publicar");
    setIsOpen(false);
  };

  const handleMyAccount = () => {
    // Aquí puedes agregar la navegación a la página de cuenta
    console.log("Navegar a mi cuenta");
    setIsOpen(false);
  };

  const handleMyTrades = () => {
    navigate("/mis-intercambios");
    setIsOpen(false);
  };

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="mt-user-menu" ref={menuRef}>
      <button 
        className="mt-icon-btn" 
        aria-label="Cuenta"
        onClick={toggleMenu}
        aria-expanded={isOpen}
      >
        <svg className="mt-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path
            d="M4 20a8 8 0 0 1 16 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="mt-dropdown">
          <ul className="mt-dropdown-list">
            <li>
              <button
                className="mt-dropdown-item mt-dropdown-button"
                onClick={handleMyAccount}
              >
                <svg className="mt-dropdown-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20a8 8 0 0 1 16 0" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
                Mi cuenta
              </button>
            </li>
            <li>
              <button
                className="mt-dropdown-item mt-dropdown-button"
                onClick={handleMyTrades}
              >
                <svg className="mt-dropdown-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M10 13l-3-3m3 3l3 3m-3-3l3-3m-3 3l-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Mis intercambios
              </button>
            </li>
            <li>
              <button
                className="mt-dropdown-item mt-dropdown-button"
                onClick={handlePublishProduct}
              >
                <svg className="mt-dropdown-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                  <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" />
                  <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" />
                </svg>
                Publicar producto
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}