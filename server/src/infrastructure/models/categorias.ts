import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type {
  caracteristicas_categoria,
  caracteristicas_categoriaId,
} from './caracteristicas_categoria';
import type { productos, productosId } from './productos';
import type {
  suscripciones_alertas,
  suscripciones_alertasId,
} from './suscripciones_alertas';

export interface categoriasAttributes {
  id: string;
  codigo: number;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export type categoriasPk = 'id';
export type categoriasId = categorias[categoriasPk];
export type categoriasOptionalAttributes =
  | 'id'
  | 'codigo'
  | 'descripcion'
  | 'activo';
export type categoriasCreationAttributes = Optional<
  categoriasAttributes,
  categoriasOptionalAttributes
>;

export class categorias
  extends Model<categoriasAttributes, categoriasCreationAttributes>
  implements categoriasAttributes
{
  id!: string;
  codigo!: number;
  nombre!: string;
  descripcion?: string;
  activo?: boolean;

  // categorias hasMany caracteristicas_categoria via categoria_id
  caracteristicas_categoria!: caracteristicas_categoria[];
  getCaracteristicas_categoria!: Sequelize.HasManyGetAssociationsMixin<caracteristicas_categoria>;
  setCaracteristicas_categoria!: Sequelize.HasManySetAssociationsMixin<
    caracteristicas_categoria,
    caracteristicas_categoriaId
  >;
  addCaracteristicas_categorium!: Sequelize.HasManyAddAssociationMixin<
    caracteristicas_categoria,
    caracteristicas_categoriaId
  >;
  addCaracteristicas_categoria!: Sequelize.HasManyAddAssociationsMixin<
    caracteristicas_categoria,
    caracteristicas_categoriaId
  >;
  createCaracteristicas_categorium!: Sequelize.HasManyCreateAssociationMixin<caracteristicas_categoria>;
  removeCaracteristicas_categorium!: Sequelize.HasManyRemoveAssociationMixin<
    caracteristicas_categoria,
    caracteristicas_categoriaId
  >;
  removeCaracteristicas_categoria!: Sequelize.HasManyRemoveAssociationsMixin<
    caracteristicas_categoria,
    caracteristicas_categoriaId
  >;
  hasCaracteristicas_categorium!: Sequelize.HasManyHasAssociationMixin<
    caracteristicas_categoria,
    caracteristicas_categoriaId
  >;
  hasCaracteristicas_categoria!: Sequelize.HasManyHasAssociationsMixin<
    caracteristicas_categoria,
    caracteristicas_categoriaId
  >;
  countCaracteristicas_categoria!: Sequelize.HasManyCountAssociationsMixin;
  // categorias hasMany productos via categoria_id
  productos!: productos[];
  getProductos!: Sequelize.HasManyGetAssociationsMixin<productos>;
  setProductos!: Sequelize.HasManySetAssociationsMixin<productos, productosId>;
  addProducto!: Sequelize.HasManyAddAssociationMixin<productos, productosId>;
  addProductos!: Sequelize.HasManyAddAssociationsMixin<productos, productosId>;
  createProducto!: Sequelize.HasManyCreateAssociationMixin<productos>;
  removeProducto!: Sequelize.HasManyRemoveAssociationMixin<
    productos,
    productosId
  >;
  removeProductos!: Sequelize.HasManyRemoveAssociationsMixin<
    productos,
    productosId
  >;
  hasProducto!: Sequelize.HasManyHasAssociationMixin<productos, productosId>;
  hasProductos!: Sequelize.HasManyHasAssociationsMixin<productos, productosId>;
  countProductos!: Sequelize.HasManyCountAssociationsMixin;
  // categorias hasMany suscripciones_alertas via categoria_id
  suscripciones_alerta!: suscripciones_alertas[];
  getSuscripciones_alerta!: Sequelize.HasManyGetAssociationsMixin<suscripciones_alertas>;
  setSuscripciones_alerta!: Sequelize.HasManySetAssociationsMixin<
    suscripciones_alertas,
    suscripciones_alertasId
  >;
  addSuscripciones_alertum!: Sequelize.HasManyAddAssociationMixin<
    suscripciones_alertas,
    suscripciones_alertasId
  >;
  addSuscripciones_alerta!: Sequelize.HasManyAddAssociationsMixin<
    suscripciones_alertas,
    suscripciones_alertasId
  >;
  createSuscripciones_alertum!: Sequelize.HasManyCreateAssociationMixin<suscripciones_alertas>;
  removeSuscripciones_alertum!: Sequelize.HasManyRemoveAssociationMixin<
    suscripciones_alertas,
    suscripciones_alertasId
  >;
  removeSuscripciones_alerta!: Sequelize.HasManyRemoveAssociationsMixin<
    suscripciones_alertas,
    suscripciones_alertasId
  >;
  hasSuscripciones_alertum!: Sequelize.HasManyHasAssociationMixin<
    suscripciones_alertas,
    suscripciones_alertasId
  >;
  hasSuscripciones_alerta!: Sequelize.HasManyHasAssociationsMixin<
    suscripciones_alertas,
    suscripciones_alertasId
  >;
  countSuscripciones_alerta!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof categorias {
    return categorias.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn(
            'mercadotrueque.uuid_generate_v4',
          ),
          primaryKey: true,
        },
        codigo: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: 'categorias_codigo_key',
        },
        nombre: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: 'categorias_nombre_key',
        },
        descripcion: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        activo: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
      },
      {
        sequelize,
        tableName: 'categorias',
        schema: 'mercadotrueque',
        timestamps: false,
        indexes: [
          {
            name: 'categorias_codigo_key',
            unique: true,
            fields: [{ name: 'codigo' }],
          },
          {
            name: 'categorias_nombre_key',
            unique: true,
            fields: [{ name: 'nombre' }],
          },
          {
            name: 'categorias_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
  }
}
