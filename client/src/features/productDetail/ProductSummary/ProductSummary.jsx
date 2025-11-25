import "./ProductSummary.css";
import { useNavigate } from "react-router-dom";
import ProductCharacteristics from "../ProductCharacteristics/ProductCharacteristics.jsx";

export default function ProductSummary({
  id,
  title,
  popularity,
  estimatedValue,
  description,
  mainImage,
  characteristics,
}) {
  const navigate = useNavigate();

  const handlePropose = () => {
    // Navegar a la página de propuesta con el ID del producto en la URL
    navigate(`/propuesta/${id}`);
  };

  // Normalizar popularity de 0-100 a 0-5 para el sistema de estrellas
  const normalizedRating = popularity != null
    ? Math.min(Math.max((popularity / 100) * 5, 0), 5)
    : 0;

  return (
    <section className="ps">
      <h1 className="ps-title">{title}</h1>

      <div className="ps-rating">
        <Stars rating={normalizedRating} />
        <span className="ps-rating-text">{normalizedRating.toFixed(1)}/5</span>
      </div>

      <p className="ps-price">
        <span className="label">Valor estimado:</span>{" "}
        <strong>${estimatedValue?.toLocaleString('es-CL') || '0'}</strong>
      </p>

      <p className="ps-desc">{description}</p>

      <hr className="ps-hr" />

      <ProductCharacteristics characteristics={characteristics} />

      <button type="button" className="ps-cta" onClick={handlePropose}>
        Proponer trueque
      </button>
    </section>
  );
}

/* ——— Estrellas dinámicas ——— */
function Stars({ rating = 0 }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <span className="stars" aria-hidden="true">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} type="full" />
      ))}
      {hasHalfStar && <Star key="half" type="half" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} type="empty" />
      ))}
    </span>
  );
}

function Star({ type = "full" }) {
  return (
    <svg className={`star ${type}`} viewBox="0 0 24 24">
      <defs>
        <linearGradient id="halfGrad">
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path d="M12 2l2.84 6.16 6.82.56-5.14 4.45 1.6 6.83L12 16.9 5.88 20l1.6-6.83L2.34 8.72l6.82-.56L12 2z" />
    </svg>
  );
}
