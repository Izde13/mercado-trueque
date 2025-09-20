import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { intercambios, intercambiosId } from './intercambios';

export interface centros_distribucionAttributes {
  id: string;
  codigo: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  telefono?: string;
  email?: string;
  activo?: boolean;
  capacidad_maxima?: number;
}

export type centros_distribucionPk = 'id';
export type centros_distribucionId =
  centros_distribucion[centros_distribucionPk];
export type centros_distribucionOptionalAttributes =
  | 'id'
  | 'codigo'
  | 'telefono'
  | 'email'
  | 'activo'
  | 'capacidad_maxima';
export type centros_distribucionCreationAttributes = Optional<
  centros_distribucionAttributes,
  centros_distribucionOptionalAttributes
>;

export class centros_distribucion
  extends Model<
    centros_distribucionAttributes,
    centros_distribucionCreationAttributes
  >
  implements centros_distribucionAttributes
{
  id!: string;
  codigo!: number;
  nombre!: string;
  direccion!: string;
  ciudad!: string;
  departamento!: string;
  telefono?: string;
  email?: string;
  activo?: boolean;
  capacidad_maxima?: number;

  // centros_distribucion hasMany intercambios via centro_distribucion_id
  intercambios!: intercambios[];
  getIntercambios!: Sequelize.HasManyGetAssociationsMixin<intercambios>;
  setIntercambios!: Sequelize.HasManySetAssociationsMixin<
    intercambios,
    intercambiosId
  >;
  addIntercambio!: Sequelize.HasManyAddAssociationMixin<
    intercambios,
    intercambiosId
  >;
  addIntercambios!: Sequelize.HasManyAddAssociationsMixin<
    intercambios,
    intercambiosId
  >;
  createIntercambio!: Sequelize.HasManyCreateAssociationMixin<intercambios>;
  removeIntercambio!: Sequelize.HasManyRemoveAssociationMixin<
    intercambios,
    intercambiosId
  >;
  removeIntercambios!: Sequelize.HasManyRemoveAssociationsMixin<
    intercambios,
    intercambiosId
  >;
  hasIntercambio!: Sequelize.HasManyHasAssociationMixin<
    intercambios,
    intercambiosId
  >;
  hasIntercambios!: Sequelize.HasManyHasAssociationsMixin<
    intercambios,
    intercambiosId
  >;
  countIntercambios!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(
    sequelize: Sequelize.Sequelize,
  ): typeof centros_distribucion {
    return centros_distribucion.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn(
            'mercadotrueque.uuid_generate_v4',
          ),
          primaryKey: true,
        },
        codigo: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: 'centros_distribucion_codigo_key',
        },
        nombre: {
          type: DataTypes.STRING(100),
          allowNull: false,
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
        telefono: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        activo: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
        capacidad_maxima: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 100,
        },
      },
      {
        sequelize,
        tableName: 'centros_distribucion',
        schema: 'mercadotrueque',
        timestamps: false,
        indexes: [
          {
            name: 'centros_distribucion_codigo_key',
            unique: true,
            fields: [{ name: 'codigo' }],
          },
          {
            name: 'centros_distribucion_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
  }
}
