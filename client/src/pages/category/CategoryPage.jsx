import "./CategoryPage.css";
import ProductsGrid from "./../../features/productList/ProductGrid/ProductGrid.jsx";
import Pagination from "./../../features/category/Pagination/Pagination.jsx";
import CategoryHeader from "./../../features/category/header/CategoryHeader.jsx";
import FiltersPanel from "./../../features/filters/FiltersPanel/FiltersPanel.jsx";
import { useFilterState } from "./../../shared/hooks/useFilterState.js";
import { useProducts } from "./../../shared/hooks/useProducts.js";

export default function CategoryPage() {

  // Sistema de filtros integrado
  const {
    filters,
    setCategorias,
    setEstados,
    setPrecioMin,
    setPrecioMax,
    clearAllFilters,
    getApiFilters,
  } = useFilterState();

  // Obtener productos con filtros aplicados (usar formato API)
  const apiFilters = getApiFilters();
  const { products, loading, error } = useProducts(apiFilters);

  // Handler para cambio de rango de precio
  const handlePriceChange = (precioMin, precioMax) => {
    if (precioMin !== undefined) setPrecioMin(precioMin);
    if (precioMax !== undefined) setPrecioMax(precioMax);
  };

  // Handler para remover un filtro individual
  const handleRemoveFilter = (type, value) => {
    switch (type) {
      case 'categoria':
        setCategorias(filters.categorias.filter(c => c !== value));
        break;
      case 'estado':
        setEstados(filters.estados.filter(e => e !== value));
        break;
      case 'precioMin':
        setPrecioMin('');
        break;
      case 'precioMax':
        setPrecioMax('');
        break;
    }
  };

  // Handlers para los filtros
  const handleFilterChange = {
    categoria: setCategorias,
    estado: setEstados,
    precio: handlePriceChange,
  };

  // Paginación (por ahora simple, después se puede mejorar)
  const page = 1;
  const perPage = 12;
  const total = products.length;
  const from = products.length > 0 ? 1 : 0;
  const to = Math.min(perPage, total);
  const displayedProducts = products.slice(0, perPage);

  return (
    <section className="cat-wrap">
      <div className="cat-layout">
        <FiltersPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onRemoveFilter={handleRemoveFilter}
          onClearFilters={clearAllFilters}
        />

        <div className="cat-main">
          <p className="cat-breadcrumb">
            Inicio / <strong>Productos</strong>
          </p>

          <CategoryHeader
            title="Artículos para Trueque"
            from={from}
            to={to}
            total={total}
            sort="popular"
          />

          {loading && <p>Cargando productos...</p>}
          {error && <p className="error">Error: {error}</p>}
          {!loading && !error && (
            <>
              <ProductsGrid items={displayedProducts} />
              <Pagination page={page} totalPages={Math.ceil(total / perPage)} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
