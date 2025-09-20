import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { intercambios, intercambiosId } from './intercambios';
import type { productos, productosId } from './productos';

export interface enviosAttributes {
  id: string;
  intercambio_id: string;
  producto_id: string;
  direccion_origen: string;
  fecha_envio?: Date;
  fecha_recepcion_centro?: Date;
  codigo_tracking?: string;
  transportadora?: string;
  estado_envio?: string;
  costo_envio?: number;
}

export type enviosPk = 'id';
export type enviosId = envios[enviosPk];
export type enviosOptionalAttributes =
  | 'id'
  | 'fecha_envio'
  | 'fecha_recepcion_centro'
  | 'codigo_tracking'
  | 'transportadora'
  | 'estado_envio'
  | 'costo_envio';
export type enviosCreationAttributes = Optional<
  enviosAttributes,
  enviosOptionalAttributes
>;

export class envios
  extends Model<enviosAttributes, enviosCreationAttributes>
  implements enviosAttributes
{
  id!: string;
  intercambio_id!: string;
  producto_id!: string;
  direccion_origen!: string;
  fecha_envio?: Date;
  fecha_recepcion_centro?: Date;
  codigo_tracking?: string;
  transportadora?: string;
  estado_envio?: string;
  costo_envio?: number;

  // envios belongsTo intercambios via intercambio_id
  intercambio!: intercambios;
  getIntercambio!: Sequelize.BelongsToGetAssociationMixin<intercambios>;
  setIntercambio!: Sequelize.BelongsToSetAssociationMixin<
    intercambios,
    intercambiosId
  >;
  createIntercambio!: Sequelize.BelongsToCreateAssociationMixin<intercambios>;
  // envios belongsTo productos via producto_id
  producto!: productos;
  getProducto!: Sequelize.BelongsToGetAssociationMixin<productos>;
  setProducto!: Sequelize.BelongsToSetAssociationMixin<productos, productosId>;
  createProducto!: Sequelize.BelongsToCreateAssociationMixin<productos>;

  static initModel(sequelize: Sequelize.Sequelize): typeof envios {
    return envios.init(
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
        },
        producto_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'productos',
            key: 'id',
          },
        },
        direccion_origen: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        fecha_envio: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        fecha_recepcion_centro: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        codigo_tracking: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        transportadora: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        estado_envio: {
          type: DataTypes.STRING(30),
          allowNull: true,
          defaultValue: 'preparando',
        },
        costo_envio: {
          type: DataTypes.DECIMAL,
          allowNull: true,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        tableName: 'envios',
        schema: 'mercadotrueque',
        timestamps: false,
        indexes: [
          {
            name: 'envios_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'idx_envios_estado',
            fields: [{ name: 'estado_envio' }],
          },
          {
            name: 'idx_envios_intercambio',
            fields: [{ name: 'intercambio_id' }],
          },
          {
            name: 'idx_envios_producto',
            fields: [{ name: 'producto_id' }],
          },
          {
            name: 'idx_envios_tracking',
            fields: [{ name: 'codigo_tracking' }],
          },
        ],
      },
    );
  }
}
