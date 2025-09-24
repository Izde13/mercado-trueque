import "./AlertsSubscribe.css";

export default function AlertsSubscribe() {
  return (
    <section className="as-section" role="region" aria-labelledby="as-title">
      <div className="as-inner">
        {/* Texto */}
        <div className="as-copy">
          <h2 id="as-title">Recibe alertas de nuevos trueques</h2>
          <p>Te avisaremos cuando alguien quiera lo que ofreces.</p>
        </div>

        {/* Formulario (sin lógica) */}
        <form
          className="as-form"
          onSubmit={(e) => e.preventDefault()}
          noValidate
        >
          <label className="as-input">
            <svg
              className="as-ic"
              viewBox="0 0 24 24"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
            <input
              type="email"
              placeholder="Ingresa tu correo electrónico."
              aria-label="Correo electrónico"
            />
          </label>

          <button type="submit" className="as-btn">
            Suscribirme a alertas
          </button>
        </form>
      </div>
    </section>
  );
}
