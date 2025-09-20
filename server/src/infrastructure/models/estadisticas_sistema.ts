import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface estadisticas_sistemaAttributes {
  id: string;
  fecha: string;
  articulos_disponibles?: number;
  usuarios_activos?: number;
  trueques_completados?: number;
}

export type estadisticas_sistemaPk = 'id';
export type estadisticas_sistemaId =
  estadisticas_sistema[estadisticas_sistemaPk];
export type estadisticas_sistemaOptionalAttributes =
  | 'id'
  | 'articulos_disponibles'
  | 'usuarios_activos'
  | 'trueques_completados';
export type estadisticas_sistemaCreationAttributes = Optional<
  estadisticas_sistemaAttributes,
  estadisticas_sistemaOptionalAttributes
>;

export class estadisticas_sistema
  extends Model<
    estadisticas_sistemaAttributes,
    estadisticas_sistemaCreationAttributes
  >
  implements estadisticas_sistemaAttributes
{
  id!: string;
  fecha!: string;
  articulos_disponibles?: number;
  usuarios_activos?: number;
  trueques_completados?: number;

  static initModel(
    sequelize: Sequelize.Sequelize,
  ): typeof estadisticas_sistema {
    return estadisticas_sistema.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn(
            'mercadotrueque.uuid_generate_v4',
          ),
          primaryKey: true,
        },
        fecha: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          unique: 'estadisticas_sistema_fecha_key',
        },
        articulos_disponibles: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        usuarios_activos: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        trueques_completados: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        tableName: 'estadisticas_sistema',
        schema: 'mercadotrueque',
        timestamps: false,
        indexes: [
          {
            name: 'estadisticas_sistema_fecha_key',
            unique: true,
            fields: [{ name: 'fecha' }],
          },
          {
            name: 'estadisticas_sistema_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
  }
}
