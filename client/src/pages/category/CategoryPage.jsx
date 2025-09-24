import { useParams } from "react-router-dom";
import "./CategoryPage.css";
import ProductsGrid from "./../../features/productList/ProductGrid/ProductGrid.jsx";
import Pagination from "./../../features/category/Pagination/Pagination.jsx";
import CategoryHeader from "./../../features/category/header/CategoryHeader.jsx";
import TechFilters from "./../../features/filters/TechFilters/TechFilters.jsx";

const LABELS = { tecnologia: "Tecnología" };

export default function CategoryPage() {
  const { slug } = useParams(); // ← aquí usas useParams
  const pretty = (s) =>
    s.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  const title = LABELS[slug] ?? (slug ? pretty(slug) : "Categoría");

  // mocks solo para estructura
  const page = 1,
    perPage = 9,
    total = 100;
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const items = Array.from({ length: perPage }, (_, i) => ({
    id: `${slug}-${i + 1}`,
  }));

  return (
    <section className="cat-wrap">
      <div className="cat-layout">
        <TechFilters />

        {/* 👉 contenedor del lado derecho */}
        <div className="cat-main">
          <p className="cat-breadcrumb">
            Categoría: <strong>{title}</strong>
          </p>

          <CategoryHeader
            title="Artículos para Trueque."
            from={from}
            to={to}
            total={total}
            sort="popular"
          />

          <ProductsGrid items={items} />
          <Pagination page={page} totalPages={Math.ceil(total / perPage)} />
        </div>
      </div>
    </section>
  );
}
