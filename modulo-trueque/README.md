# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# FOLDERS.md — Guía de estructura de carpetas (React JSX)

Este documento explica **qué va en cada carpeta** del proyecto *Mercado•Trueque*, alineado con las historias US-1 … US-13. No contiene código, solo lineamientos.


> Convenciones generales:  
> - Archivos `.css` locales acompañan a su componente.  
> - Tests unitarios `*.test.jsx` junto al componente o en `tests/`.  
> - Nombres en **PascalCase** para componentes y **kebab-case** para CSS.

---

## Nivel raíz

### `public/`
Activos **estáticos públicos** que sirve el navegador sin paso por el bundler:
- `favicon.ico`, `site.webmanifest`, `robots.txt`.
- Imágenes globales y logotipos (ej. `logo.svg`, placeholders, íconos de medios de pago).

### `src/`
Código fuente de la aplicación.

- `App.jsx`: composición general de layouts, rutas y límites de error.
- `main.jsx`: punto de entrada que monta `<App />`.

---

## `src/app/` – Infraestructura de la app

### `app/layouts/`
Layouts **de alto nivel**:
- `MainLayout.jsx`: cabecera (Navbar), pie (Footer), contenedor principal.
- `AuthLayout.jsx` (si aplica): layout alterno para auth.

### `app/providers/`
**Proveedores de contexto** y configuración global:
- `ThemeProvider.jsx`, `AnalyticsProvider.jsx`, `RouterProvider.jsx`.

### `app/routes/`
Definición y **mapeo de rutas** (sin lógica de página):
- `routes.jsx`: tabla de rutas (`/`, `/categoria/:slug`, `/articulo/:id`).
- `RouteGuards.jsx`: guards simples (si aplica).

---

## `src/pages/` – Páginas conectadas al router

### `pages/Home/` (US-6)
- `HomePage.jsx`: ensambla **Hero**, “Nuevos trueques” (ProductCard), “Tendencias”, **Reviews**, **AlertsSubscribe** y **Footer**.

### `pages/Category/` (US-13)
- `CategoryPage.jsx`: compone **Breadcrumb**, **FiltersPanel**, **ProductList** (header + grid + paginación), **AlertsSubscribe**, **Footer**.

### `pages/ProductDetail/` (US-10)
- `ProductDetailPage.jsx`: compone **Breadcrumb**, **ProductDetail** (galería + variantes + CTA), **ProductTabs**, **Recommendations**, **AlertsSubscribe**, **Footer**.

---

## `src/features/` – Módulos por dominio

### `navigation/Navbar/` (US-1)
- `Navbar.jsx`, `navbar.css`, `Navbar.test.jsx`.  
Barra de navegación (marca, categorías, búsqueda, íconos, sticky).

### `footer/Footer/` (US-2)
- `Footer.jsx`, `footer.css`, `Footer.test.jsx`.  
Secciones de enlaces, redes, pagos y franja legal.

### `subscribe/AlertsSubscribe/` (US-3)
- `AlertsSubscribe.jsx`, `alerts-subscribe.css`, `AlertsSubscribe.test.jsx`.  
Bloque de suscripción a alertas con input email y CTA.

### `breadcrumb/Breadcrumb/` (US-7)
- `Breadcrumb.jsx`, `breadcrumb.css`, `Breadcrumb.test.jsx`.  
Componente miga de pan accesible con JSON-LD opcional.

### `hero/HeroSection/`
- `HeroSection.jsx`, `hero-section.css`.  
Sección “propaganda/hero” con H1, copy, métricas y CTA.

---

### `product/` – Elementos reutilizables de producto

- `ProductCard/` (US-5): tarjeta con imagen, título, rating/estado y valor estimado (y descuento opcional).
- `Rating/`: visualización accesible de estrellas (lectura por screen reader).
- `Recommendations/`: carrusel/grid “También te podría gustar”.

Cada subcarpeta incluye `*.jsx`, `*.css`, `*.test.jsx` (si aplica) e `index.js`.

---

### `productDetail/` – Detalle del artículo (US-8)

- `Gallery/`: miniaturas + imagen principal; zoom/lightbox opcional; fallback.
- `VariantsSelector/`: chips/ swatches para **color, talla, etc.** con estados disponibles/no disponibles.
- `ProductSummary/`: título (H1), rating, **valor estimado**, descripción corta y **botón “Proponer trueque”**.

---

### `productTabs/` – Pestañas del detalle (US-9)

- `Tabs/`: infraestructura accesible (`TabList`, `Tab`, `TabPanel`).
- `ProposalsPanel/`: listado de **ReviewCard** con filtros/orden y “Leer más”.
- `QuestionsPanel/`: formulario para **preguntas** + lista Q&A.

---

### `reviews/ReviewCard/` (US-4)
- Tarjeta de **review/testimonio** con nombre, fecha (`<time>`), comentario y check de verificación opcional.

---

### `filters/` – Panel de filtros (US-11)

- `FiltersPanel/`: contenedor sidebar/drawer, acciones **Aplicar** y **Limpiar**.
- `SectionCategory/`: lista navegable de categorías.
- `SectionPriceRange/`: slider de rango con etiquetas monetarias.
- `SectionColor/`: swatches múltiples (con nombres accesibles).
- `SectionSize/`: chips de talla (disponible/deshabilitado).
- `SectionStyle/`: lista colapsable (Casual, Formal, …).

---

### `productList/` – Listado y paginación (US-12)

- `ProductListHeader/`: “Mostrando X–Y de N” + **Ordenar por**.
- `ProductGrid/`: grid de `ProductCard` paginado.
- `Pagination/`: controles **Anterior/Siguiente** + números (accesibles).

---

## `src/shared/` – Utilidades transversales

### `shared/ui/`
**Componentes atómicos** y de patrón (sin dominio):
- `Button`, `Input`, `Select`, `Chip`, `Badge`, `Icon`, `Modal`, `Drawer`, `Dropdown`, `Carousel`, `Tooltip`, `Skeleton`, `Toast`.

### `shared/hooks/`
**Custom hooks** reutilizables:
- `useFiltersState.js` (sincroniza filtros ↔ URL),  
- `usePagination.js`, `useFetch.js`, `useMediaQuery.js`.

### `shared/lib/`
**Helpers/formatters** puros:
- `formatCurrency.js`, `formatDate.js`, `classNames.js` (o `clsx` wrapper).

### `shared/constants/`
Constantes y configuraciones:
- `routes.js`, `colors.js`, `breakpoints.js`, `analytics.js`, `seo.js`.

### `shared/assets/`
Activos compartidos:
- `icons/` (SVGs: `star.svg`, `chevron-right.svg`, etc.)  
- `images/` (hero, empty states, placeholders).

---

## `src/services/` – Capa de datos

### `services/api/`
**Clientes HTTP** por recurso (fetch/axios):
- `httpClient.js` (base), `productsApi.js`, `proposalsApi.js`, `questionsApi.js`, `subscriptionsApi.js`, `categoriesApi.js`.

### `services/repositories/`
**Orquestación de casos de uso** (combina endpoints, pagina, mapea respuestas):
- `productsRepository.js`, `proposalsRepository.js`, `questionsRepository.js`, `subscriptionsRepository.js`.

### `services/adapters/`
**Adaptadores DTO → modelos UI**:
- `productAdapter.js`, `reviewAdapter.js` (normalización de campos y defaults).

---

## `src/store/`
**Estado global** opcional (Context/Zustand/Redux):
- `uiStore.js` (flags UI, drawer filtros, toasts),  
- `cartStore.js` (si se usa carrito para trueques o listas deseadas).

---

## `src/styles/`
**Estilos globales** y temas:
- `reset.css`, `variables.css` (espaciado 8pt, colores), `theme.css` (claro/oscuro), `globals.css`.

---

## `src/mocks/`
**Datos de desarrollo** (JSON) para primeras entregas y pruebas:
- `products.json`, `product-detail.json`, `reviews.json`, `proposals.json`, `questions.json`, `categories.json`.

---

## `src/tests/`
**Pruebas de páginas e integración**:
- `pages/` (render de Home/Category/ProductDetail).  
- `integration/` (filtros→resultados, navegación de pestañas, accesibilidad básica).

---

## Checklist rápida DoD por carpeta

- **features/\*/**: componente principal, estilos locales, `index.js`, test mínimo, accesibilidad (labels/roles).
- **pages/\*/**: ensambla solo **componentes**, sin lógica de datos compleja.
- **services/**: separación **api ↔ repository ↔ adapter**; sin JSX.
- **shared/**: reutilizable, **sin referencias** a dominios concretos.
- **mocks/**: datos coherentes con las props reales (id, título, precio, rating, variantes).
- **styles/**: variables y tokens de diseño centralizados.

---

