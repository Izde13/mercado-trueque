import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { usuarios, usuariosId } from './usuarios';

export interface historias_truequeAttributes {
  id: string;
  usuario_id: string;
  titulo: string;
  historia: string;
  imagen_url?: string;
  fecha_publicacion?: Date;
  activa?: boolean;
}

export type historias_truequePk = 'id';
export type historias_truequeId = historias_trueque[historias_truequePk];
export type historias_truequeOptionalAttributes =
  | 'id'
  | 'imagen_url'
  | 'fecha_publicacion'
  | 'activa';
export type historias_truequeCreationAttributes = Optional<
  historias_truequeAttributes,
  historias_truequeOptionalAttributes
>;

export class historias_trueque
  extends Model<
    historias_truequeAttributes,
    historias_truequeCreationAttributes
  >
  implements historias_truequeAttributes
{
  id!: string;
  usuario_id!: string;
  titulo!: string;
  historia!: string;
  imagen_url?: string;
  fecha_publicacion?: Date;
  activa?: boolean;

  // historias_trueque belongsTo usuarios via usuario_id
  usuario!: usuarios;
  getUsuario!: Sequelize.BelongsToGetAssociationMixin<usuarios>;
  setUsuario!: Sequelize.BelongsToSetAssociationMixin<usuarios, usuariosId>;
  createUsuario!: Sequelize.BelongsToCreateAssociationMixin<usuarios>;

  static initModel(sequelize: Sequelize.Sequelize): typeof historias_trueque {
    return historias_trueque.init(
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
        titulo: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        historia: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        imagen_url: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        fecha_publicacion: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        activa: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
      },
      {
        sequelize,
        tableName: 'historias_trueque',
        schema: 'mercadotrueque',
        timestamps: false,
        indexes: [
          {
            name: 'historias_trueque_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
  }
}
