import { useParams } from "react-router-dom";
import "./ProductDetailPage.css";

import Gallery from './../../features/productDetail/Gallery/Gallery.jsx'
import ProductSummary from './../../features/productDetail/ProductSummary/ProductSummary.jsx'
import { useProductDetail } from '../../shared/hooks/useProductDetail';

export default function ProductDetailPage() {
  const { id } = useParams();

  // Obtener producto real desde API usando el hook
  const { product, loading, error } = useProductDetail(id);

  // Mostrar loading mientras se carga el producto
  if (loading) {
    return (
      <section className="pdp">
        <p>Cargando producto...</p>
      </section>
    );
  }

  // Mostrar error si falla la carga
  if (error) {
    return (
      <section className="pdp">
        <p>Error al cargar el producto: {error}</p>
      </section>
    );
  }

  // Mostrar mensaje si no existe el producto
  if (!product) {
    return (
      <section className="pdp">
        <p>Producto no encontrado</p>
      </section>
    );
  }

  const images = [
    product.mainImage,
    "/images/products/headphones.png",
    "/images/products/iphone.png",
  ];

  return (
    <section className="pdp">
      <div className="pdp-grid">
        <Gallery images={images} />

        <ProductSummary
          id={product.id}
          title={product.title}
          popularity={product.popularity}
          estimatedValue={product.estimatedValue}
          description={product.description}
          mainImage={product.mainImage}
        />
      </div>
    </section>
  );
}
