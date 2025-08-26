import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-footer" role="contentinfo">
      <div className="mt-footer-inner">
        {/* Bloque superior */}
        <div className="mt-footer-grid">
          {/* Columna marca */}
          <div className="mt-foot-brand">
            <a href="#" className="mt-foot-logo" aria-label="Mercado Trueque">
              <span className="word">Mercado</span>
              <span className="dot" aria-hidden>
                •
              </span>
              <span className="word">Trueque</span>
            </a>
            <p className="mt-foot-desc">
              Intercambia artículos de forma segura y sin comisiones. <br />
              Conecta con personas cercanas y encuentra lo que necesitas.
            </p>

            <div className="mt-social">
              <a href="#" aria-label="Twitter/X" className="mt-social-btn">
                <svg viewBox="0 0 24 24" className="ic" aria-hidden="true">
                  <path
                    d="M4 4l16 16M20 4L4 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="mt-social-btn">
                <svg viewBox="0 0 24 24" className="ic" aria-hidden="true">
                  <path
                    d="M15 3h-3a5 5 0 00-5 5v3H4v4h3v7h4v-7h3.5l.5-4H11V8a1 1 0 011-1h3V3z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="mt-social-btn">
                <svg viewBox="0 0 24 24" className="ic" aria-hidden="true">
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    ry="5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="17.5" cy="6.5" r="1.2" />
                </svg>
              </a>
              <a href="#" aria-label="GitHub" className="mt-social-btn">
                <svg viewBox="0 0 24 24" className="ic" aria-hidden="true">
                  <path d="M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-1.9c-3 .7-3.6-1.3-3.6-1.3-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.6 1.1 1.6 1.1 1 .1.9-1 .9-1 .1-.7.5-1 .8-1.3-2.4-.3-4.9-1.2-4.9-5.4 0-1.2.4-2.2 1.1-3.1-.1-.3-.5-1.5.1-3.1 0 0 .9-.3 3 .1a10.5 10.5 0 015.4 0c2.1-.4 3-.1 3-.1.6 1.6.2 2.8.1 3.1.7.9 1.1 1.9 1.1 3.1 0 4.2-2.5 5.1-4.9 5.4.5.4.9 1.1.9 2.2v3.2c0 .3.2.6.7.5A10 10 0 0012 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Columnas de enlaces */}
          <nav className="mt-foot-col" aria-label="Plataforma">
            <h4 className="mt-foot-title">PLATAFORMA</h4>
            <ul className="mt-foot-links">
              <li>
                <a href="#">Cómo funciona</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Contacto</a>
              </li>
            </ul>
          </nav>

          <nav className="mt-foot-col" aria-label="Soporte">
            <h4 className="mt-foot-title">SOPORTE</h4>
            <ul className="mt-foot-links">
              <li>
                <a href="#">Política de seguridad</a>
              </li>
              <li>
                <a href="#">Preguntas frecuentes</a>
              </li>
              <li>
                <a href="#">Términos y condiciones</a>
              </li>
              <li>
                <a href="#">Política de privacidad</a>
              </li>
            </ul>
          </nav>

          <nav className="mt-foot-col" aria-label="Recursos">
            <h4 className="mt-foot-title">RECURSOS</h4>
            <ul className="mt-foot-links">
              <li>
                <a href="#">Reglas de trueque</a>
              </li>
              <li>
                <a href="#">Consejos de seguridad</a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Barra inferior */}
        <div
          className="mt-footer-bottom"
          role="navigation"
          aria-label="Créditos y métodos de pago"
        >
          <small className="mt-copy">
            trueque.co © 2000–{year}, Todos los derechos reservados
          </small>

          <ul className="mt-payments" aria-label="Métodos de pago">
            <li className="badge visa">VISA</li>
            <li className="badge mc">Mastercard</li>
            <li className="badge paypal">PayPal</li>
            <li className="badge apple"> Pay</li>
            <li className="badge gpay">G Pay</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
