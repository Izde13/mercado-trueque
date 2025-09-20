import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type {
  preguntas_productos,
  preguntas_productosId,
} from './preguntas_productos';
import type { usuarios, usuariosId } from './usuarios';

export interface respuestas_preguntasAttributes {
  id: string;
  pregunta_id: string;
  usuario_id: string;
  respuesta: string;
  fecha_respuesta?: Date;
}

export type respuestas_preguntasPk = 'id';
export type respuestas_preguntasId =
  respuestas_preguntas[respuestas_preguntasPk];
export type respuestas_preguntasOptionalAttributes = 'id' | 'fecha_respuesta';
export type respuestas_preguntasCreationAttributes = Optional<
  respuestas_preguntasAttributes,
  respuestas_preguntasOptionalAttributes
>;

export class respuestas_preguntas
  extends Model<
    respuestas_preguntasAttributes,
    respuestas_preguntasCreationAttributes
  >
  implements respuestas_preguntasAttributes
{
  id!: string;
  pregunta_id!: string;
  usuario_id!: string;
  respuesta!: string;
  fecha_respuesta?: Date;

  // respuestas_preguntas belongsTo preguntas_productos via pregunta_id
  preguntum!: preguntas_productos;
  getPreguntum!: Sequelize.BelongsToGetAssociationMixin<preguntas_productos>;
  setPreguntum!: Sequelize.BelongsToSetAssociationMixin<
    preguntas_productos,
    preguntas_productosId
  >;
  createPreguntum!: Sequelize.BelongsToCreateAssociationMixin<preguntas_productos>;
  // respuestas_preguntas belongsTo usuarios via usuario_id
  usuario!: usuarios;
  getUsuario!: Sequelize.BelongsToGetAssociationMixin<usuarios>;
  setUsuario!: Sequelize.BelongsToSetAssociationMixin<usuarios, usuariosId>;
  createUsuario!: Sequelize.BelongsToCreateAssociationMixin<usuarios>;

  static initModel(
    sequelize: Sequelize.Sequelize,
  ): typeof respuestas_preguntas {
    return respuestas_preguntas.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn(
            'mercadotrueque.uuid_generate_v4',
          ),
          primaryKey: true,
        },
        pregunta_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'preguntas_productos',
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
        respuesta: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        fecha_respuesta: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      {
        sequelize,
        tableName: 'respuestas_preguntas',
        schema: 'mercadotrueque',
        timestamps: false,
        indexes: [
          {
            name: 'respuestas_preguntas_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
  }
}
