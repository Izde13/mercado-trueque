import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type {
  centros_distribucion,
  centros_distribucionId,
} from './centros_distribucion';
import type { envios, enviosId } from './envios';
import type {
  propuestas_trueque,
  propuestas_truequeId,
} from './propuestas_trueque';
import type { reseñas, reseñasId } from './reseñas';
import type {
  revision_productos,
  revision_productosId,
} from './revision_productos';

export interface intercambiosAttributes {
  id: string;
  propuesta_id: string;
  fecha_inicio?: Date;
  estado?: string;
  centro_distribucion_id: string;
  fecha_completado?: Date;
  notas_revision?: string;
  costo_envio_total?: number;
}

export type intercambiosPk = 'id';
export type intercambiosId = intercambios[intercambiosPk];
export type intercambiosOptionalAttributes =
  | 'id'
  | 'fecha_inicio'
  | 'estado'
  | 'fecha_completado'
  | 'notas_revision'
  | 'costo_envio_total';
export type intercambiosCreationAttributes = Optional<
  intercambiosAttributes,
  intercambiosOptionalAttributes
>;

export class intercambios
  extends Model<intercambiosAttributes, intercambiosCreationAttributes>
  implements intercambiosAttributes
{
  id!: string;
  propuesta_id!: string;
  fecha_inicio?: Date;
  estado?: string;
  centro_distribucion_id!: string;
  fecha_completado?: Date;
  notas_revision?: string;
  costo_envio_total?: number;

  // intercambios belongsTo centros_distribucion via centro_distribucion_id
  centro_distribucion!: centros_distribucion;
  getCentro_distribucion!: Sequelize.BelongsToGetAssociationMixin<centros_distribucion>;
  setCentro_distribucion!: Sequelize.BelongsToSetAssociationMixin<
    centros_distribucion,
    centros_distribucionId
  >;
  createCentro_distribucion!: Sequelize.BelongsToCreateAssociationMixin<centros_distribucion>;
  // intercambios hasMany envios via intercambio_id
  envios!: envios[];
  getEnvios!: Sequelize.HasManyGetAssociationsMixin<envios>;
  setEnvios!: Sequelize.HasManySetAssociationsMixin<envios, enviosId>;
  addEnvio!: Sequelize.HasManyAddAssociationMixin<envios, enviosId>;
  addEnvios!: Sequelize.HasManyAddAssociationsMixin<envios, enviosId>;
  createEnvio!: Sequelize.HasManyCreateAssociationMixin<envios>;
  removeEnvio!: Sequelize.HasManyRemoveAssociationMixin<envios, enviosId>;
  removeEnvios!: Sequelize.HasManyRemoveAssociationsMixin<envios, enviosId>;
  hasEnvio!: Sequelize.HasManyHasAssociationMixin<envios, enviosId>;
  hasEnvios!: Sequelize.HasManyHasAssociationsMixin<envios, enviosId>;
  countEnvios!: Sequelize.HasManyCountAssociationsMixin;
  // intercambios hasMany reseñas via intercambio_id
  reseñas!: reseñas[];
  getReseñas!: Sequelize.HasManyGetAssociationsMixin<reseñas>;
  setReseñas!: Sequelize.HasManySetAssociationsMixin<reseñas, reseñasId>;
  addReseña!: Sequelize.HasManyAddAssociationMixin<reseñas, reseñasId>;
  addReseñas!: Sequelize.HasManyAddAssociationsMixin<reseñas, reseñasId>;
  createReseña!: Sequelize.HasManyCreateAssociationMixin<reseñas>;
  removeReseña!: Sequelize.HasManyRemoveAssociationMixin<reseñas, reseñasId>;
  removeReseñas!: Sequelize.HasManyRemoveAssociationsMixin<reseñas, reseñasId>;
  hasReseña!: Sequelize.HasManyHasAssociationMixin<reseñas, reseñasId>;
  hasReseñas!: Sequelize.HasManyHasAssociationsMixin<reseñas, reseñasId>;
  countReseñas!: Sequelize.HasManyCountAssociationsMixin;
  // intercambios hasMany revision_productos via intercambio_id
  revision_productos!: revision_productos[];
  getRevision_productos!: Sequelize.HasManyGetAssociationsMixin<revision_productos>;
  setRevision_productos!: Sequelize.HasManySetAssociationsMixin<
    revision_productos,
    revision_productosId
  >;
  addRevision_producto!: Sequelize.HasManyAddAssociationMixin<
    revision_productos,
    revision_productosId
  >;
  addRevision_productos!: Sequelize.HasManyAddAssociationsMixin<
    revision_productos,
    revision_productosId
  >;
  createRevision_producto!: Sequelize.HasManyCreateAssociationMixin<revision_productos>;
  removeRevision_producto!: Sequelize.HasManyRemoveAssociationMixin<
    revision_productos,
    revision_productosId
  >;
  removeRevision_productos!: Sequelize.HasManyRemoveAssociationsMixin<
    revision_productos,
    revision_productosId
  >;
  hasRevision_producto!: Sequelize.HasManyHasAssociationMixin<
    revision_productos,
    revision_productosId
  >;
  hasRevision_productos!: Sequelize.HasManyHasAssociationsMixin<
    revision_productos,
    revision_productosId
  >;
  countRevision_productos!: Sequelize.HasManyCountAssociationsMixin;
  // intercambios belongsTo propuestas_trueque via propuesta_id
  propuestum!: propuestas_trueque;
  getPropuestum!: Sequelize.BelongsToGetAssociationMixin<propuestas_trueque>;
  setPropuestum!: Sequelize.BelongsToSetAssociationMixin<
    propuestas_trueque,
    propuestas_truequeId
  >;
  createPropuestum!: Sequelize.BelongsToCreateAssociationMixin<propuestas_trueque>;

  static initModel(sequelize: Sequelize.Sequelize): typeof intercambios {
    return intercambios.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn(
            'mercadotrueque.uuid_generate_v4',
          ),
          primaryKey: true,
        },
        propuesta_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'propuestas_trueque',
            key: 'id',
          },
        },
        fecha_inicio: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        estado: {
          type: DataTypes.STRING(30),
          allowNull: true,
          defaultValue: 'iniciado',
        },
        centro_distribucion_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'centros_distribucion',
            key: 'id',
          },
        },
        fecha_completado: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        notas_revision: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        costo_envio_total: {
          type: DataTypes.DECIMAL,
          allowNull: true,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        tableName: 'intercambios',
        schema: 'mercadotrueque',
        timestamps: false,
        indexes: [
          {
            name: 'idx_intercambios_centro',
            fields: [{ name: 'centro_distribucion_id' }],
          },
          {
            name: 'idx_intercambios_estado',
            fields: [{ name: 'estado' }],
          },
          {
            name: 'idx_intercambios_fecha',
            fields: [{ name: 'fecha_inicio', order: 'DESC' }],
          },
          {
            name: 'idx_intercambios_propuesta',
            fields: [{ name: 'propuesta_id' }],
          },
          {
            name: 'intercambios_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
  }
}
