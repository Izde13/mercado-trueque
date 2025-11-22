import "./Gallery.css";

const FALLBACK_IMAGE = "/images/products/laptop.png";

export default function Gallery({ images = [] }) {
  const list = images.length ? images : [FALLBACK_IMAGE];

  const handleImageError = (event) => {
    const img = event.currentTarget;
    if (img.dataset.fallbackApplied === "true") {
      return;
    }
    img.dataset.fallbackApplied = "true";
    img.src = FALLBACK_IMAGE;
  };

  return (
    <section className="gal" aria-label="Galería del producto">
      {list.map((_, i) => (
        <input
          key={`r${i}`}
          type="radio"
          name="gal"
          id={`g${i}`}
          defaultChecked={i === 0}
          className="gal-ctrl"
        />
      ))}

      <div className="gal-thumbs">
        {list.map((src, i) => (
          <label key={i} className="thumb" htmlFor={`g${i}`}>
            <img
              src={src || FALLBACK_IMAGE}
              alt={`Vista ${i + 1}`}
              onError={handleImageError}
            />
          </label>
        ))}
      </div>

      <div className="gal-main">
        {list.map((src, i) => (
          <img
            key={i}
            data-i={i}
            src={src || FALLBACK_IMAGE}
            alt=""
            onError={handleImageError}
          />
        ))}
      </div>
    </section>
  );
}
