import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BusinessRuleException } from '../../domain/errors';

/**
 * Filtro global para capturar y formatear BusinessRuleException
 *
 * Convierte las excepciones de reglas de negocio en respuestas HTTP 400 (Bad Request)
 * con un formato consistente para el cliente
 */
@Catch(BusinessRuleException)
export class BusinessRuleExceptionFilter implements ExceptionFilter {
  catch(exception: BusinessRuleException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: exception.message,
      code: exception.code,
      details: exception.details,
      timestamp: new Date().toISOString(),
    });
  }
}
