import React, { useState, useRef, useCallback, useMemo } from "react";
import UploadMedia from "../../features/uploadProduct/uploadMedia/UploadMedia";
import SuccessModal from "../../shared/components/SuccessModal";
import { FormField, SelectField, TextAreaField } from "../../shared/components/Form";
import { useCategories } from "../../shared/hooks/useCategories";
import { useCreateProduct } from "../../shared/hooks/useCreateProduct";
import { useForm } from "../../shared/hooks/useForm";
import { productValidationRules, validateProductImages } from "../../shared/utils/validationRules";
import "./PublishProduct.css";
import "./PublishProductEnhancements.css";

// Constants
const INITIAL_FORM_VALUES = {
  categoriaId: "",
  titulo: "",
  valorEstimado: "",
  descripcion: "",
};

/**
 * Product Details Form - Separated component for better organization
 */
const ProductDetailsForm = React.memo(({
  form,
  errors,
  handleChange,
  handleBlur,
  categories,
  categoriesLoading,
  categoriesError
}) => {
  // Transform categories for SelectField
  const categoryOptions = useMemo(() =>
    categories.map(cat => ({
      value: cat.id,
      label: cat.nombre
    })),
    [categories]
  );

  return (
    <div className="pp-card">
      <h2 className="pp-card-title">Detalles del producto</h2>

      <SelectField
        id="categoriaId"
        label="Categoría"
        placeholder="Selecciona una categoría..."
        value={form.values.categoriaId}
        onChange={handleChange('categoriaId')}
        onBlur={handleBlur('categoriaId')}
        error={errors.categoriaId || categoriesError}
        loading={categoriesLoading}
        options={categoryOptions}
        required
      />

      <FormField
        id="titulo"
        label="Título del producto"
        type="text"
        placeholder="Ej. Bicicleta urbana en excelente estado"
        value={form.values.titulo}
        onChange={handleChange('titulo')}
        onBlur={handleBlur('titulo')}
        error={errors.titulo}
        maxLength={100}
        required
      />

      <FormField
        id="valorEstimado"
        label="Valor estimado"
        type="number"
        placeholder="Ej. 250000"
        value={form.values.valorEstimado}
        onChange={handleChange('valorEstimado')}
        onBlur={handleBlur('valorEstimado')}
        error={errors.valorEstimado}
        min="1000"
        step="1000"
        required
      />

      <TextAreaField
        id="descripcion"
        label="Descripción detallada"
        placeholder="Describe las características, estado, razón de intercambio, etc. Sé específico para atraer mejores ofertas."
        value={form.values.descripcion}
        onChange={handleChange('descripcion')}
        onBlur={handleBlur('descripcion')}
        error={errors.descripcion}
        rows={6}
        maxLength={500}
        showCharacterCount
        required
      />
    </div>
  );
});

ProductDetailsForm.displayName = 'ProductDetailsForm';

/**
 * Image Upload Section - Separated component
 */
const ImageUploadSection = React.memo(({
  uploadRef,
  onImagesChange,
  imageError
}) => (
  <div className="pp-card">
    <UploadMedia
      ref={uploadRef}
      title="Imágenes del producto"
      subtitle="Sube fotos claras y de buena calidad. La primera imagen será la principal."
      onChange={onImagesChange}
      accept="image/*"
      multiple={true}
      maxSizeMB={10}
    />
    {imageError && <p className="pp-error mt">{imageError}</p>}
  </div>
));

ImageUploadSection.displayName = 'ImageUploadSection';

/**
 * Main PublishProduct Component - Refactored with best practices
 */
const PublishProduct = () => {
  // Custom hooks for data and operations
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { createProduct, loading: creatingProduct, error: createProductError, clearError } = useCreateProduct();

  // Form management with custom hook
  const form = useForm(INITIAL_FORM_VALUES, productValidationRules);

  // Local state for images and modal
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdProduct, setCreatedProduct] = useState(null);

  // Refs
  const uploadMediaRef = useRef(null);

  // Handle image changes with validation
  const handleImagesChange = useCallback((newImages) => {
    setImages(newImages);
    const error = validateProductImages(newImages);
    setImageError(error || '');
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Validate form and images
    const isFormValid = form.validate();
    const imageValidationError = validateProductImages(images);

    if (imageValidationError) {
      setImageError(imageValidationError);
    }

    if (!isFormValid || imageValidationError) {
      return;
    }

    clearError(); // Clear previous API errors

    try {
      const result = await createProduct(form.values);

      // Show success modal with product data
      setCreatedProduct({
        ...result.data, // API response data
        titulo: form.values.titulo,
        valorEstimado: form.values.valorEstimado
      });
      setShowSuccessModal(true);

      // Reset form and images
      form.reset();
      setImages([]);
      setImageError('');
      uploadMediaRef.current?.clearFiles();

    } catch (error) {
      console.error("Error creating product:", error);
      // Error is handled by the useCreateProduct hook
    }
  }, [form, images, createProduct, clearError]);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setShowSuccessModal(false);
    setCreatedProduct(null);
  }, []);

  // Check if form can be submitted
  const canSubmit = useMemo(() =>
    !creatingProduct &&
    !categoriesLoading &&
    !form.hasErrors &&
    images.length > 0,
    [creatingProduct, categoriesLoading, form.hasErrors, images.length]
  );

  return (
    <main className="pp-wrap">
      {/* Breadcrumb */}
      <div className="pp-breadcrumb">
        Inicio <span>›</span> Publicar
      </div>

      <h1 className="pp-title">Publica tu producto</h1>

      <form className="pp-grid" onSubmit={handleSubmit} noValidate>
        {/* Left Column - Images */}
        <section className="pp-col">
          <ImageUploadSection
            uploadRef={uploadMediaRef}
            onImagesChange={handleImagesChange}
            imageError={imageError}
          />
        </section>

        {/* Right Column - Product Details */}
        <aside className="pp-col">
          <ProductDetailsForm
            form={form}
            errors={form.errors}
            handleChange={form.handleChange}
            handleBlur={form.handleBlur}
            categories={categories}
            categoriesLoading={categoriesLoading}
            categoriesError={categoriesError}
          />

          {/* API Error Display */}
          {createProductError && (
            <p className="pp-error" role="alert">
              {createProductError}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="pp-submit"
            disabled={!canSubmit}
            aria-describedby="submit-help"
          >
            {creatingProduct ? "Publicando…" : "Publicar producto"}
          </button>

          {!canSubmit && !creatingProduct && (
            <p id="submit-help" className="pp-help-text">
              Completa todos los campos obligatorios y adjunta al menos una imagen.
            </p>
          )}
        </aside>
      </form>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        title="¡Producto publicado exitosamente!"
        message="Tu producto ha sido creado y está disponible en el mercado de trueque."
        productData={createdProduct}
      />
    </main>
  );
};

export default PublishProduct;