import "./Gallery.css";

export default function Gallery({ images = [] }) {
  const list = images.length ? images : ["/images/placeholder.png"];

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
            <img src={src} alt={`Vista ${i + 1}`} />
          </label>
        ))}
      </div>

      <div className="gal-main">
        {list.map((src, i) => (
          <img key={i} data-i={i} src={src} alt="" />
        ))}
      </div>
    </section>
  );
}
