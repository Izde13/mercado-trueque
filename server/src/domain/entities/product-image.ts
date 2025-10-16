export class ProductImage {
  constructor(
    public readonly id: string,
    public productoId: string,
    public urlImagen: string,
    public orden: number,
    public esPrincipal: boolean,
  ) {}

  static create(
    productoId: string,
    urlImagen: string,
    orden: number = 1,
    esPrincipal: boolean = false,
  ): ProductImage {
    const id = crypto.randomUUID();
    return new ProductImage(id, productoId, urlImagen, orden, esPrincipal);
  }
}
