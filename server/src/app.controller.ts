import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHealth(): object {
    return {
      status: 'ok',
      message: 'Mercado Trueque API is running',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    };
  }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
