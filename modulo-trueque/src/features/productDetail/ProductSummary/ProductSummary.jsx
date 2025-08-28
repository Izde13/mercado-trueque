import "./ProductSummary.css";
import VariantsSelector from "../VariantsSelector/VariantsSelector.jsx";

export default function ProductSummary({ title, rating, estimated, description }) {
  return (
    <section className="ps">
      <h1 className="ps-title">{title}</h1>

      <div className="ps-rating">
        <Stars />
        <span className="ps-rating-text">{rating}</span>
      </div>

      <p className="ps-price">
        <span className="label">Valor estimado:</span> <strong>{estimated}</strong>
      </p>

      <p className="ps-desc">{description}</p>

      <hr className="ps-hr" />

      <VariantsSelector />

      <button type="button" className="ps-cta">Proponer trueque</button>
    </section>
  );
}

/* ——— Estrellas estáticas ——— */
function Stars(){
  return (
    <span className="stars" aria-hidden="true">
      <Star type="full" /><Star type="full" /><Star type="full" /><Star type="full" /><Star type="half" />
    </span>
  );
}
function Star({ type="full" }){
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
