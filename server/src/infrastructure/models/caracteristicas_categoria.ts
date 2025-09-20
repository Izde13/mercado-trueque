import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type {
  caracteristicas_producto,
  caracteristicas_productoId,
} from './caracteristicas_producto';
import type { categorias, categoriasId } from './categorias';

export interface caracteristicas_categoriaAttributes {
  id: string;
  categoria_id: string;
  nombre: string;
  tipo_dato?: string;
  requerido?: boolean;
  opciones?: object;
}

export type caracteristicas_categoriaPk = 'id';
export type caracteristicas_categoriaId =
  caracteristicas_categoria[caracteristicas_categoriaPk];
export type caracteristicas_categoriaOptionalAttributes =
  | 'id'
  | 'tipo_dato'
  | 'requerido'
  | 'opciones';
export type caracteristicas_categoriaCreationAttributes = Optional<
  caracteristicas_categoriaAttributes,
  caracteristicas_categoriaOptionalAttributes
>;

export class caracteristicas_categoria
  extends Model<
    caracteristicas_categoriaAttributes,
    caracteristicas_categoriaCreationAttributes
  >
  implements caracteristicas_categoriaAttributes
{
  id!: string;
  categoria_id!: string;
  nombre!: string;
  tipo_dato?: string;
  requerido?: boolean;
  opciones?: object;

  // caracteristicas_categoria hasMany caracteristicas_producto via caracteristica_id
  caracteristicas_productos!: caracteristicas_producto[];
  getCaracteristicas_productos!: Sequelize.HasManyGetAssociationsMixin<caracteristicas_producto>;
  setCaracteristicas_productos!: Sequelize.HasManySetAssociationsMixin<
    caracteristicas_producto,
    caracteristicas_productoId
  >;
  addCaracteristicas_producto!: Sequelize.HasManyAddAssociationMixin<
    caracteristicas_producto,
    caracteristicas_productoId
  >;
  addCaracteristicas_productos!: Sequelize.HasManyAddAssociationsMixin<
    caracteristicas_producto,
    caracteristicas_productoId
  >;
  createCaracteristicas_producto!: Sequelize.HasManyCreateAssociationMixin<caracteristicas_producto>;
  removeCaracteristicas_producto!: Sequelize.HasManyRemoveAssociationMixin<
    caracteristicas_producto,
    caracteristicas_productoId
  >;
  removeCaracteristicas_productos!: Sequelize.HasManyRemoveAssociationsMixin<
    caracteristicas_producto,
    caracteristicas_productoId
  >;
  hasCaracteristicas_producto!: Sequelize.HasManyHasAssociationMixin<
    caracteristicas_producto,
    caracteristicas_productoId
  >;
  hasCaracteristicas_productos!: Sequelize.HasManyHasAssociationsMixin<
    caracteristicas_producto,
    caracteristicas_productoId
  >;
  countCaracteristicas_productos!: Sequelize.HasManyCountAssociationsMixin;
  // caracteristicas_categoria belongsTo categorias via categoria_id
  categorium!: categorias;
  getCategorium!: Sequelize.BelongsToGetAssociationMixin<categorias>;
  setCategorium!: Sequelize.BelongsToSetAssociationMixin<
    categorias,
    categoriasId
  >;
  createCategorium!: Sequelize.BelongsToCreateAssociationMixin<categorias>;

  static initModel(
    sequelize: Sequelize.Sequelize,
  ): typeof caracteristicas_categoria {
    return caracteristicas_categoria.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn(
            'mercadotrueque.uuid_generate_v4',
          ),
          primaryKey: true,
        },
        categoria_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'categorias',
            key: 'id',
          },
          unique: 'caracteristicas_categoria_categoria_id_nombre_key',
        },
        nombre: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: 'caracteristicas_categoria_categoria_id_nombre_key',
        },
        tipo_dato: {
          type: DataTypes.STRING(20),
          allowNull: true,
          defaultValue: 'text',
        },
        requerido: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        opciones: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'caracteristicas_categoria',
        schema: 'mercadotrueque',
        timestamps: false,
        indexes: [
          {
            name: 'caracteristicas_categoria_categoria_id_nombre_key',
            unique: true,
            fields: [{ name: 'categoria_id' }, { name: 'nombre' }],
          },
          {
            name: 'caracteristicas_categoria_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'idx_caracteristicas_categoria',
            fields: [{ name: 'categoria_id' }],
          },
        ],
      },
    );
  }
}
