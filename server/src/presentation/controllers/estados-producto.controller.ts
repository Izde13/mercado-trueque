import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/services/prisma.service';

@Controller('estados-producto')
export class EstadosProductoController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const estados = await this.prisma.estados_producto.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        orden: true,
      },
    });

    return estados;
  }
}
