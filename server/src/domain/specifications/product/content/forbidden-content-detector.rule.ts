import { Injectable } from '@nestjs/common';
import { CompositeSpecification } from '../../base/composite-specification';
import { SpecificationResult } from '../../base/specification-result';
import { ProductPublicationContext } from '../product-publication-context';

/**
 * Validación #2: Detección de Contenido Prohibido
 *
 * Reglas de negocio:
 * - NO permitir información de contacto directo (teléfonos, emails, WhatsApp)
 * - NO permitir URLs externas (evita evasión de plataforma)
 * - NO permitir palabras prohibidas (armas, drogas, etc.)
 * - NO permitir menciones de dinero/precios (es trueque, no venta)
 *
 * Valor de negocio:
 * - Legal compliance
 * - Evita evasión de comisiones/plataforma
 * - Previene scams
 */
@Injectable()
export class ForbiddenContentDetectorRule extends CompositeSpecification<ProductPublicationContext> {
  // Patrones de detección
  private readonly PHONE_PATTERNS = [
    /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, // 123-456-7890
    /\b\d{10}\b/g, // 1234567890
    /\b\+?\d{1,3}[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, // +57 312 345 6789
    /\b3\d{9}\b/g, // Celulares Colombia: 3xx xxx xxxx
  ];

  private readonly EMAIL_PATTERN =
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

  private readonly URL_PATTERNS = [
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b/gi,
    /www\.[^\s]+/gi,
    /\b[a-z0-9]+\.(com|co|net|org|io|me|xyz|online)\b/gi,
  ];

  private readonly CONTACT_KEYWORDS = [
    'whatsapp',
    'whats app',
    'wsp',
    'wasap',
    'telegram',
    'llamame',
    'llámame',
    'llamar',
    'contactar',
    'escribeme',
    'escríbeme',
    'mensaje directo',
    'md',
    'dm',
  ];

  private readonly FORBIDDEN_ITEMS = [
    'arma',
    'pistola',
    'revolver',
    'droga',
    'marihuana',
    'cocaina',
    'cocaína',
    'estupefaciente',
    'animal vivo',
    'cachorro',
    'gatito',
    'mascota',
    'órgano',
    'organo',
    'sangre',
    'plasma',
    'medicamento controlado',
    'pasaporte',
    'cédula',
    'cedula',
    'documento de identidad',
  ];

  private readonly MONEY_KEYWORDS = [
    'precio',
    'pesos',
    'dolares',
    'dólares',
    'valor en dinero',
    'venta',
    'vendo',
    'comprar',
    'pagar',
    'pagos',
    'efectivo',
    'transferencia',
    'nequi',
    'daviplata',
    'bancolombia',
  ];

  async isSatisfiedBy(
    context: ProductPublicationContext,
  ): Promise<SpecificationResult> {
    const { product } = context;
    const fullText = `${product.titulo} ${product.descripcion}`.toLowerCase();

    const violations: string[] = [];

    // 1. Detectar teléfonos
    for (const pattern of this.PHONE_PATTERNS) {
      if (pattern.test(fullText)) {
        violations.push('Número de teléfono detectado');
        break;
      }
    }

    // 2. Detectar emails
    if (this.EMAIL_PATTERN.test(fullText)) {
      violations.push('Correo electrónico detectado');
    }

    // 3. Detectar URLs
    for (const pattern of this.URL_PATTERNS) {
      if (pattern.test(fullText)) {
        violations.push('URL externa detectada');
        break;
      }
    }

    // 4. Detectar palabras de contacto
    const contactFound = this.CONTACT_KEYWORDS.find((keyword) =>
      fullText.includes(keyword),
    );
    if (contactFound) {
      violations.push(`Solicitud de contacto directo: "${contactFound}"`);
    }

    // 5. Detectar items prohibidos
    const forbiddenFound = this.FORBIDDEN_ITEMS.find((item) =>
      fullText.includes(item),
    );
    if (forbiddenFound) {
      violations.push(`Artículo prohibido detectado: "${forbiddenFound}"`);
    }

    // 6. Detectar menciones de dinero (solo advertencia)
    const moneyFound = this.MONEY_KEYWORDS.find((keyword) =>
      fullText.includes(keyword),
    );

    if (violations.length > 0) {
      return SpecificationResult.failure(
        'Contenido prohibido detectado en tu publicación.',
        'FORBIDDEN_CONTENT_DETECTED',
        {
          violations,
          message:
            'Recuerda que esta es una plataforma de TRUEQUE. No incluyas información de contacto directo, precios en dinero o artículos prohibidos.',
        },
      );
    }

    // Advertencia sobre dinero (no bloquea)
    if (moneyFound) {
      return SpecificationResult.warning(
        `Detectamos la palabra "${moneyFound}". Recuerda que esto es un trueque, no una venta.`,
        'MONEY_MENTION_WARNING',
        {
          keyword: moneyFound,
        },
      );
    }

    return SpecificationResult.success();
  }
}
