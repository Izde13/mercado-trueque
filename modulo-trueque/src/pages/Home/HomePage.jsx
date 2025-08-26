import "./HomePage.css";
import ProductCard from "../../features/product/ProductCard/ProductCard";
import ReviewCard from "../../features/reviews/ReviewCard/ReviewCard";

export default function HomePage() {
  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <h1>Encuentra tu trueque ideal hoy mismo</h1>
            <p>Intercambia artículos de forma segura con personas cercanas.</p>

            <div className="hero-cta">
              <a className="btn-primary" href="#" role="button">Buscar trueques</a>
            </div>

            <ul className="hero-stats" aria-label="Estadísticas">
              <li><span className="stat-num">500+</span><span className="stat-label">Artículos disponibles</span></li>
              <li><span className="stat-num">300+</span><span className="stat-label">Usuarios activos</span></li>
              <li><span className="stat-num">1,200+</span><span className="stat-label">Trueques completados</span></li>
            </ul>
          </div>

          <div className="hero-media" aria-hidden="true">
            <img src="/images/hero/devices.png" alt="" />
            <span className="sparkle" />
          </div>
        </div>
      </section>

      {/* NUEVOS TRUEQUES */}
      <section className="hp-section">
        <div className="hp-header">
          <h2 className="hp-title">Nuevos trueques</h2>
        </div>
        <div className="hp-grid">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
        <div className="hp-actions">
          <button className="btn-ghost" type="button">Ver más</button>
        </div>
      </section>

      <hr className="hp-divider" />

      {/* TRUEQUES EN TENDENCIA */}
      <section className="hp-section">
        <div className="hp-header">
          <h2 className="hp-title">Trueques en tendencia</h2>
        </div>
        <div className="hp-grid">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
        <div className="hp-actions">
          <button className="btn-ghost" type="button">Ver más</button>
        </div>
      </section>

      <hr className="hp-divider" />

      {/* HISTORIAS / REVIEWS */}
      <section className="hp-section">
        <div className="hp-header">
          <h2 className="hp-title">Historias de trueque</h2>
          <div className="hp-nav" aria-hidden="true">
            <button className="nav-arrow" type="button" title="Anterior">‹</button>
            <button className="nav-arrow" type="button" title="Siguiente">›</button>
          </div>
        </div>

        <div className="hp-reviews">
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
        </div>
      </section>
    </div>
  );
}
