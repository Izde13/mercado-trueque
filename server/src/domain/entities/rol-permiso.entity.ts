export class RolPermiso {
  constructor(
    public readonly id: string,
    public readonly rolId: string,
    public readonly permisoId: string,
    public readonly creadoEn?: Date,
  ) {
    this.validarIds(rolId, permisoId);
  }

  private validarIds(rolId: string, permisoId: string): void {
    if (!rolId || !permisoId) {
      throw new Error('rolId y permisoId son requeridos');
    }
  }

  static create(
    rolId: string,
    permisoId: string,
  ): RolPermiso {
    const id = crypto.randomUUID();
    const now = new Date();
    return new RolPermiso(
      id,
      rolId,
      permisoId,
      now,
    );
  }
}
