import { useParams } from "react-router-dom";
import "./ProductDetailPage.css";

import Gallery from './../../features/productDetail/Gallery/Gallery.jsx'
import ProductSummary from './../../features/productDetail/ProductSummary/ProductSummary.jsx'

export default function ProductDetailPage() {
  const { id } = useParams();                 // ← respetamos el parámetro

  // Mock de imágenes (cámbialas por las reales)
  const images = [
    "/images/products/shirt-1.png",
    "/images/products/shirt-2.png",
    "/images/products/shirt-3.png",
  ];

  // (Opcional) puedes usar el id para simular título/estimado
  const title = "One Life Graphic Camiseta";
  const estimated = "$260";

  return (
    <section className="pdp">
      <div className="pdp-grid">
        <Gallery images={images} />

        <ProductSummary
          id={id}                          // ← pasa el id si lo quieres mostrar
          title={title}
          rating="4.5/5"
          estimated={estimated}
          description="Camiseta gráfica en perfecto estado. Busco intercambiar por jeans, chaqueta o accesorios deportivos."
        />
      </div>
    </section>
  );
}
