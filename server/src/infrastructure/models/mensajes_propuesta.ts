import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type {
  propuestas_trueque,
  propuestas_truequeId,
} from './propuestas_trueque';
import type { usuarios, usuariosId } from './usuarios';

export interface mensajes_propuestaAttributes {
  id: string;
  propuesta_id: string;
  usuario_id: string;
  mensaje: string;
  fecha_mensaje?: Date;
}

export type mensajes_propuestaPk = 'id';
export type mensajes_propuestaId = mensajes_propuesta[mensajes_propuestaPk];
export type mensajes_propuestaOptionalAttributes = 'id' | 'fecha_mensaje';
export type mensajes_propuestaCreationAttributes = Optional<
  mensajes_propuestaAttributes,
  mensajes_propuestaOptionalAttributes
>;

export class mensajes_propuesta
  extends Model<
    mensajes_propuestaAttributes,
    mensajes_propuestaCreationAttributes
  >
  implements mensajes_propuestaAttributes
{
  id!: string;
  propuesta_id!: string;
  usuario_id!: string;
  mensaje!: string;
  fecha_mensaje?: Date;

  // mensajes_propuesta belongsTo propuestas_trueque via propuesta_id
  propuestum!: propuestas_trueque;
  getPropuestum!: Sequelize.BelongsToGetAssociationMixin<propuestas_trueque>;
  setPropuestum!: Sequelize.BelongsToSetAssociationMixin<
    propuestas_trueque,
    propuestas_truequeId
  >;
  createPropuestum!: Sequelize.BelongsToCreateAssociationMixin<propuestas_trueque>;
  // mensajes_propuesta belongsTo usuarios via usuario_id
  usuario!: usuarios;
  getUsuario!: Sequelize.BelongsToGetAssociationMixin<usuarios>;
  setUsuario!: Sequelize.BelongsToSetAssociationMixin<usuarios, usuariosId>;
  createUsuario!: Sequelize.BelongsToCreateAssociationMixin<usuarios>;

  static initModel(sequelize: Sequelize.Sequelize): typeof mensajes_propuesta {
    return mensajes_propuesta.init(
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
        usuario_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'usuarios',
            key: 'id',
          },
        },
        mensaje: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        fecha_mensaje: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      {
        sequelize,
        tableName: 'mensajes_propuesta',
        schema: 'mercadotrueque',
        timestamps: false,
        indexes: [
          {
            name: 'mensajes_propuesta_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
  }
}
