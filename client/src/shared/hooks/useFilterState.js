import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Hook personalizado para gestionar el estado de filtros
 * Sincroniza filtros con URL para persistencia
 */
export const useFilterState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Estado inicial desde URL o valores por defecto
  const [filters, setFilters] = useState(() => ({
    categorias: searchParams.getAll('categoria') || [],
    estados: searchParams.getAll('estado') || [],
    precioMin: searchParams.get('precioMin') || '',
    precioMax: searchParams.get('precioMax') || '',
  }));

  // Sincronizar filtros con URL cuando cambien
  useEffect(() => {
    const params = new URLSearchParams();

    // Agregar categorías
    filters.categorias.forEach(cat => params.append('categoria', cat));

    // Agregar estados
    filters.estados.forEach(estado => params.append('estado', estado));

    // Agregar precios
    if (filters.precioMin) params.set('precioMin', filters.precioMin);
    if (filters.precioMax) params.set('precioMax', filters.precioMax);

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Actualizar categorías
  const setCategorias = useCallback((categorias) => {
    setFilters(prev => ({
      ...prev,
      categorias: Array.isArray(categorias) ? categorias : [categorias],
    }));
  }, []);

  // Toggle individual de categoría
  const toggleCategoria = useCallback((categoria) => {
    setFilters(prev => ({
      ...prev,
      categorias: prev.categorias.includes(categoria)
        ? prev.categorias.filter(c => c !== categoria)
        : [...prev.categorias, categoria],
    }));
  }, []);

  // Actualizar estados
  const setEstados = useCallback((estados) => {
    setFilters(prev => ({
      ...prev,
      estados: Array.isArray(estados) ? estados : [estados],
    }));
  }, []);

  // Toggle individual de estado
  const toggleEstado = useCallback((estado) => {
    setFilters(prev => ({
      ...prev,
      estados: prev.estados.includes(estado)
        ? prev.estados.filter(e => e !== estado)
        : [...prev.estados, estado],
    }));
  }, []);

  // Actualizar precio mínimo
  const setPrecioMin = useCallback((precio) => {
    setFilters(prev => ({
      ...prev,
      precioMin: precio,
    }));
  }, []);

  // Actualizar precio máximo
  const setPrecioMax = useCallback((precio) => {
    setFilters(prev => ({
      ...prev,
      precioMax: precio,
    }));
  }, []);

  // Actualizar rango de precio completo
  const setPrecioRange = useCallback((precioMin, precioMax) => {
    setFilters(prev => ({
      ...prev,
      precioMin: precioMin !== undefined ? precioMin : prev.precioMin,
      precioMax: precioMax !== undefined ? precioMax : prev.precioMax,
    }));
  }, []);

  // Limpiar todos los filtros
  const clearAllFilters = useCallback(() => {
    setFilters({
      categorias: [],
      estados: [],
      precioMin: '',
      precioMax: '',
    });
  }, []);

  // Verificar si hay filtros activos
  const hasActiveFilters = useCallback(() => {
    return (
      filters.categorias.length > 0 ||
      filters.estados.length > 0 ||
      filters.precioMin !== '' ||
      filters.precioMax !== ''
    );
  }, [filters]);

  // Convertir filtros al formato de la API
  const getApiFilters = useCallback(() => {
    const apiFilters = {};

    if (filters.categorias.length > 0) {
      apiFilters.categoria = filters.categorias;
    }

    if (filters.estados.length > 0) {
      apiFilters.estado = filters.estados;
    }

    if (filters.precioMin) {
      apiFilters.precioMin = parseFloat(filters.precioMin);
    }

    if (filters.precioMax) {
      apiFilters.precioMax = parseFloat(filters.precioMax);
    }

    return apiFilters;
  }, [filters]);

  return {
    filters,
    setCategorias,
    toggleCategoria,
    setEstados,
    toggleEstado,
    setPrecioMin,
    setPrecioMax,
    setPrecioRange,
    clearAllFilters,
    hasActiveFilters,
    getApiFilters,
  };
};
