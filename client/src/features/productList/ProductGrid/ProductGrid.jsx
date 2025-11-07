import "./ProductGrid.css";
import ProductCard from './../../product/ProductCard/ProductCard'

export default function ProductsGrid({ items = [] }) {
  if (!items.length) return <p className="cat-empty">No hay resultados.</p>;

  return (
    <div className="grid-products">
      {items.map((p) => (
        <ProductCard 
          key={p.id} 
          id={String(p.id)}
          title={p.title}
          mainImage={p.mainImage}
          estimatedValue={p.estimatedValue}
          popularity={p.popularity}
          views={p.views}
        />
      ))}
    </div>
  );
}
