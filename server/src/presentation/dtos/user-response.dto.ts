export class UserResponseDto {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  fechaRegistro?: Date;
  estado?: string;
  avatarUrl?: string;
  calificacionPromedio?: number;
  totalIntercambios?: number;

  constructor(user: any) {
    this.id = user.id;
    this.email = user.email;
    this.nombre = user.nombre;
    this.apellido = user.apellido;
    this.telefono = user.telefono;
    this.fechaRegistro = user.fechaRegistro;
    this.estado = user.estado;
    this.avatarUrl = user.avatarUrl;
    this.calificacionPromedio = user.calificacionPromedio;
    this.totalIntercambios = user.totalIntercambios;
  }
}
