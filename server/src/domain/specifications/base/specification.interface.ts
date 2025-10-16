import { SpecificationResult } from './specification-result';

/**
 * Specification Pattern Interface
 * Encapsula reglas de negocio reutilizables que pueden ser compuestas
 */
export interface ISpecification<T> {
  /**
   * Verifica si el objeto satisface la especificación
   * @param candidate - Objeto a verificar
   * @returns Resultado de la validación con detalles
   */
  isSatisfiedBy(candidate: T): Promise<SpecificationResult>;

  /**
   * Combina esta especificación con otra usando AND lógico
   * @param other - Otra especificación
   * @returns Nueva especificación compuesta
   */
  and(other: ISpecification<T>): ISpecification<T>;

  /**
   * Combina esta especificación con otra usando OR lógico
   * @param other - Otra especificación
   * @returns Nueva especificación compuesta
   */
  or(other: ISpecification<T>): ISpecification<T>;

  /**
   * Niega esta especificación
   * @returns Nueva especificación negada
   */
  not(): ISpecification<T>;
}
