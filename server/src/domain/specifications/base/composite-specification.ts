import { ISpecification } from './specification.interface';
import { SpecificationResult } from './specification-result';

/**
 * Clase base abstracta para implementar el patr�n Specification
 */
export abstract class CompositeSpecification<T> implements ISpecification<T> {
  abstract isSatisfiedBy(candidate: T): Promise<SpecificationResult>;

  and(other: ISpecification<T>): ISpecification<T> {
    return new AndSpecification(this, other);
  }

  or(other: ISpecification<T>): ISpecification<T> {
    return new OrSpecification(this, other);
  }

  not(): ISpecification<T> {
    return new NotSpecification(this);
  }
}

/**
 * Combina dos especificaciones con AND l�gico
 */
class AndSpecification<T> extends CompositeSpecification<T> {
  constructor(
    private readonly left: ISpecification<T>,
    private readonly right: ISpecification<T>,
  ) {
    super();
  }

  async isSatisfiedBy(candidate: T): Promise<SpecificationResult> {
    const leftResult = await this.left.isSatisfiedBy(candidate);
    if (!leftResult.isValid) {
      return leftResult;
    }

    const rightResult = await this.right.isSatisfiedBy(candidate);
    if (!rightResult.isValid) {
      return rightResult;
    }

    return SpecificationResult.success();
  }
}

/**
 * Combina dos especificaciones con OR l�gico
 */
class OrSpecification<T> extends CompositeSpecification<T> {
  constructor(
    private readonly left: ISpecification<T>,
    private readonly right: ISpecification<T>,
  ) {
    super();
  }

  async isSatisfiedBy(candidate: T): Promise<SpecificationResult> {
    const leftResult = await this.left.isSatisfiedBy(candidate);
    if (leftResult.isValid) {
      return leftResult;
    }

    const rightResult = await this.right.isSatisfiedBy(candidate);
    return rightResult;
  }
}

/**
 * Niega una especificaci�n
 */
class NotSpecification<T> extends CompositeSpecification<T> {
  constructor(private readonly spec: ISpecification<T>) {
    super();
  }

  async isSatisfiedBy(candidate: T): Promise<SpecificationResult> {
    const result = await this.spec.isSatisfiedBy(candidate);

    if (result.isValid) {
      return SpecificationResult.failure(
        'Condici�n negada no se cumple',
        'NOT_SPECIFICATION_FAILED',
      );
    }

    return SpecificationResult.success();
  }
}
