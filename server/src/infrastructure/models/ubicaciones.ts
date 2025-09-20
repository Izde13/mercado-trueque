import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { usuarios, usuariosId } from './usuarios';

export interface ubicacionesAttributes {
  id: string;
  usuario_id: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  codigo_postal?: string;
  nombre_contacto: string;
  telefono_contacto?: string;
  es_principal?: boolean;
  activa?: boolean;
}

export type ubicacionesPk = 'id';
export type ubicacionesId = ubicaciones[ubicacionesPk];
export type ubicacionesOptionalAttributes =
  | 'id'
  | 'codigo_postal'
  | 'telefono_contacto'
  | 'es_principal'
  | 'activa';
export type ubicacionesCreationAttributes = Optional<
  ubicacionesAttributes,
  ubicacionesOptionalAttributes
>;

export class ubicaciones
  extends Model<ubicacionesAttributes, ubicacionesCreationAttributes>
  implements ubicacionesAttributes
{
  id!: string;
  usuario_id!: string;
  direccion!: string;
  ciudad!: string;
  departamento!: string;
  codigo_postal?: string;
  nombre_contacto!: string;
  telefono_contacto?: string;
  es_principal?: boolean;
  activa?: boolean;

  // ubicaciones belongsTo usuarios via usuario_id
  usuario!: usuarios;
  getUsuario!: Sequelize.BelongsToGetAssociationMixin<usuarios>;
  setUsuario!: Sequelize.BelongsToSetAssociationMixin<usuarios, usuariosId>;
  createUsuario!: Sequelize.BelongsToCreateAssociationMixin<usuarios>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ubicaciones {
    return ubicaciones.init(
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
        direccion: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        ciudad: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        departamento: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        codigo_postal: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
        nombre_contacto: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        telefono_contacto: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        es_principal: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        activa: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
      },
      {
        sequelize,
        tableName: 'ubicaciones',
        schema: 'mercadotrueque',
        timestamps: false,
        indexes: [
          {
            name: 'idx_ubicaciones_ciudad',
            fields: [{ name: 'ciudad' }],
          },
          {
            name: 'idx_ubicaciones_usuario',
            fields: [{ name: 'usuario_id' }],
          },
          {
            name: 'ubicaciones_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
  }
}
