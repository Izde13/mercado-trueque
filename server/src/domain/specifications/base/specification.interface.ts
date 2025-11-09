import { SpecificationResult } from './specification-result';

/**
 * Specification Pattern Interface
 * Encapsula reglas de negocio reutilizables que pueden ser compuestas
 */
export interface ISpecification<T> {
  /**
   * Verifica si el objeto satisface la especificaci�n
   * @param candidate - Objeto a verificar
   * @returns Resultado de la validaci�n con detalles
   */
  isSatisfiedBy(candidate: T): Promise<SpecificationResult>;

  /**
   * Combina esta especificaci�n con otra usando AND l�gico
   * @param other - Otra especificaci�n
   * @returns Nueva especificaci�n compuesta
   */
  and(other: ISpecification<T>): ISpecification<T>;

  /**
   * Combina esta especificaci�n con otra usando OR l�gico
   * @param other - Otra especificaci�n
   * @returns Nueva especificaci�n compuesta
   */
  or(other: ISpecification<T>): ISpecification<T>;

  /**
   * Niega esta especificaci�n
   * @returns Nueva especificaci�n negada
   */
  not(): ISpecification<T>;
}
