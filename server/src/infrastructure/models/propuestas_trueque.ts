import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { intercambios, intercambiosId } from './intercambios';
import type {
  mensajes_propuesta,
  mensajes_propuestaId,
} from './mensajes_propuesta';
import type { productos, productosId } from './productos';
import type {
  productos_propuesta,
  productos_propuestaId,
} from './productos_propuesta';
import type { usuarios, usuariosId } from './usuarios';

export interface propuestas_truequeAttributes {
  id: string;
  producto_solicitado_id: string;
  usuario_oferente_id: string;
  mensaje?: string;
  fecha_propuesta?: Date;
  estado?: string;
  fecha_respuesta?: Date;
}

export type propuestas_truequePk = 'id';
export type propuestas_truequeId = propuestas_trueque[propuestas_truequePk];
export type propuestas_truequeOptionalAttributes =
  | 'id'
  | 'mensaje'
  | 'fecha_propuesta'
  | 'estado'
  | 'fecha_respuesta';
export type propuestas_truequeCreationAttributes = Optional<
  propuestas_truequeAttributes,
  propuestas_truequeOptionalAttributes
>;

export class propuestas_trueque
  extends Model<
    propuestas_truequeAttributes,
    propuestas_truequeCreationAttributes
  >
  implements propuestas_truequeAttributes
{
  id!: string;
  producto_solicitado_id!: string;
  usuario_oferente_id!: string;
  mensaje?: string;
  fecha_propuesta?: Date;
  estado?: string;
  fecha_respuesta?: Date;

  // propuestas_trueque belongsTo productos via producto_solicitado_id
  producto_solicitado!: productos;
  getProducto_solicitado!: Sequelize.BelongsToGetAssociationMixin<productos>;
  setProducto_solicitado!: Sequelize.BelongsToSetAssociationMixin<
    productos,
    productosId
  >;
  createProducto_solicitado!: Sequelize.BelongsToCreateAssociationMixin<productos>;
  // propuestas_trueque hasMany intercambios via propuesta_id
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
  // propuestas_trueque hasMany mensajes_propuesta via propuesta_id
  mensajes_propuesta!: mensajes_propuesta[];
  getMensajes_propuesta!: Sequelize.HasManyGetAssociationsMixin<mensajes_propuesta>;
  setMensajes_propuesta!: Sequelize.HasManySetAssociationsMixin<
    mensajes_propuesta,
    mensajes_propuestaId
  >;
  addMensajes_propuestum!: Sequelize.HasManyAddAssociationMixin<
    mensajes_propuesta,
    mensajes_propuestaId
  >;
  addMensajes_propuesta!: Sequelize.HasManyAddAssociationsMixin<
    mensajes_propuesta,
    mensajes_propuestaId
  >;
  createMensajes_propuestum!: Sequelize.HasManyCreateAssociationMixin<mensajes_propuesta>;
  removeMensajes_propuestum!: Sequelize.HasManyRemoveAssociationMixin<
    mensajes_propuesta,
    mensajes_propuestaId
  >;
  removeMensajes_propuesta!: Sequelize.HasManyRemoveAssociationsMixin<
    mensajes_propuesta,
    mensajes_propuestaId
  >;
  hasMensajes_propuestum!: Sequelize.HasManyHasAssociationMixin<
    mensajes_propuesta,
    mensajes_propuestaId
  >;
  hasMensajes_propuesta!: Sequelize.HasManyHasAssociationsMixin<
    mensajes_propuesta,
    mensajes_propuestaId
  >;
  countMensajes_propuesta!: Sequelize.HasManyCountAssociationsMixin;
  // propuestas_trueque hasMany productos_propuesta via propuesta_id
  productos_propuesta!: productos_propuesta[];
  getProductos_propuesta!: Sequelize.HasManyGetAssociationsMixin<productos_propuesta>;
  setProductos_propuesta!: Sequelize.HasManySetAssociationsMixin<
    productos_propuesta,
    productos_propuestaId
  >;
  addProductos_propuestum!: Sequelize.HasManyAddAssociationMixin<
    productos_propuesta,
    productos_propuestaId
  >;
  addProductos_propuesta!: Sequelize.HasManyAddAssociationsMixin<
    productos_propuesta,
    productos_propuestaId
  >;
  createProductos_propuestum!: Sequelize.HasManyCreateAssociationMixin<productos_propuesta>;
  removeProductos_propuestum!: Sequelize.HasManyRemoveAssociationMixin<
    productos_propuesta,
    productos_propuestaId
  >;
  removeProductos_propuesta!: Sequelize.HasManyRemoveAssociationsMixin<
    productos_propuesta,
    productos_propuestaId
  >;
  hasProductos_propuestum!: Sequelize.HasManyHasAssociationMixin<
    productos_propuesta,
    productos_propuestaId
  >;
  hasProductos_propuesta!: Sequelize.HasManyHasAssociationsMixin<
    productos_propuesta,
    productos_propuestaId
  >;
  countProductos_propuesta!: Sequelize.HasManyCountAssociationsMixin;
  // propuestas_trueque belongsTo usuarios via usuario_oferente_id
  usuario_oferente!: usuarios;
  getUsuario_oferente!: Sequelize.BelongsToGetAssociationMixin<usuarios>;
  setUsuario_oferente!: Sequelize.BelongsToSetAssociationMixin<
    usuarios,
    usuariosId
  >;
  createUsuario_oferente!: Sequelize.BelongsToCreateAssociationMixin<usuarios>;

  static initModel(sequelize: Sequelize.Sequelize): typeof propuestas_trueque {
    return propuestas_trueque.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn(
            'mercadotrueque.uuid_generate_v4',
          ),
          primaryKey: true,
        },
        producto_solicitado_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'productos',
            key: 'id',
          },
        },
        usuario_oferente_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'usuarios',
            key: 'id',
          },
        },
        mensaje: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        fecha_propuesta: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        estado: {
          type: DataTypes.STRING(20),
          allowNull: true,
          defaultValue: 'pendiente',
        },
        fecha_respuesta: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'propuestas_trueque',
        schema: 'mercadotrueque',
        timestamps: false,
        indexes: [
          {
            name: 'idx_propuestas_estado',
            fields: [{ name: 'estado' }],
          },
          {
            name: 'idx_propuestas_fecha',
            fields: [{ name: 'fecha_propuesta', order: 'DESC' }],
          },
          {
            name: 'idx_propuestas_oferente',
            fields: [{ name: 'usuario_oferente_id' }],
          },
          {
            name: 'idx_propuestas_solicitado',
            fields: [{ name: 'producto_solicitado_id' }],
          },
          {
            name: 'propuestas_trueque_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
  }
}
