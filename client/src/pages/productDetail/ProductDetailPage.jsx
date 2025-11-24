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

  // Generar 3 imágenes: si tiene mainImage válida, repetirla; sino usar imágenes por defecto locales
  const generateImages = () => {
    // Validar que la imagen principal sea una URL real (no example.com ni placeholders)
    const isValidImage = product.mainImage &&
                        !product.mainImage.includes('example.com') &&
                        !product.mainImage.includes('placeholder');

    if (isValidImage) {
      // Si tiene imagen principal válida, repetirla 3 veces
      return [
        product.mainImage,
        product.mainImage,
        product.mainImage
      ];
    }

    // Si no tiene imagen o es inválida, usar 3 imágenes por defecto locales
    return [
      '/images/products/laptop.png',
      '/images/products/headphones.png',
      '/images/products/camera.png'
    ];
  };

  const images = generateImages();

  return (
    <section className="pdp">
      <div className="pdp-grid">
        <Gallery images={images} />

        <ProductSummary
          id={product.id}
          title={product.title || 'Sin título'}
          popularity={product.popularity || 0}
          estimatedValue={product.estimatedValue || 0}
          description={product.description || 'Sin descripción disponible'}
          mainImage={product.mainImage}
        />
      </div>
    </section>
  );
}
