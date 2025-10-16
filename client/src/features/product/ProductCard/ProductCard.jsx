import "./ProductCard.css";
import { Link } from "react-router-dom";

const PLACEHOLDER_IMAGE = "/images/products/laptop.png";

function resolveImagePath(imagePath) {
  if (!imagePath) {
    return PLACEHOLDER_IMAGE;
  }

  const hasProtocol = /^(?:https?:)?\/\//i.test(imagePath);
  if (hasProtocol || imagePath.startsWith("data:")) {
    return imagePath;
  }

  return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
}

export default function ProductCard({
  id = "123",
  title = "T-shirt with Tape Details",
  mainImage = PLACEHOLDER_IMAGE,
  estimatedValue = 212,
  popularity = 4.0,
  views = 0,
}) {
  // Asegurar que popularity esté entre 0 y 5
  const validPopularity = Math.max(0, Math.min(5, Number(popularity) || 0));

  const fullStars = Math.floor(validPopularity);
  const hasHalfStar = validPopularity % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const resolvedImage = resolveImagePath(mainImage);

  return (
    <article className="pcard" aria-label="Producto">
      <Link
        to={`/producto/${id}`}
        className="pcard-link"
        aria-label={`Ver ${title}`}
      />

      <a href="#" className="pcard-media" aria-label="Ver producto">
        <img
          src={resolvedImage}
          alt={title}
          onError={(event) => {
            const img = event.currentTarget;
            if (img.dataset.fallbackApplied === "true") {
              return;
            }
            img.dataset.fallbackApplied = "true";
            img.src = PLACEHOLDER_IMAGE;
          }}
        />
        <div className="pcard-ph" aria-hidden="true" />
      </a>

      <h3 className="pcard-title">{title}</h3>

      <div className="pcard-rating" aria-label={`Calificación ${validPopularity} de 5`}>
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
          {validPopularity.toFixed(1)}/5
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
