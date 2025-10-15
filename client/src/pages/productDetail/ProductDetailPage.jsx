import { useParams } from "react-router-dom";
import "./ProductDetailPage.css";

import Gallery from './../../features/productDetail/Gallery/Gallery.jsx'
import ProductSummary from './../../features/productDetail/ProductSummary/ProductSummary.jsx'

export default function ProductDetailPage() {
  const { id } = useParams();

  // TODO: Obtener producto real desde API usando el id
  // Estructura de BD mock
  const product = {
    id,
    title: "One Life Graphic Camiseta",
    description: "Camiseta gráfica en perfecto estado. Busco intercambiar por jeans, chaqueta o accesorios deportivos.",
    estimatedValue: 260,
    popularity: 4.5,
    mainImage: "/images/products/ps5.png",
    views: 125,
    userId: "u1",
    categoryId: "c1",
    publicationDate: "2025-10-14",
    publicationStatus: "publicado",
    productStatusId: "ep1"
  };

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
        />
      </div>
    </section>
  );
}
