import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type {
  caracteristicas_categoria,
  caracteristicas_categoriaId,
} from './caracteristicas_categoria';
import type { productos, productosId } from './productos';

export interface caracteristicas_productoAttributes {
  id: string;
  producto_id: string;
  caracteristica_id: string;
  valor: string;
}

export type caracteristicas_productoPk = 'id';
export type caracteristicas_productoId =
  caracteristicas_producto[caracteristicas_productoPk];
export type caracteristicas_productoOptionalAttributes = 'id';
export type caracteristicas_productoCreationAttributes = Optional<
  caracteristicas_productoAttributes,
  caracteristicas_productoOptionalAttributes
>;

export class caracteristicas_producto
  extends Model<
    caracteristicas_productoAttributes,
    caracteristicas_productoCreationAttributes
  >
  implements caracteristicas_productoAttributes
{
  id!: string;
  producto_id!: string;
  caracteristica_id!: string;
  valor!: string;

  // caracteristicas_producto belongsTo caracteristicas_categoria via caracteristica_id
  caracteristica!: caracteristicas_categoria;
  getCaracteristica!: Sequelize.BelongsToGetAssociationMixin<caracteristicas_categoria>;
  setCaracteristica!: Sequelize.BelongsToSetAssociationMixin<
    caracteristicas_categoria,
    caracteristicas_categoriaId
  >;
  createCaracteristica!: Sequelize.BelongsToCreateAssociationMixin<caracteristicas_categoria>;
  // caracteristicas_producto belongsTo productos via producto_id
  producto!: productos;
  getProducto!: Sequelize.BelongsToGetAssociationMixin<productos>;
  setProducto!: Sequelize.BelongsToSetAssociationMixin<productos, productosId>;
  createProducto!: Sequelize.BelongsToCreateAssociationMixin<productos>;

  static initModel(
    sequelize: Sequelize.Sequelize,
  ): typeof caracteristicas_producto {
    return caracteristicas_producto.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn(
            'mercadotrueque.uuid_generate_v4',
          ),
          primaryKey: true,
        },
        producto_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'productos',
            key: 'id',
          },
          unique: 'caracteristicas_producto_producto_id_caracteristica_id_key',
        },
        caracteristica_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'caracteristicas_categoria',
            key: 'id',
          },
          unique: 'caracteristicas_producto_producto_id_caracteristica_id_key',
        },
        valor: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'caracteristicas_producto',
        schema: 'mercadotrueque',
        timestamps: false,
        indexes: [
          {
            name: 'caracteristicas_producto_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'caracteristicas_producto_producto_id_caracteristica_id_key',
            unique: true,
            fields: [{ name: 'producto_id' }, { name: 'caracteristica_id' }],
          },
          {
            name: 'idx_caracteristicas_producto',
            fields: [{ name: 'producto_id' }],
          },
        ],
      },
    );
  }
}
