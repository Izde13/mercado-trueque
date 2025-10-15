// Mock data para productos de trueque
// Estructura basada en la tabla 'productos' de la BD

export const newProducts = [
  {
    id: "101",
    userId: "u1",
    categoryId: "c1",
    title: "Laptop Lenovo ThinkPad",
    description: "Laptop profesional en excelente estado, ideal para trabajo y estudio. Incluye cargador original.",
    estimatedValue: 850,
    publicationDate: "2025-10-14",
    publicationStatus: "publicado",
    mainImage: "/images/products/laptop.png",
    views: 145,
    popularity: 4.5,
    productStatusId: "ep1"
  },
  {
    id: "102",
    userId: "u2",
    categoryId: "c2",
    title: "Cámara Canon EOS Rebel",
    description: "Cámara réflex digital profesional, incluye lente 18-55mm, batería extra y accesorios.",
    estimatedValue: 650,
    publicationDate: "2025-10-13",
    publicationStatus: "publicado",
    mainImage: "/images/products/camera.png",
    views: 98,
    popularity: 4.8,
    productStatusId: "ep1"
  },
  {
    id: "103",
    userId: "u3",
    categoryId: "c3",
    title: "Bicicleta de Montaña Trek",
    description: "Bicicleta de montaña profesional, marco de aluminio, suspensión delantera, poco uso.",
    estimatedValue: 450,
    publicationDate: "2025-10-12",
    publicationStatus: "publicado",
    mainImage: "/images/products/bike.png",
    views: 67,
    popularity: 4.3,
    productStatusId: "ep1"
  },
  {
    id: "104",
    userId: "u4",
    categoryId: "c4",
    title: "Nintendo Switch OLED",
    description: "Consola Nintendo Switch OLED en perfecto estado, incluye dos juegos y funda protectora.",
    estimatedValue: 320,
    publicationDate: "2025-10-11",
    publicationStatus: "publicado",
    mainImage: "/images/products/nintendo.png",
    views: 234,
    popularity: 4.9,
    productStatusId: "ep1"
  }
];

export const trendingProducts = [
  {
    id: "201",
    userId: "u5",
    categoryId: "c5",
    title: "iPhone 13 Pro 128GB",
    description: "iPhone 13 Pro color grafito, 128GB de almacenamiento, batería al 95%, excelente estado.",
    estimatedValue: 780,
    publicationDate: "2025-10-10",
    publicationStatus: "publicado",
    mainImage: "/images/products/iphone.png",
    views: 312,
    popularity: 4.7,
    productStatusId: "ep1"
  },
  {
    id: "202",
    userId: "u6",
    categoryId: "c6",
    title: "Audífonos Sony WH-1000XM4",
    description: "Audífonos inalámbricos premium con cancelación de ruido activa, color negro, estuche incluido.",
    estimatedValue: 280,
    publicationDate: "2025-10-09",
    publicationStatus: "publicado",
    mainImage: "/images/products/headphones.png",
    views: 189,
    popularity: 4.6,
    productStatusId: "ep1"
  },
  {
    id: "203",
    userId: "u7",
    categoryId: "c7",
    title: "PlayStation 5 Digital",
    description: "Consola PlayStation 5 Digital Edition, incluye un control DualSense y cables originales.",
    estimatedValue: 450,
    publicationDate: "2025-10-08",
    publicationStatus: "publicado",
    mainImage: "/images/products/ps5.png",
    views: 456,
    popularity: 4.9,
    productStatusId: "ep1"
  },
  {
    id: "204",
    userId: "u8",
    categoryId: "c8",
    title: "iPad Air 5ta Gen",
    description: "iPad Air quinta generación, 64GB, color azul cielo, Wi-Fi, incluye Apple Pencil compatible.",
    estimatedValue: 520,
    publicationDate: "2025-10-07",
    publicationStatus: "publicado",
    mainImage: "/images/products/ipad.png",
    views: 178,
    popularity: 4.5,
    productStatusId: "ep1"
  }
];

export const reviewsMock = [
  {
    id: "r1",
    userName: "Sarah M.",
    verified: true,
    rating: 5,
    comment: "¡El mejor sitio para hacer trueques! Cambié mi viejo teléfono por una bicicleta increíble. Todo el proceso fue muy seguro.",
    date: "2024-10-10"
  },
  {
    id: "r2",
    userName: "Alex K.",
    verified: true,
    rating: 5,
    comment: "Me encanta la calidad y el estilo de los productos. Pude cambiar artículos que ya no usaba por cosas que realmente necesitaba.",
    date: "2024-10-08"
  },
  {
    id: "r3",
    userName: "James L.",
    verified: true,
    rating: 5,
    comment: "Como alguien que siempre está buscando ofertas únicas, este sitio es una joya. La variedad y calidad de productos es excelente.",
    date: "2024-10-05"
  }
];
