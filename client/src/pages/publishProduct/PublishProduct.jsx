import React, { useState, useRef, useCallback, useMemo } from "react";
import UploadMedia from "../../features/uploadProduct/uploadMedia/UploadMedia";
import SuccessModal from "../../shared/components/SuccessModal";
import { FormField, SelectField, TextAreaField } from "../../shared/components/Form";
import { useCategories } from "../../shared/hooks/useCategories";
import { useEstadosProducto } from "../../shared/hooks/useEstadosProducto";
import { useCharacteristicsByCategory } from "../../shared/hooks/useCharacteristicsByCategory";
import { useCreateProduct } from "../../shared/hooks/useCreateProduct";
import { useForm } from "../../shared/hooks/useForm";
import { productValidationRules, validateProductImages } from "../../shared/utils/validationRules";
import CharacteristicsForm from "../../features/publishProduct/CharacteristicsForm/CharacteristicsForm";
import "./PublishProduct.css";
import "./PublishProductEnhancements.css";

// Constants
const INITIAL_FORM_VALUES = {
  categoriaId: "",
  estadoProductoId: "",
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
  handleCategoryChange,
  categories,
  categoriesLoading,
  categoriesError,
  estados,
  estadosLoading,
  estadosError,
  characteristics,
  characteristicsLoading,
  characteristicsError,
  characteristicValues,
  handleCharacteristicChange
}) => {
  // Transform categories for SelectField
  const categoryOptions = useMemo(() =>
    categories.map(cat => ({
      value: cat.id,
      label: cat.nombre
    })),
    [categories]
  );

  // Transform estados for SelectField
  const estadoOptions = useMemo(() =>
    estados.map(estado => ({
      value: estado.id,
      label: estado.nombre
    })),
    [estados]
  );

  return (
    <div className="pp-card">
      <h2 className="pp-card-title">Detalles del producto</h2>

      <SelectField
        id="categoriaId"
        label="Categoría"
        placeholder="Selecciona una categoría..."
        value={form.values.categoriaId}
        onChange={handleCategoryChange}
        onBlur={handleBlur('categoriaId')}
        error={errors.categoriaId || categoriesError}
        loading={categoriesLoading}
        options={categoryOptions}
        required
      />

      <SelectField
        id="estadoProductoId"
        label="Estado del producto"
        placeholder="Selecciona el estado..."
        value={form.values.estadoProductoId}
        onChange={handleChange('estadoProductoId')}
        onBlur={handleBlur('estadoProductoId')}
        error={errors.estadoProductoId || estadosError}
        loading={estadosLoading}
        options={estadoOptions}
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

      <CharacteristicsForm
        characteristics={characteristics}
        characteristicValues={characteristicValues}
        handleCharacteristicChange={handleCharacteristicChange}
        loading={characteristicsLoading}
        error={characteristicsError}
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
  // Local state first
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdProduct, setCreatedProduct] = useState(null);
  const [characteristicValues, setCharacteristicValues] = useState({});
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // Custom hooks for data and operations
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { estados, loading: estadosLoading, error: estadosError } = useEstadosProducto();
  const { characteristics, loading: characteristicsLoading, error: characteristicsError } = useCharacteristicsByCategory(selectedCategoryId);
  const { createProduct, loading: creatingProduct, error: createProductError, clearError } = useCreateProduct();

  // Form management with custom hook
  const form = useForm(INITIAL_FORM_VALUES, productValidationRules);

  // Refs
  const uploadMediaRef = useRef(null);

  // Handle image changes with validation
  const handleImagesChange = useCallback((newImages) => {
    setImages(newImages);
    const error = validateProductImages(newImages);
    setImageError(error || '');
  }, []);

  // Handle category change - load characteristics for selected category
  const handleCategoryChange = useCallback((e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);
    form.handleChange('categoriaId')(e);
    // Clear previous characteristic values
    setCharacteristicValues({});
  }, [form]);

  // Handle characteristic value changes
  const handleCharacteristicChange = useCallback((characteristicId) => {
    return (e) => {
      const value = e.target.value;
      setCharacteristicValues(prev => ({
        ...prev,
        [characteristicId]: value
      }));
    };
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
      // Enviar el formulario con las imágenes y características
      const result = await createProduct(form.values, images, characteristicValues);

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
      setCharacteristicValues({});
      setSelectedCategoryId('');
      uploadMediaRef.current?.clearFiles();

    } catch (error) {
      console.error("Error creating product:", error);
      // Error is handled by the useCreateProduct hook
    }
  }, [form, images, characteristicValues, createProduct, clearError]);

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
            handleCategoryChange={handleCategoryChange}
            categories={categories}
            categoriesLoading={categoriesLoading}
            categoriesError={categoriesError}
            estados={estados}
            estadosLoading={estadosLoading}
            estadosError={estadosError}
            characteristics={characteristics}
            characteristicsLoading={characteristicsLoading}
            characteristicsError={characteristicsError}
            characteristicValues={characteristicValues}
            handleCharacteristicChange={handleCharacteristicChange}
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