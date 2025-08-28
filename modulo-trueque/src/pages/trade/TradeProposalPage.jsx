import "./TradeProposalPage.css";

import InterestProductCard from "./../../features/trade/InterestProductCard/InterestProductCard.jsx";
import ProposalsList from "./../../features/trade/ProposalItem/ProposalItem.jsx";
import SummaryBox from "./../../features/trade/SummaryBox/SummaryBox.jsx";

export default function TradeProposalPage(){
  // mocks: en real vendrán del producto que el user quiere y su inventario
  const interest = { title: "Gradient Graphic T-shirt", price: "$145", size: "Large", color: "White", img: "/images/products/t1.png" };
  const myItems = [
    { id:"p1", title: "Gradient Graphic T-shirt", price:"$145", size:"Large", color:"White", img:"/images/products/t1.png", checked: true },
    { id:"p2", title: "Gradient Graphic T-shirt", price:"$145", size:"Large", color:"White", img:"/images/products/t1.png", checked: false },
  ];

  return (
    <section className="trade-wrap">
      <nav className="trade-bc">Inicio / <span>Propuesta</span></nav>

      <h1 className="trade-title">Tus propuesta de trueque</h1>

      <div className="trade-grid">
        <div className="trade-col">
          <InterestProductCard product={interest} />

          <ProposalsList items={myItems} />
        </div>

        <aside className="trade-aside">
          <SummaryBox
            interest={interest}
            selected={myItems.filter(i=>i.checked)}
            onSubmit={()=>{}}
          />
        </aside>
      </div>
    </section>
  );
}
