import "./ProposalItem.css";

export default function ProposalItem({ item }){
  const { id, title, price, size, color, img, checked } = item || {};
  return (
    <label htmlFor={`chk-${id}`} className="pr-item">
      <img className="pr-img" src={img} alt={title} />
      <div className="pr-info">
        <h4 className="pr-title">{title}</h4>
        <ul className="pr-attrs">
          <li><strong>Size:</strong> {size}</li>
          <li><strong>Color:</strong> {color}</li>
        </ul>
        <div className="pr-price">{price}</div>
      </div>
      <input id={`chk-${id}`} type="checkbox" defaultChecked={checked} />
    </label>
  );
}
