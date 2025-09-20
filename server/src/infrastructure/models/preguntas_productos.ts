import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { productos, productosId } from './productos';
import type {
  respuestas_preguntas,
  respuestas_preguntasId,
} from './respuestas_preguntas';
import type { usuarios, usuariosId } from './usuarios';

export interface preguntas_productosAttributes {
  id: string;
  producto_id: string;
  usuario_id: string;
  pregunta: string;
  fecha_pregunta?: Date;
  activa?: boolean;
}

export type preguntas_productosPk = 'id';
export type preguntas_productosId = preguntas_productos[preguntas_productosPk];
export type preguntas_productosOptionalAttributes =
  | 'id'
  | 'fecha_pregunta'
  | 'activa';
export type preguntas_productosCreationAttributes = Optional<
  preguntas_productosAttributes,
  preguntas_productosOptionalAttributes
>;

export class preguntas_productos
  extends Model<
    preguntas_productosAttributes,
    preguntas_productosCreationAttributes
  >
  implements preguntas_productosAttributes
{
  id!: string;
  producto_id!: string;
  usuario_id!: string;
  pregunta!: string;
  fecha_pregunta?: Date;
  activa?: boolean;

  // preguntas_productos hasMany respuestas_preguntas via pregunta_id
  respuestas_pregunta!: respuestas_preguntas[];
  getRespuestas_pregunta!: Sequelize.HasManyGetAssociationsMixin<respuestas_preguntas>;
  setRespuestas_pregunta!: Sequelize.HasManySetAssociationsMixin<
    respuestas_preguntas,
    respuestas_preguntasId
  >;
  addRespuestas_preguntum!: Sequelize.HasManyAddAssociationMixin<
    respuestas_preguntas,
    respuestas_preguntasId
  >;
  addRespuestas_pregunta!: Sequelize.HasManyAddAssociationsMixin<
    respuestas_preguntas,
    respuestas_preguntasId
  >;
  createRespuestas_preguntum!: Sequelize.HasManyCreateAssociationMixin<respuestas_preguntas>;
  removeRespuestas_preguntum!: Sequelize.HasManyRemoveAssociationMixin<
    respuestas_preguntas,
    respuestas_preguntasId
  >;
  removeRespuestas_pregunta!: Sequelize.HasManyRemoveAssociationsMixin<
    respuestas_preguntas,
    respuestas_preguntasId
  >;
  hasRespuestas_preguntum!: Sequelize.HasManyHasAssociationMixin<
    respuestas_preguntas,
    respuestas_preguntasId
  >;
  hasRespuestas_pregunta!: Sequelize.HasManyHasAssociationsMixin<
    respuestas_preguntas,
    respuestas_preguntasId
  >;
  countRespuestas_pregunta!: Sequelize.HasManyCountAssociationsMixin;
  // preguntas_productos belongsTo productos via producto_id
  producto!: productos;
  getProducto!: Sequelize.BelongsToGetAssociationMixin<productos>;
  setProducto!: Sequelize.BelongsToSetAssociationMixin<productos, productosId>;
  createProducto!: Sequelize.BelongsToCreateAssociationMixin<productos>;
  // preguntas_productos belongsTo usuarios via usuario_id
  usuario!: usuarios;
  getUsuario!: Sequelize.BelongsToGetAssociationMixin<usuarios>;
  setUsuario!: Sequelize.BelongsToSetAssociationMixin<usuarios, usuariosId>;
  createUsuario!: Sequelize.BelongsToCreateAssociationMixin<usuarios>;

  static initModel(sequelize: Sequelize.Sequelize): typeof preguntas_productos {
    return preguntas_productos.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn(
            'mercadotrueque.uuid_generate_v4',
          ),
          primaryKey: true,
        },
        producto_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'productos',
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
        pregunta: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        fecha_pregunta: {
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
        tableName: 'preguntas_productos',
        schema: 'mercadotrueque',
        timestamps: false,
        indexes: [
          {
            name: 'idx_preguntas_fecha',
            fields: [{ name: 'fecha_pregunta', order: 'DESC' }],
          },
          {
            name: 'idx_preguntas_producto',
            fields: [{ name: 'producto_id' }],
          },
          {
            name: 'idx_preguntas_usuario',
            fields: [{ name: 'usuario_id' }],
          },
          {
            name: 'preguntas_productos_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
  }
}
