import "./InterestProductCard.css";

const PLACEHOLDER_IMAGE = "/images/products/laptop.png";

export default function InterestProductCard({ product }){
  const {
    title,
    estimatedValue,
    mainImage,
    description
  } = product || {};

  // Usar placeholder si mainImage es null o undefined
  const imageUrl = mainImage || PLACEHOLDER_IMAGE;

  return (
    <section className="ipcard">
      <h2 className="box-title">Producto de interés</h2>
      <div className="ip-body">
        <img
          className="ip-img"
          src={imageUrl}
          alt={title || "Producto"}
          onError={(event) => {
            const img = event.currentTarget;
            if (img.dataset.fallbackApplied === "true") {
              return;
            }
            img.dataset.fallbackApplied = "true";
            img.src = PLACEHOLDER_IMAGE;
          }}
        />
        <div className="ip-info">
          <h3 className="ip-title">{title}</h3>
          {description && (
            <p className="ip-desc">{description}</p>
          )}
          <div className="ip-price">${estimatedValue}</div>
        </div>
      </div>
    </section>
  );
}
