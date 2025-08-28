import "./ProposalsList.css";
import ProposalItem from "../ProposalItem/ProposalItem.jsx";

export default function ProposalsList({ items = [] }){
  return (
    <section className="pr-list">
      <h2 className="box-title">Tus propuestas</h2>
      <div className="pr-stack">
        {items.map(i => <ProposalItem key={i.id} item={i} />)}
      </div>
    </section>
  );
}
