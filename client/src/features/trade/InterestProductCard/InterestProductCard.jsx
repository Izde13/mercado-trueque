import "./InterestProductCard.css";

export default function InterestProductCard({ product }){
  const { 
    title, 
    estimatedValue, 
    mainImage,
    description
  } = product || {};

  return (
    <section className="ipcard">
      <h2 className="box-title">Producto de interés</h2>
      <div className="ip-body">
        <img className="ip-img" src={mainImage} alt={title} />
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
