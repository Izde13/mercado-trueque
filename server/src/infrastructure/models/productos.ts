import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type {
  alertas_activadas,
  alertas_activadasId,
} from './alertas_activadas';
import type {
  caracteristicas_producto,
  caracteristicas_productoId,
} from './caracteristicas_producto';
import type { carrito_trueque, carrito_truequeId } from './carrito_trueque';
import type { categorias, categoriasId } from './categorias';
import type { envios, enviosId } from './envios';
import type {
  imagenes_producto,
  imagenes_productoId,
} from './imagenes_producto';
import type {
  preguntas_productos,
  preguntas_productosId,
} from './preguntas_productos';
import type {
  productos_propuesta,
  productos_propuestaId,
} from './productos_propuesta';
import type {
  propuestas_trueque,
  propuestas_truequeId,
} from './propuestas_trueque';
import type {
  revision_productos,
  revision_productosId,
} from './revision_productos';
import type { usuarios, usuariosId } from './usuarios';

export interface productosAttributes {
  id: string;
  usuario_id: string;
  categoria_id: string;
  titulo: string;
  descripcion?: string;
  estado_producto?: number;
  valor_estimado?: number;
  fecha_publicacion?: Date;
  estado_publicacion?: string;
  imagen_principal?: string;
  vistas?: number;
  popularidad?: number;
}

export type productosPk = 'id';
export type productosId = productos[productosPk];
export type productosOptionalAttributes =
  | 'id'
  | 'descripcion'
  | 'estado_producto'
  | 'valor_estimado'
  | 'fecha_publicacion'
  | 'estado_publicacion'
  | 'imagen_principal'
  | 'vistas'
  | 'popularidad';
export type productosCreationAttributes = Optional<
  productosAttributes,
  productosOptionalAttributes
>;

export class productos
  extends Model<productosAttributes, productosCreationAttributes>
  implements productosAttributes
{
  id!: string;
  usuario_id!: string;
  categoria_id!: string;
  titulo!: string;
  descripcion?: string;
  estado_producto?: number;
  valor_estimado?: number;
  fecha_publicacion?: Date;
  estado_publicacion?: string;
  imagen_principal?: string;
  vistas?: number;
  popularidad?: number;

  // productos belongsTo categorias via categoria_id
  categorium!: categorias;
  getCategorium!: Sequelize.BelongsToGetAssociationMixin<categorias>;
  setCategorium!: Sequelize.BelongsToSetAssociationMixin<
    categorias,
    categoriasId
  >;
  createCategorium!: Sequelize.BelongsToCreateAssociationMixin<categorias>;
  // productos hasMany alertas_activadas via producto_id
  alertas_activadas!: alertas_activadas[];
  getAlertas_activadas!: Sequelize.HasManyGetAssociationsMixin<alertas_activadas>;
  setAlertas_activadas!: Sequelize.HasManySetAssociationsMixin<
    alertas_activadas,
    alertas_activadasId
  >;
  addAlertas_activada!: Sequelize.HasManyAddAssociationMixin<
    alertas_activadas,
    alertas_activadasId
  >;
  addAlertas_activadas!: Sequelize.HasManyAddAssociationsMixin<
    alertas_activadas,
    alertas_activadasId
  >;
  createAlertas_activada!: Sequelize.HasManyCreateAssociationMixin<alertas_activadas>;
  removeAlertas_activada!: Sequelize.HasManyRemoveAssociationMixin<
    alertas_activadas,
    alertas_activadasId
  >;
  removeAlertas_activadas!: Sequelize.HasManyRemoveAssociationsMixin<
    alertas_activadas,
    alertas_activadasId
  >;
  hasAlertas_activada!: Sequelize.HasManyHasAssociationMixin<
    alertas_activadas,
    alertas_activadasId
  >;
  hasAlertas_activadas!: Sequelize.HasManyHasAssociationsMixin<
    alertas_activadas,
    alertas_activadasId
  >;
  countAlertas_activadas!: Sequelize.HasManyCountAssociationsMixin;
  // productos hasMany caracteristicas_producto via producto_id
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
  // productos hasMany carrito_trueque via producto_id
  carrito_trueques!: carrito_trueque[];
  getCarrito_trueques!: Sequelize.HasManyGetAssociationsMixin<carrito_trueque>;
  setCarrito_trueques!: Sequelize.HasManySetAssociationsMixin<
    carrito_trueque,
    carrito_truequeId
  >;
  addCarrito_trueque!: Sequelize.HasManyAddAssociationMixin<
    carrito_trueque,
    carrito_truequeId
  >;
  addCarrito_trueques!: Sequelize.HasManyAddAssociationsMixin<
    carrito_trueque,
    carrito_truequeId
  >;
  createCarrito_trueque!: Sequelize.HasManyCreateAssociationMixin<carrito_trueque>;
  removeCarrito_trueque!: Sequelize.HasManyRemoveAssociationMixin<
    carrito_trueque,
    carrito_truequeId
  >;
  removeCarrito_trueques!: Sequelize.HasManyRemoveAssociationsMixin<
    carrito_trueque,
    carrito_truequeId
  >;
  hasCarrito_trueque!: Sequelize.HasManyHasAssociationMixin<
    carrito_trueque,
    carrito_truequeId
  >;
  hasCarrito_trueques!: Sequelize.HasManyHasAssociationsMixin<
    carrito_trueque,
    carrito_truequeId
  >;
  countCarrito_trueques!: Sequelize.HasManyCountAssociationsMixin;
  // productos hasMany envios via producto_id
  envios!: envios[];
  getEnvios!: Sequelize.HasManyGetAssociationsMixin<envios>;
  setEnvios!: Sequelize.HasManySetAssociationsMixin<envios, enviosId>;
  addEnvio!: Sequelize.HasManyAddAssociationMixin<envios, enviosId>;
  addEnvios!: Sequelize.HasManyAddAssociationsMixin<envios, enviosId>;
  createEnvio!: Sequelize.HasManyCreateAssociationMixin<envios>;
  removeEnvio!: Sequelize.HasManyRemoveAssociationMixin<envios, enviosId>;
  removeEnvios!: Sequelize.HasManyRemoveAssociationsMixin<envios, enviosId>;
  hasEnvio!: Sequelize.HasManyHasAssociationMixin<envios, enviosId>;
  hasEnvios!: Sequelize.HasManyHasAssociationsMixin<envios, enviosId>;
  countEnvios!: Sequelize.HasManyCountAssociationsMixin;
  // productos hasMany imagenes_producto via producto_id
  imagenes_productos!: imagenes_producto[];
  getImagenes_productos!: Sequelize.HasManyGetAssociationsMixin<imagenes_producto>;
  setImagenes_productos!: Sequelize.HasManySetAssociationsMixin<
    imagenes_producto,
    imagenes_productoId
  >;
  addImagenes_producto!: Sequelize.HasManyAddAssociationMixin<
    imagenes_producto,
    imagenes_productoId
  >;
  addImagenes_productos!: Sequelize.HasManyAddAssociationsMixin<
    imagenes_producto,
    imagenes_productoId
  >;
  createImagenes_producto!: Sequelize.HasManyCreateAssociationMixin<imagenes_producto>;
  removeImagenes_producto!: Sequelize.HasManyRemoveAssociationMixin<
    imagenes_producto,
    imagenes_productoId
  >;
  removeImagenes_productos!: Sequelize.HasManyRemoveAssociationsMixin<
    imagenes_producto,
    imagenes_productoId
  >;
  hasImagenes_producto!: Sequelize.HasManyHasAssociationMixin<
    imagenes_producto,
    imagenes_productoId
  >;
  hasImagenes_productos!: Sequelize.HasManyHasAssociationsMixin<
    imagenes_producto,
    imagenes_productoId
  >;
  countImagenes_productos!: Sequelize.HasManyCountAssociationsMixin;
  // productos hasMany preguntas_productos via producto_id
  preguntas_productos!: preguntas_productos[];
  getPreguntas_productos!: Sequelize.HasManyGetAssociationsMixin<preguntas_productos>;
  setPreguntas_productos!: Sequelize.HasManySetAssociationsMixin<
    preguntas_productos,
    preguntas_productosId
  >;
  addPreguntas_producto!: Sequelize.HasManyAddAssociationMixin<
    preguntas_productos,
    preguntas_productosId
  >;
  addPreguntas_productos!: Sequelize.HasManyAddAssociationsMixin<
    preguntas_productos,
    preguntas_productosId
  >;
  createPreguntas_producto!: Sequelize.HasManyCreateAssociationMixin<preguntas_productos>;
  removePreguntas_producto!: Sequelize.HasManyRemoveAssociationMixin<
    preguntas_productos,
    preguntas_productosId
  >;
  removePreguntas_productos!: Sequelize.HasManyRemoveAssociationsMixin<
    preguntas_productos,
    preguntas_productosId
  >;
  hasPreguntas_producto!: Sequelize.HasManyHasAssociationMixin<
    preguntas_productos,
    preguntas_productosId
  >;
  hasPreguntas_productos!: Sequelize.HasManyHasAssociationsMixin<
    preguntas_productos,
    preguntas_productosId
  >;
  countPreguntas_productos!: Sequelize.HasManyCountAssociationsMixin;
  // productos hasMany productos_propuesta via producto_id
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
  // productos hasMany propuestas_trueque via producto_solicitado_id
  propuestas_trueques!: propuestas_trueque[];
  getPropuestas_trueques!: Sequelize.HasManyGetAssociationsMixin<propuestas_trueque>;
  setPropuestas_trueques!: Sequelize.HasManySetAssociationsMixin<
    propuestas_trueque,
    propuestas_truequeId
  >;
  addPropuestas_trueque!: Sequelize.HasManyAddAssociationMixin<
    propuestas_trueque,
    propuestas_truequeId
  >;
  addPropuestas_trueques!: Sequelize.HasManyAddAssociationsMixin<
    propuestas_trueque,
    propuestas_truequeId
  >;
  createPropuestas_trueque!: Sequelize.HasManyCreateAssociationMixin<propuestas_trueque>;
  removePropuestas_trueque!: Sequelize.HasManyRemoveAssociationMixin<
    propuestas_trueque,
    propuestas_truequeId
  >;
  removePropuestas_trueques!: Sequelize.HasManyRemoveAssociationsMixin<
    propuestas_trueque,
    propuestas_truequeId
  >;
  hasPropuestas_trueque!: Sequelize.HasManyHasAssociationMixin<
    propuestas_trueque,
    propuestas_truequeId
  >;
  hasPropuestas_trueques!: Sequelize.HasManyHasAssociationsMixin<
    propuestas_trueque,
    propuestas_truequeId
  >;
  countPropuestas_trueques!: Sequelize.HasManyCountAssociationsMixin;
  // productos hasMany revision_productos via producto_id
  revision_productos!: revision_productos[];
  getRevision_productos!: Sequelize.HasManyGetAssociationsMixin<revision_productos>;
  setRevision_productos!: Sequelize.HasManySetAssociationsMixin<
    revision_productos,
    revision_productosId
  >;
  addRevision_producto!: Sequelize.HasManyAddAssociationMixin<
    revision_productos,
    revision_productosId
  >;
  addRevision_productos!: Sequelize.HasManyAddAssociationsMixin<
    revision_productos,
    revision_productosId
  >;
  createRevision_producto!: Sequelize.HasManyCreateAssociationMixin<revision_productos>;
  removeRevision_producto!: Sequelize.HasManyRemoveAssociationMixin<
    revision_productos,
    revision_productosId
  >;
  removeRevision_productos!: Sequelize.HasManyRemoveAssociationsMixin<
    revision_productos,
    revision_productosId
  >;
  hasRevision_producto!: Sequelize.HasManyHasAssociationMixin<
    revision_productos,
    revision_productosId
  >;
  hasRevision_productos!: Sequelize.HasManyHasAssociationsMixin<
    revision_productos,
    revision_productosId
  >;
  countRevision_productos!: Sequelize.HasManyCountAssociationsMixin;
  // productos belongsTo usuarios via usuario_id
  usuario!: usuarios;
  getUsuario!: Sequelize.BelongsToGetAssociationMixin<usuarios>;
  setUsuario!: Sequelize.BelongsToSetAssociationMixin<usuarios, usuariosId>;
  createUsuario!: Sequelize.BelongsToCreateAssociationMixin<usuarios>;

  static initModel(sequelize: Sequelize.Sequelize): typeof productos {
    return productos.init(
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
        categoria_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'categorias',
            key: 'id',
          },
        },
        titulo: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        descripcion: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        estado_producto: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 3,
        },
        valor_estimado: {
          type: DataTypes.DECIMAL,
          allowNull: true,
        },
        fecha_publicacion: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        estado_publicacion: {
          type: DataTypes.STRING(20),
          allowNull: true,
          defaultValue: 'disponible',
        },
        imagen_principal: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        vistas: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        popularidad: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        tableName: 'productos',
        schema: 'mercadotrueque',
        timestamps: false,
        indexes: [
          {
            name: 'idx_productos_categoria',
            fields: [{ name: 'categoria_id' }],
          },
          {
            name: 'idx_productos_estado_publicacion',
            fields: [{ name: 'estado_publicacion' }],
          },
          {
            name: 'idx_productos_fecha_publicacion',
            fields: [{ name: 'fecha_publicacion', order: 'DESC' }],
          },
          {
            name: 'idx_productos_popularidad',
            fields: [{ name: 'popularidad', order: 'DESC' }],
          },
          {
            name: 'idx_productos_usuario',
            fields: [{ name: 'usuario_id' }],
          },
          {
            name: 'idx_productos_valor',
            fields: [{ name: 'valor_estimado' }],
          },
          {
            name: 'idx_productos_vistas',
            fields: [{ name: 'vistas', order: 'DESC' }],
          },
          {
            name: 'productos_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
  }
}
