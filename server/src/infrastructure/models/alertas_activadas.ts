import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { productos, productosId } from './productos';
import type {
  suscripciones_alertas,
  suscripciones_alertasId,
} from './suscripciones_alertas';

export interface alertas_activadasAttributes {
  id: string;
  suscripcion_id: string;
  producto_id: string;
  enviada?: boolean;
  fecha_activacion?: Date;
}

export type alertas_activadasPk = 'id';
export type alertas_activadasId = alertas_activadas[alertas_activadasPk];
export type alertas_activadasOptionalAttributes =
  | 'id'
  | 'enviada'
  | 'fecha_activacion';
export type alertas_activadasCreationAttributes = Optional<
  alertas_activadasAttributes,
  alertas_activadasOptionalAttributes
>;

export class alertas_activadas
  extends Model<
    alertas_activadasAttributes,
    alertas_activadasCreationAttributes
  >
  implements alertas_activadasAttributes
{
  id!: string;
  suscripcion_id!: string;
  producto_id!: string;
  enviada?: boolean;
  fecha_activacion?: Date;

  // alertas_activadas belongsTo productos via producto_id
  producto!: productos;
  getProducto!: Sequelize.BelongsToGetAssociationMixin<productos>;
  setProducto!: Sequelize.BelongsToSetAssociationMixin<productos, productosId>;
  createProducto!: Sequelize.BelongsToCreateAssociationMixin<productos>;
  // alertas_activadas belongsTo suscripciones_alertas via suscripcion_id
  suscripcion!: suscripciones_alertas;
  getSuscripcion!: Sequelize.BelongsToGetAssociationMixin<suscripciones_alertas>;
  setSuscripcion!: Sequelize.BelongsToSetAssociationMixin<
    suscripciones_alertas,
    suscripciones_alertasId
  >;
  createSuscripcion!: Sequelize.BelongsToCreateAssociationMixin<suscripciones_alertas>;

  static initModel(sequelize: Sequelize.Sequelize): typeof alertas_activadas {
    return alertas_activadas.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn(
            'mercadotrueque.uuid_generate_v4',
          ),
          primaryKey: true,
        },
        suscripcion_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'suscripciones_alertas',
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
        enviada: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        fecha_activacion: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      {
        sequelize,
        tableName: 'alertas_activadas',
        schema: 'mercadotrueque',
        timestamps: false,
        indexes: [
          {
            name: 'alertas_activadas_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
  }
}
