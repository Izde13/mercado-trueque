import "./ProductCard.css";
import { Link } from "react-router-dom";

export default function ProductCard({
  id = "123",
  title = "T-shirt with Tape Details",
  mainImage = "/images/products/tshirt.png",
  estimatedValue = 212,
  popularity = 4.0,
  views = 0,
}) {
  const fullStars = Math.floor(popularity);
  const hasHalfStar = popularity % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <article className="pcard" aria-label="Producto">
      <Link
        to={`/producto/${id}`}
        className="pcard-link"
        aria-label={`Ver ${title}`}
      />

      <a href="#" className="pcard-media" aria-label="Ver producto">
        <img
          src={mainImage}
          alt={title}
          onError={(e) => (e.currentTarget.style.visibility = "hidden")}
        />
        <div className="pcard-ph" aria-hidden="true" />
      </a>

      <h3 className="pcard-title">{title}</h3>

      <div className="pcard-rating" aria-label={`Calificación ${popularity} de 5`}>
        <div className="stars" aria-hidden="true">
          {[...Array(fullStars)].map((_, i) => (
            <Star key={`full-${i}`} filled />
          ))}
          {hasHalfStar && <Star key="half" filled />}
          {[...Array(emptyStars)].map((_, i) => (
            <Star key={`empty-${i}`} />
          ))}
        </div>
        <span className="rating-text">
          {popularity.toFixed(1)}/5
          {views > 0 && ` (${views})`}
        </span>
      </div>

      <div className="pcard-price">
        <span className="price-now">${estimatedValue}</span>
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
