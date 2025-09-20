import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { intercambios, intercambiosId } from './intercambios';
import type { productos, productosId } from './productos';

export interface revision_productosAttributes {
  id: string;
  intercambio_id: string;
  producto_id: string;
  empleado_revisor?: string;
  estado_revision?: string;
  calificacion_estado?: number;
  observaciones?: string;
  fecha_revision?: Date;
  fotos_revision?: object;
}

export type revision_productosPk = 'id';
export type revision_productosId = revision_productos[revision_productosPk];
export type revision_productosOptionalAttributes =
  | 'id'
  | 'empleado_revisor'
  | 'estado_revision'
  | 'calificacion_estado'
  | 'observaciones'
  | 'fecha_revision'
  | 'fotos_revision';
export type revision_productosCreationAttributes = Optional<
  revision_productosAttributes,
  revision_productosOptionalAttributes
>;

export class revision_productos
  extends Model<
    revision_productosAttributes,
    revision_productosCreationAttributes
  >
  implements revision_productosAttributes
{
  id!: string;
  intercambio_id!: string;
  producto_id!: string;
  empleado_revisor?: string;
  estado_revision?: string;
  calificacion_estado?: number;
  observaciones?: string;
  fecha_revision?: Date;
  fotos_revision?: object;

  // revision_productos belongsTo intercambios via intercambio_id
  intercambio!: intercambios;
  getIntercambio!: Sequelize.BelongsToGetAssociationMixin<intercambios>;
  setIntercambio!: Sequelize.BelongsToSetAssociationMixin<
    intercambios,
    intercambiosId
  >;
  createIntercambio!: Sequelize.BelongsToCreateAssociationMixin<intercambios>;
  // revision_productos belongsTo productos via producto_id
  producto!: productos;
  getProducto!: Sequelize.BelongsToGetAssociationMixin<productos>;
  setProducto!: Sequelize.BelongsToSetAssociationMixin<productos, productosId>;
  createProducto!: Sequelize.BelongsToCreateAssociationMixin<productos>;

  static initModel(sequelize: Sequelize.Sequelize): typeof revision_productos {
    return revision_productos.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn(
            'mercadotrueque.uuid_generate_v4',
          ),
          primaryKey: true,
        },
        intercambio_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'intercambios',
            key: 'id',
          },
          unique: 'revision_productos_intercambio_id_producto_id_key',
        },
        producto_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'productos',
            key: 'id',
          },
          unique: 'revision_productos_intercambio_id_producto_id_key',
        },
        empleado_revisor: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        estado_revision: {
          type: DataTypes.STRING(30),
          allowNull: true,
          defaultValue: 'pendiente',
        },
        calificacion_estado: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        observaciones: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        fecha_revision: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        fotos_revision: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'revision_productos',
        schema: 'mercadotrueque',
        timestamps: false,
        indexes: [
          {
            name: 'revision_productos_intercambio_id_producto_id_key',
            unique: true,
            fields: [{ name: 'intercambio_id' }, { name: 'producto_id' }],
          },
          {
            name: 'revision_productos_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
  }
}
