/**
 * Contexto completo para validar la publicación de un producto
 * Contiene toda la información necesaria para las reglas de negocio
 */
export interface ProductPublicationContext {
  // Datos del producto a publicar
  product: {
    titulo: string;
    descripcion: string;
    categoriaId: string;
    estadoProductoId: string;
    valorEstimado: number;
    imagenes: Array<{
      url: string;
      orden: number;
      esPrincipal: boolean;
    }>;
  };

  // Datos del usuario que publica
  user: {
    id: string;
    email: string;
    estado: string;
    calificacionPromedio: number;
    totalIntercambios: number;
    fechaRegistro: Date;
  };

  // Información adicional del contexto
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    timestamp?: Date;
  };
}
