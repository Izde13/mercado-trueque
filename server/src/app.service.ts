import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Mercado Trueque API v1 - Hello World!';
  }
}
