import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { carrito_trueque, carrito_truequeId } from './carrito_trueque';
import type {
  historias_trueque,
  historias_truequeId,
} from './historias_trueque';
import type {
  mensajes_propuesta,
  mensajes_propuestaId,
} from './mensajes_propuesta';
import type { notificaciones, notificacionesId } from './notificaciones';
import type {
  preguntas_productos,
  preguntas_productosId,
} from './preguntas_productos';
import type { productos, productosId } from './productos';
import type {
  propuestas_trueque,
  propuestas_truequeId,
} from './propuestas_trueque';
import type { reseñas, reseñasId } from './reseñas';
import type {
  respuestas_preguntas,
  respuestas_preguntasId,
} from './respuestas_preguntas';
import type { ubicaciones, ubicacionesId } from './ubicaciones';

export interface usuariosAttributes {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  fecha_registro?: Date;
  estado?: string;
  avatar_url?: string;
  calificacion_promedio?: number;
  total_intercambios?: number;
}

export type usuariosPk = 'id';
export type usuariosId = usuarios[usuariosPk];
export type usuariosOptionalAttributes =
  | 'id'
  | 'telefono'
  | 'fecha_registro'
  | 'estado'
  | 'avatar_url'
  | 'calificacion_promedio'
  | 'total_intercambios';
export type usuariosCreationAttributes = Optional<
  usuariosAttributes,
  usuariosOptionalAttributes
>;

export class usuarios
  extends Model<usuariosAttributes, usuariosCreationAttributes>
  implements usuariosAttributes
{
  id!: string;
  email!: string;
  nombre!: string;
  apellido!: string;
  telefono?: string;
  fecha_registro?: Date;
  estado?: string;
  avatar_url?: string;
  calificacion_promedio?: number;
  total_intercambios?: number;

  // usuarios hasMany carrito_trueque via usuario_id
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
  // usuarios hasMany historias_trueque via usuario_id
  historias_trueques!: historias_trueque[];
  getHistorias_trueques!: Sequelize.HasManyGetAssociationsMixin<historias_trueque>;
  setHistorias_trueques!: Sequelize.HasManySetAssociationsMixin<
    historias_trueque,
    historias_truequeId
  >;
  addHistorias_trueque!: Sequelize.HasManyAddAssociationMixin<
    historias_trueque,
    historias_truequeId
  >;
  addHistorias_trueques!: Sequelize.HasManyAddAssociationsMixin<
    historias_trueque,
    historias_truequeId
  >;
  createHistorias_trueque!: Sequelize.HasManyCreateAssociationMixin<historias_trueque>;
  removeHistorias_trueque!: Sequelize.HasManyRemoveAssociationMixin<
    historias_trueque,
    historias_truequeId
  >;
  removeHistorias_trueques!: Sequelize.HasManyRemoveAssociationsMixin<
    historias_trueque,
    historias_truequeId
  >;
  hasHistorias_trueque!: Sequelize.HasManyHasAssociationMixin<
    historias_trueque,
    historias_truequeId
  >;
  hasHistorias_trueques!: Sequelize.HasManyHasAssociationsMixin<
    historias_trueque,
    historias_truequeId
  >;
  countHistorias_trueques!: Sequelize.HasManyCountAssociationsMixin;
  // usuarios hasMany mensajes_propuesta via usuario_id
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
  // usuarios hasMany notificaciones via usuario_id
  notificaciones!: notificaciones[];
  getNotificaciones!: Sequelize.HasManyGetAssociationsMixin<notificaciones>;
  setNotificaciones!: Sequelize.HasManySetAssociationsMixin<
    notificaciones,
    notificacionesId
  >;
  addNotificacione!: Sequelize.HasManyAddAssociationMixin<
    notificaciones,
    notificacionesId
  >;
  addNotificaciones!: Sequelize.HasManyAddAssociationsMixin<
    notificaciones,
    notificacionesId
  >;
  createNotificacione!: Sequelize.HasManyCreateAssociationMixin<notificaciones>;
  removeNotificacione!: Sequelize.HasManyRemoveAssociationMixin<
    notificaciones,
    notificacionesId
  >;
  removeNotificaciones!: Sequelize.HasManyRemoveAssociationsMixin<
    notificaciones,
    notificacionesId
  >;
  hasNotificacione!: Sequelize.HasManyHasAssociationMixin<
    notificaciones,
    notificacionesId
  >;
  hasNotificaciones!: Sequelize.HasManyHasAssociationsMixin<
    notificaciones,
    notificacionesId
  >;
  countNotificaciones!: Sequelize.HasManyCountAssociationsMixin;
  // usuarios hasMany preguntas_productos via usuario_id
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
  // usuarios hasMany productos via usuario_id
  productos!: productos[];
  getProductos!: Sequelize.HasManyGetAssociationsMixin<productos>;
  setProductos!: Sequelize.HasManySetAssociationsMixin<productos, productosId>;
  addProducto!: Sequelize.HasManyAddAssociationMixin<productos, productosId>;
  addProductos!: Sequelize.HasManyAddAssociationsMixin<productos, productosId>;
  createProducto!: Sequelize.HasManyCreateAssociationMixin<productos>;
  removeProducto!: Sequelize.HasManyRemoveAssociationMixin<
    productos,
    productosId
  >;
  removeProductos!: Sequelize.HasManyRemoveAssociationsMixin<
    productos,
    productosId
  >;
  hasProducto!: Sequelize.HasManyHasAssociationMixin<productos, productosId>;
  hasProductos!: Sequelize.HasManyHasAssociationsMixin<productos, productosId>;
  countProductos!: Sequelize.HasManyCountAssociationsMixin;
  // usuarios hasMany propuestas_trueque via usuario_oferente_id
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
  // usuarios hasMany reseñas via usuario_calificador_id
  reseñas!: reseñas[];
  getReseñas!: Sequelize.HasManyGetAssociationsMixin<reseñas>;
  setReseñas!: Sequelize.HasManySetAssociationsMixin<reseñas, reseñasId>;
  addReseña!: Sequelize.HasManyAddAssociationMixin<reseñas, reseñasId>;
  addReseñas!: Sequelize.HasManyAddAssociationsMixin<reseñas, reseñasId>;
  createReseña!: Sequelize.HasManyCreateAssociationMixin<reseñas>;
  removeReseña!: Sequelize.HasManyRemoveAssociationMixin<reseñas, reseñasId>;
  removeReseñas!: Sequelize.HasManyRemoveAssociationsMixin<reseñas, reseñasId>;
  hasReseña!: Sequelize.HasManyHasAssociationMixin<reseñas, reseñasId>;
  hasReseñas!: Sequelize.HasManyHasAssociationsMixin<reseñas, reseñasId>;
  countReseñas!: Sequelize.HasManyCountAssociationsMixin;
  // usuarios hasMany reseñas via usuario_calificado_id
  usuario_calificado_reseñas!: reseñas[];
  getUsuario_calificado_reseñas!: Sequelize.HasManyGetAssociationsMixin<reseñas>;
  setUsuario_calificado_reseñas!: Sequelize.HasManySetAssociationsMixin<
    reseñas,
    reseñasId
  >;
  addUsuario_calificado_reseña!: Sequelize.HasManyAddAssociationMixin<
    reseñas,
    reseñasId
  >;
  addUsuario_calificado_reseñas!: Sequelize.HasManyAddAssociationsMixin<
    reseñas,
    reseñasId
  >;
  createUsuario_calificado_reseña!: Sequelize.HasManyCreateAssociationMixin<reseñas>;
  removeUsuario_calificado_reseña!: Sequelize.HasManyRemoveAssociationMixin<
    reseñas,
    reseñasId
  >;
  removeUsuario_calificado_reseñas!: Sequelize.HasManyRemoveAssociationsMixin<
    reseñas,
    reseñasId
  >;
  hasUsuario_calificado_reseña!: Sequelize.HasManyHasAssociationMixin<
    reseñas,
    reseñasId
  >;
  hasUsuario_calificado_reseñas!: Sequelize.HasManyHasAssociationsMixin<
    reseñas,
    reseñasId
  >;
  countUsuario_calificado_reseñas!: Sequelize.HasManyCountAssociationsMixin;
  // usuarios hasMany respuestas_preguntas via usuario_id
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
  // usuarios hasMany ubicaciones via usuario_id
  ubicaciones!: ubicaciones[];
  getUbicaciones!: Sequelize.HasManyGetAssociationsMixin<ubicaciones>;
  setUbicaciones!: Sequelize.HasManySetAssociationsMixin<
    ubicaciones,
    ubicacionesId
  >;
  addUbicacione!: Sequelize.HasManyAddAssociationMixin<
    ubicaciones,
    ubicacionesId
  >;
  addUbicaciones!: Sequelize.HasManyAddAssociationsMixin<
    ubicaciones,
    ubicacionesId
  >;
  createUbicacione!: Sequelize.HasManyCreateAssociationMixin<ubicaciones>;
  removeUbicacione!: Sequelize.HasManyRemoveAssociationMixin<
    ubicaciones,
    ubicacionesId
  >;
  removeUbicaciones!: Sequelize.HasManyRemoveAssociationsMixin<
    ubicaciones,
    ubicacionesId
  >;
  hasUbicacione!: Sequelize.HasManyHasAssociationMixin<
    ubicaciones,
    ubicacionesId
  >;
  hasUbicaciones!: Sequelize.HasManyHasAssociationsMixin<
    ubicaciones,
    ubicacionesId
  >;
  countUbicaciones!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof usuarios {
    return usuarios.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn(
            'mercadotrueque.uuid_generate_v4',
          ),
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: 'usuarios_email_key',
        },
        nombre: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        apellido: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        telefono: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        fecha_registro: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        estado: {
          type: DataTypes.STRING(20),
          allowNull: true,
          defaultValue: 'activo',
        },
        avatar_url: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        calificacion_promedio: {
          type: DataTypes.DECIMAL,
          allowNull: true,
          defaultValue: 0.0,
        },
        total_intercambios: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        tableName: 'usuarios',
        schema: 'mercadotrueque',
        timestamps: false,
        indexes: [
          {
            name: 'idx_usuarios_calificacion',
            fields: [{ name: 'calificacion_promedio', order: 'DESC' }],
          },
          {
            name: 'idx_usuarios_email',
            fields: [{ name: 'email' }],
          },
          {
            name: 'idx_usuarios_estado',
            fields: [{ name: 'estado' }],
          },
          {
            name: 'usuarios_email_key',
            unique: true,
            fields: [{ name: 'email' }],
          },
          {
            name: 'usuarios_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
  }
}
