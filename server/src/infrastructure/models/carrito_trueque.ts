import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { productos, productosId } from './productos';
import type { usuarios, usuariosId } from './usuarios';

export interface carrito_truequeAttributes {
  id: string;
  usuario_id: string;
  producto_id: string;
  fecha_agregado?: Date;
}

export type carrito_truequePk = 'id';
export type carrito_truequeId = carrito_trueque[carrito_truequePk];
export type carrito_truequeOptionalAttributes = 'id' | 'fecha_agregado';
export type carrito_truequeCreationAttributes = Optional<
  carrito_truequeAttributes,
  carrito_truequeOptionalAttributes
>;

export class carrito_trueque
  extends Model<carrito_truequeAttributes, carrito_truequeCreationAttributes>
  implements carrito_truequeAttributes
{
  id!: string;
  usuario_id!: string;
  producto_id!: string;
  fecha_agregado?: Date;

  // carrito_trueque belongsTo productos via producto_id
  producto!: productos;
  getProducto!: Sequelize.BelongsToGetAssociationMixin<productos>;
  setProducto!: Sequelize.BelongsToSetAssociationMixin<productos, productosId>;
  createProducto!: Sequelize.BelongsToCreateAssociationMixin<productos>;
  // carrito_trueque belongsTo usuarios via usuario_id
  usuario!: usuarios;
  getUsuario!: Sequelize.BelongsToGetAssociationMixin<usuarios>;
  setUsuario!: Sequelize.BelongsToSetAssociationMixin<usuarios, usuariosId>;
  createUsuario!: Sequelize.BelongsToCreateAssociationMixin<usuarios>;

  static initModel(sequelize: Sequelize.Sequelize): typeof carrito_trueque {
    return carrito_trueque.init(
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
          unique: 'carrito_trueque_usuario_id_producto_id_key',
        },
        producto_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'productos',
            key: 'id',
          },
          unique: 'carrito_trueque_usuario_id_producto_id_key',
        },
        fecha_agregado: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      {
        sequelize,
        tableName: 'carrito_trueque',
        schema: 'mercadotrueque',
        timestamps: false,
        indexes: [
          {
            name: 'carrito_trueque_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'carrito_trueque_usuario_id_producto_id_key',
            unique: true,
            fields: [{ name: 'usuario_id' }, { name: 'producto_id' }],
          },
          {
            name: 'idx_carrito_producto',
            fields: [{ name: 'producto_id' }],
          },
          {
            name: 'idx_carrito_usuario',
            fields: [{ name: 'usuario_id' }],
          },
        ],
      },
    );
  }
}
