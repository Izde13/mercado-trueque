import "./ProposalItem.css";

export default function ProposalItem({ item, onChange }){
  const {
    id,
    title,
    estimatedValue,
    mainImage,
    description,
    checked
  } = item || {};

  const handleChange = (e) => {
    if (onChange) {
      onChange(id, e.target.checked);
    }
  };

  return (
    <label htmlFor={`chk-${id}`} className="pr-item">
      <img className="pr-img" src={mainImage} alt={title} />
      <div className="pr-info">
        <h4 className="pr-title">{title}</h4>
        {description && (
          <p className="pr-desc">{description}</p>
        )}
        <div className="pr-price">${estimatedValue}</div>
      </div>
      <input
        id={`chk-${id}`}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
      />
    </label>
  );
}
