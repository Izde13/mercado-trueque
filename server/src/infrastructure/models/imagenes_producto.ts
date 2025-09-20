import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { productos, productosId } from './productos';

export interface imagenes_productoAttributes {
  id: string;
  producto_id: string;
  url_imagen: string;
  orden?: number;
  es_principal?: boolean;
}

export type imagenes_productoPk = 'id';
export type imagenes_productoId = imagenes_producto[imagenes_productoPk];
export type imagenes_productoOptionalAttributes =
  | 'id'
  | 'orden'
  | 'es_principal';
export type imagenes_productoCreationAttributes = Optional<
  imagenes_productoAttributes,
  imagenes_productoOptionalAttributes
>;

export class imagenes_producto
  extends Model<
    imagenes_productoAttributes,
    imagenes_productoCreationAttributes
  >
  implements imagenes_productoAttributes
{
  id!: string;
  producto_id!: string;
  url_imagen!: string;
  orden?: number;
  es_principal?: boolean;

  // imagenes_producto belongsTo productos via producto_id
  producto!: productos;
  getProducto!: Sequelize.BelongsToGetAssociationMixin<productos>;
  setProducto!: Sequelize.BelongsToSetAssociationMixin<productos, productosId>;
  createProducto!: Sequelize.BelongsToCreateAssociationMixin<productos>;

  static initModel(sequelize: Sequelize.Sequelize): typeof imagenes_producto {
    return imagenes_producto.init(
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
        },
        url_imagen: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        orden: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 1,
        },
        es_principal: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: 'imagenes_producto',
        schema: 'mercadotrueque',
        timestamps: false,
        indexes: [
          {
            name: 'imagenes_producto_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
  }
}
