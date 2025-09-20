import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { productos, productosId } from './productos';
import type {
  propuestas_trueque,
  propuestas_truequeId,
} from './propuestas_trueque';

export interface productos_propuestaAttributes {
  id: string;
  propuesta_id: string;
  producto_id: string;
  orden?: number;
}

export type productos_propuestaPk = 'id';
export type productos_propuestaId = productos_propuesta[productos_propuestaPk];
export type productos_propuestaOptionalAttributes = 'id' | 'orden';
export type productos_propuestaCreationAttributes = Optional<
  productos_propuestaAttributes,
  productos_propuestaOptionalAttributes
>;

export class productos_propuesta
  extends Model<
    productos_propuestaAttributes,
    productos_propuestaCreationAttributes
  >
  implements productos_propuestaAttributes
{
  id!: string;
  propuesta_id!: string;
  producto_id!: string;
  orden?: number;

  // productos_propuesta belongsTo productos via producto_id
  producto!: productos;
  getProducto!: Sequelize.BelongsToGetAssociationMixin<productos>;
  setProducto!: Sequelize.BelongsToSetAssociationMixin<productos, productosId>;
  createProducto!: Sequelize.BelongsToCreateAssociationMixin<productos>;
  // productos_propuesta belongsTo propuestas_trueque via propuesta_id
  propuestum!: propuestas_trueque;
  getPropuestum!: Sequelize.BelongsToGetAssociationMixin<propuestas_trueque>;
  setPropuestum!: Sequelize.BelongsToSetAssociationMixin<
    propuestas_trueque,
    propuestas_truequeId
  >;
  createPropuestum!: Sequelize.BelongsToCreateAssociationMixin<propuestas_trueque>;

  static initModel(sequelize: Sequelize.Sequelize): typeof productos_propuesta {
    return productos_propuesta.init(
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
          unique: 'productos_propuesta_propuesta_id_producto_id_key',
        },
        producto_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'productos',
            key: 'id',
          },
          unique: 'productos_propuesta_propuesta_id_producto_id_key',
        },
        orden: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        tableName: 'productos_propuesta',
        schema: 'mercadotrueque',
        timestamps: false,
        indexes: [
          {
            name: 'productos_propuesta_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'productos_propuesta_propuesta_id_producto_id_key',
            unique: true,
            fields: [{ name: 'propuesta_id' }, { name: 'producto_id' }],
          },
        ],
      },
    );
  }
}
