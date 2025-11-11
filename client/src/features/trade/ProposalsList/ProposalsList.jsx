import "./ProposalsList.css";
import ProposalItem from "../ProposalItem/ProposalItem.jsx";

export default function ProposalsList({ items = [], onProductToggle }){
  const handleItemChange = (productId, checked) => {
    if (onProductToggle) {
      onProductToggle(productId);
    }
  };

  return (
    <section className="pr-list">
      <h2 className="box-title">Tus productos para ofrecer</h2>
      <div className="pr-stack">
        {items.length > 0 ? (
          items.map(i => (
            <ProposalItem
              key={i.id}
              item={i}
              onChange={handleItemChange}
            />
          ))
        ) : (
          <p className="pr-empty">No tienes productos disponibles. Publica algunos primero.</p>
        )}
      </div>
    </section>
  );
}
