import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { intercambios, intercambiosId } from './intercambios';
import type { usuarios, usuariosId } from './usuarios';

export interface reseñasAttributes {
  id: string;
  intercambio_id: string;
  usuario_calificador_id: string;
  usuario_calificado_id: string;
  calificacion_usuario: number;
  calificacion_producto: number;
  comentario?: string;
  fecha_reseña?: Date;
  visible?: boolean;
}

export type reseñasPk = 'id';
export type reseñasId = reseñas[reseñasPk];
export type reseñasOptionalAttributes =
  | 'id'
  | 'comentario'
  | 'fecha_reseña'
  | 'visible';
export type reseñasCreationAttributes = Optional<
  reseñasAttributes,
  reseñasOptionalAttributes
>;

export class reseñas
  extends Model<reseñasAttributes, reseñasCreationAttributes>
  implements reseñasAttributes
{
  id!: string;
  intercambio_id!: string;
  usuario_calificador_id!: string;
  usuario_calificado_id!: string;
  calificacion_usuario!: number;
  calificacion_producto!: number;
  comentario?: string;
  'fecha_reseña'?: Date;
  visible?: boolean;

  // reseñas belongsTo intercambios via intercambio_id
  intercambio!: intercambios;
  getIntercambio!: Sequelize.BelongsToGetAssociationMixin<intercambios>;
  setIntercambio!: Sequelize.BelongsToSetAssociationMixin<
    intercambios,
    intercambiosId
  >;
  createIntercambio!: Sequelize.BelongsToCreateAssociationMixin<intercambios>;
  // reseñas belongsTo usuarios via usuario_calificador_id
  usuario_calificador!: usuarios;
  getUsuario_calificador!: Sequelize.BelongsToGetAssociationMixin<usuarios>;
  setUsuario_calificador!: Sequelize.BelongsToSetAssociationMixin<
    usuarios,
    usuariosId
  >;
  createUsuario_calificador!: Sequelize.BelongsToCreateAssociationMixin<usuarios>;
  // reseñas belongsTo usuarios via usuario_calificado_id
  usuario_calificado!: usuarios;
  getUsuario_calificado!: Sequelize.BelongsToGetAssociationMixin<usuarios>;
  setUsuario_calificado!: Sequelize.BelongsToSetAssociationMixin<
    usuarios,
    usuariosId
  >;
  createUsuario_calificado!: Sequelize.BelongsToCreateAssociationMixin<usuarios>;

  static initModel(sequelize: Sequelize.Sequelize): typeof reseñas {
    return reseñas.init(
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
          unique: 'reseñas_intercambio_id_usuario_calificador_id_key',
        },
        usuario_calificador_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'usuarios',
            key: 'id',
          },
          unique: 'reseñas_intercambio_id_usuario_calificador_id_key',
        },
        usuario_calificado_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'usuarios',
            key: 'id',
          },
        },
        calificacion_usuario: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        calificacion_producto: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        comentario: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        fecha_reseña: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        visible: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
      },
      {
        sequelize,
        tableName: 'reseñas',
        schema: 'mercadotrueque',
        timestamps: false,
        indexes: [
          {
            name: 'reseñas_intercambio_id_usuario_calificador_id_key',
            unique: true,
            fields: [
              { name: 'intercambio_id' },
              { name: 'usuario_calificador_id' },
            ],
          },
          {
            name: 'reseñas_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
  }
}
