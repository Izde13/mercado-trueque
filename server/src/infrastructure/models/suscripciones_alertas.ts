import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type {
  alertas_activadas,
  alertas_activadasId,
} from './alertas_activadas';
import type { categorias, categoriasId } from './categorias';

export interface suscripciones_alertasAttributes {
  id: string;
  email: string;
  categoria_id?: string;
  palabras_clave?: string;
  activa?: boolean;
  fecha_suscripcion?: Date;
}

export type suscripciones_alertasPk = 'id';
export type suscripciones_alertasId =
  suscripciones_alertas[suscripciones_alertasPk];
export type suscripciones_alertasOptionalAttributes =
  | 'id'
  | 'categoria_id'
  | 'palabras_clave'
  | 'activa'
  | 'fecha_suscripcion';
export type suscripciones_alertasCreationAttributes = Optional<
  suscripciones_alertasAttributes,
  suscripciones_alertasOptionalAttributes
>;

export class suscripciones_alertas
  extends Model<
    suscripciones_alertasAttributes,
    suscripciones_alertasCreationAttributes
  >
  implements suscripciones_alertasAttributes
{
  id!: string;
  email!: string;
  categoria_id?: string;
  palabras_clave?: string;
  activa?: boolean;
  fecha_suscripcion?: Date;

  // suscripciones_alertas belongsTo categorias via categoria_id
  categorium!: categorias;
  getCategorium!: Sequelize.BelongsToGetAssociationMixin<categorias>;
  setCategorium!: Sequelize.BelongsToSetAssociationMixin<
    categorias,
    categoriasId
  >;
  createCategorium!: Sequelize.BelongsToCreateAssociationMixin<categorias>;
  // suscripciones_alertas hasMany alertas_activadas via suscripcion_id
  alertas_activadas!: alertas_activadas[];
  getAlertas_activadas!: Sequelize.HasManyGetAssociationsMixin<alertas_activadas>;
  setAlertas_activadas!: Sequelize.HasManySetAssociationsMixin<
    alertas_activadas,
    alertas_activadasId
  >;
  addAlertas_activada!: Sequelize.HasManyAddAssociationMixin<
    alertas_activadas,
    alertas_activadasId
  >;
  addAlertas_activadas!: Sequelize.HasManyAddAssociationsMixin<
    alertas_activadas,
    alertas_activadasId
  >;
  createAlertas_activada!: Sequelize.HasManyCreateAssociationMixin<alertas_activadas>;
  removeAlertas_activada!: Sequelize.HasManyRemoveAssociationMixin<
    alertas_activadas,
    alertas_activadasId
  >;
  removeAlertas_activadas!: Sequelize.HasManyRemoveAssociationsMixin<
    alertas_activadas,
    alertas_activadasId
  >;
  hasAlertas_activada!: Sequelize.HasManyHasAssociationMixin<
    alertas_activadas,
    alertas_activadasId
  >;
  hasAlertas_activadas!: Sequelize.HasManyHasAssociationsMixin<
    alertas_activadas,
    alertas_activadasId
  >;
  countAlertas_activadas!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(
    sequelize: Sequelize.Sequelize,
  ): typeof suscripciones_alertas {
    return suscripciones_alertas.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn(
            'mercadotrueque.uuid_generate_v4',
          ),
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        categoria_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'categorias',
            key: 'id',
          },
        },
        palabras_clave: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        activa: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
        fecha_suscripcion: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      {
        sequelize,
        tableName: 'suscripciones_alertas',
        schema: 'mercadotrueque',
        timestamps: false,
        indexes: [
          {
            name: 'idx_suscripciones_activa',
            fields: [{ name: 'activa' }],
          },
          {
            name: 'idx_suscripciones_categoria',
            fields: [{ name: 'categoria_id' }],
          },
          {
            name: 'idx_suscripciones_email',
            fields: [{ name: 'email' }],
          },
          {
            name: 'suscripciones_alertas_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
  }
}
