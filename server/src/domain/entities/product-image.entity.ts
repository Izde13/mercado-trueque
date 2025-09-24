export class ProductImage {
  constructor(
    public readonly id: string,
    public productoId: string,
    public urlImagen: string,
    public orden?: number,
    public esPrincipal?: boolean,
  ) {}

  static create(
    productoId: string,
    urlImagen: string,
    orden?: number,
  ): ProductImage {
    const id = crypto.randomUUID();
    return new ProductImage(id, productoId, urlImagen, orden, false);
  }

  update(urlImagen?: string, orden?: number, esPrincipal?: boolean): void {
    if (urlImagen) this.urlImagen = urlImagen;
    if (orden !== undefined) this.orden = orden;
    if (esPrincipal !== undefined) this.esPrincipal = esPrincipal;
  }

  setAsPrincipal(): void {
    this.esPrincipal = true;
  }

  unsetAsPrincipal(): void {
    this.esPrincipal = false;
  }
}
