import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { usuarios, usuariosId } from './usuarios';

export interface notificacionesAttributes {
  id: string;
  usuario_id: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  leida?: boolean;
  fecha_creacion?: Date;
  referencia_id?: string;
  referencia_tipo?: string;
}

export type notificacionesPk = 'id';
export type notificacionesId = notificaciones[notificacionesPk];
export type notificacionesOptionalAttributes =
  | 'id'
  | 'leida'
  | 'fecha_creacion'
  | 'referencia_id'
  | 'referencia_tipo';
export type notificacionesCreationAttributes = Optional<
  notificacionesAttributes,
  notificacionesOptionalAttributes
>;

export class notificaciones
  extends Model<notificacionesAttributes, notificacionesCreationAttributes>
  implements notificacionesAttributes
{
  id!: string;
  usuario_id!: string;
  tipo!: string;
  titulo!: string;
  mensaje!: string;
  leida?: boolean;
  fecha_creacion?: Date;
  referencia_id?: string;
  referencia_tipo?: string;

  // notificaciones belongsTo usuarios via usuario_id
  usuario!: usuarios;
  getUsuario!: Sequelize.BelongsToGetAssociationMixin<usuarios>;
  setUsuario!: Sequelize.BelongsToSetAssociationMixin<usuarios, usuariosId>;
  createUsuario!: Sequelize.BelongsToCreateAssociationMixin<usuarios>;

  static initModel(sequelize: Sequelize.Sequelize): typeof notificaciones {
    return notificaciones.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn(
            'mercadotrueque.uuid_generate_v4',
          ),
          primaryKey: true,
        },
        usuario_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'usuarios',
            key: 'id',
          },
        },
        tipo: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        titulo: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        mensaje: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        leida: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        fecha_creacion: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        referencia_id: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        referencia_tipo: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'notificaciones',
        schema: 'mercadotrueque',
        timestamps: false,
        indexes: [
          {
            name: 'idx_notificaciones_fecha',
            fields: [{ name: 'fecha_creacion', order: 'DESC' }],
          },
          {
            name: 'idx_notificaciones_leida',
            fields: [{ name: 'leida' }],
          },
          {
            name: 'idx_notificaciones_tipo',
            fields: [{ name: 'tipo' }],
          },
          {
            name: 'idx_notificaciones_usuario',
            fields: [{ name: 'usuario_id' }],
          },
          {
            name: 'notificaciones_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
  }
}
