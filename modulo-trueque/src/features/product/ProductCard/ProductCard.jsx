import "./ProductCard.css";
import { Link } from "react-router-dom";

export default function ProductCard({
  id = "123",
  title = "T-shirt with Tape Details",
}) {
  return (
    <article className="pcard" aria-label="Producto">
      <Link
        to={`/producto/${id}`}
        className="pcard-link"
        aria-label={`Ver ${title}`}
      />

      {/* Imagen */}
      <a href="#" className="pcard-media" aria-label="Ver producto">
        <img
          src="/images/products/tshirt.png"
          alt="T-shirt with Tape Details"
          onError={(e) => (e.currentTarget.style.visibility = "hidden")}
        />
        {/* fallback visual si no hay imagen */}
        <div className="pcard-ph" aria-hidden="true" />
      </a>

      {/* Título */}
      <h3 className="pcard-title">T-shirt with Tape Details</h3>

      {/* Rating */}
      <div className="pcard-rating" aria-label="Calificación 4 de 5">
        <div className="stars" aria-hidden="true">
          <Star filled />
          <Star filled />
          <Star filled />
          <Star filled />
          <Star /> {/* vacía */}
        </div>
        <span className="rating-text">4.0/5</span>
      </div>

      {/* Precios */}
      <div className="pcard-price">
        <span className="price-now">$212</span>
        <span className="price-old">$242</span>
        <span className="price-off">-20%</span>
      </div>
    </article>
  );
}

/* ———— icono estrella ———— */
function Star({ filled }) {
  return (
    <svg className={`star ${filled ? "filled" : "empty"}`} viewBox="0 0 24 24">
      <path d="M12 2l2.84 6.16 6.82.56-5.14 4.45 1.6 6.83L12 16.9 5.88 20l1.6-6.83L2.34 8.72l6.82-.56L12 2z" />
    </svg>
  );
}
