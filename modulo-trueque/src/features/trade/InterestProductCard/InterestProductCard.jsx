import "./InterestProductCard.css";

export default function InterestProductCard({ product }){
  const { title, price, size, color, img } = product || {};
  return (
    <section className="ipcard">
      <h2 className="box-title">Producto de interés</h2>
      <div className="ip-body">
        <img className="ip-img" src={img} alt={title} />
        <div className="ip-info">
          <h3 className="ip-title">{title}</h3>
          <ul className="ip-attrs">
            <li><strong>Size:</strong> {size}</li>
            <li><strong>Color:</strong> {color}</li>
          </ul>
          <div className="ip-price">{price}</div>
        </div>
      </div>
    </section>
  );
}
