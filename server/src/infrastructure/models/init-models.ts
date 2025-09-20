import type { Sequelize } from 'sequelize';
import { alertas_activadas as _alertas_activadas } from './alertas_activadas';
import type {
  alertas_activadasAttributes,
  alertas_activadasCreationAttributes,
} from './alertas_activadas';
import { caracteristicas_categoria as _caracteristicas_categoria } from './caracteristicas_categoria';
import type {
  caracteristicas_categoriaAttributes,
  caracteristicas_categoriaCreationAttributes,
} from './caracteristicas_categoria';
import { caracteristicas_producto as _caracteristicas_producto } from './caracteristicas_producto';
import type {
  caracteristicas_productoAttributes,
  caracteristicas_productoCreationAttributes,
} from './caracteristicas_producto';
import { carrito_trueque as _carrito_trueque } from './carrito_trueque';
import type {
  carrito_truequeAttributes,
  carrito_truequeCreationAttributes,
} from './carrito_trueque';
import { categorias as _categorias } from './categorias';
import type {
  categoriasAttributes,
  categoriasCreationAttributes,
} from './categorias';
import { centros_distribucion as _centros_distribucion } from './centros_distribucion';
import type {
  centros_distribucionAttributes,
  centros_distribucionCreationAttributes,
} from './centros_distribucion';
import { envios as _envios } from './envios';
import type { enviosAttributes, enviosCreationAttributes } from './envios';
import { estadisticas_sistema as _estadisticas_sistema } from './estadisticas_sistema';
import type {
  estadisticas_sistemaAttributes,
  estadisticas_sistemaCreationAttributes,
} from './estadisticas_sistema';
import { historias_trueque as _historias_trueque } from './historias_trueque';
import type {
  historias_truequeAttributes,
  historias_truequeCreationAttributes,
} from './historias_trueque';
import { imagenes_producto as _imagenes_producto } from './imagenes_producto';
import type {
  imagenes_productoAttributes,
  imagenes_productoCreationAttributes,
} from './imagenes_producto';
import { intercambios as _intercambios } from './intercambios';
import type {
  intercambiosAttributes,
  intercambiosCreationAttributes,
} from './intercambios';
import { mensajes_propuesta as _mensajes_propuesta } from './mensajes_propuesta';
import type {
  mensajes_propuestaAttributes,
  mensajes_propuestaCreationAttributes,
} from './mensajes_propuesta';
import { notificaciones as _notificaciones } from './notificaciones';
import type {
  notificacionesAttributes,
  notificacionesCreationAttributes,
} from './notificaciones';
import { preguntas_productos as _preguntas_productos } from './preguntas_productos';
import type {
  preguntas_productosAttributes,
  preguntas_productosCreationAttributes,
} from './preguntas_productos';
import { productos as _productos } from './productos';
import type {
  productosAttributes,
  productosCreationAttributes,
} from './productos';
import { productos_propuesta as _productos_propuesta } from './productos_propuesta';
import type {
  productos_propuestaAttributes,
  productos_propuestaCreationAttributes,
} from './productos_propuesta';
import { propuestas_trueque as _propuestas_trueque } from './propuestas_trueque';
import type {
  propuestas_truequeAttributes,
  propuestas_truequeCreationAttributes,
} from './propuestas_trueque';
import { reseñas as _reseñas } from './reseñas';
import type { reseñasAttributes, reseñasCreationAttributes } from './reseñas';
import { respuestas_preguntas as _respuestas_preguntas } from './respuestas_preguntas';
import type {
  respuestas_preguntasAttributes,
  respuestas_preguntasCreationAttributes,
} from './respuestas_preguntas';
import { revision_productos as _revision_productos } from './revision_productos';
import type {
  revision_productosAttributes,
  revision_productosCreationAttributes,
} from './revision_productos';
import { suscripciones_alertas as _suscripciones_alertas } from './suscripciones_alertas';
import type {
  suscripciones_alertasAttributes,
  suscripciones_alertasCreationAttributes,
} from './suscripciones_alertas';
import { ubicaciones as _ubicaciones } from './ubicaciones';
import type {
  ubicacionesAttributes,
  ubicacionesCreationAttributes,
} from './ubicaciones';
import { usuarios as _usuarios } from './usuarios';
import type {
  usuariosAttributes,
  usuariosCreationAttributes,
} from './usuarios';

export {
  _alertas_activadas as alertas_activadas,
  _caracteristicas_categoria as caracteristicas_categoria,
  _caracteristicas_producto as caracteristicas_producto,
  _carrito_trueque as carrito_trueque,
  _categorias as categorias,
  _centros_distribucion as centros_distribucion,
  _envios as envios,
  _estadisticas_sistema as estadisticas_sistema,
  _historias_trueque as historias_trueque,
  _imagenes_producto as imagenes_producto,
  _intercambios as intercambios,
  _mensajes_propuesta as mensajes_propuesta,
  _notificaciones as notificaciones,
  _preguntas_productos as preguntas_productos,
  _productos as productos,
  _productos_propuesta as productos_propuesta,
  _propuestas_trueque as propuestas_trueque,
  _reseñas as reseñas,
  _respuestas_preguntas as respuestas_preguntas,
  _revision_productos as revision_productos,
  _suscripciones_alertas as suscripciones_alertas,
  _ubicaciones as ubicaciones,
  _usuarios as usuarios,
};

export type {
  alertas_activadasAttributes,
  alertas_activadasCreationAttributes,
  caracteristicas_categoriaAttributes,
  caracteristicas_categoriaCreationAttributes,
  caracteristicas_productoAttributes,
  caracteristicas_productoCreationAttributes,
  carrito_truequeAttributes,
  carrito_truequeCreationAttributes,
  categoriasAttributes,
  categoriasCreationAttributes,
  centros_distribucionAttributes,
  centros_distribucionCreationAttributes,
  enviosAttributes,
  enviosCreationAttributes,
  estadisticas_sistemaAttributes,
  estadisticas_sistemaCreationAttributes,
  historias_truequeAttributes,
  historias_truequeCreationAttributes,
  imagenes_productoAttributes,
  imagenes_productoCreationAttributes,
  intercambiosAttributes,
  intercambiosCreationAttributes,
  mensajes_propuestaAttributes,
  mensajes_propuestaCreationAttributes,
  notificacionesAttributes,
  notificacionesCreationAttributes,
  preguntas_productosAttributes,
  preguntas_productosCreationAttributes,
  productosAttributes,
  productosCreationAttributes,
  productos_propuestaAttributes,
  productos_propuestaCreationAttributes,
  propuestas_truequeAttributes,
  propuestas_truequeCreationAttributes,
  reseñasAttributes,
  reseñasCreationAttributes,
  respuestas_preguntasAttributes,
  respuestas_preguntasCreationAttributes,
  revision_productosAttributes,
  revision_productosCreationAttributes,
  suscripciones_alertasAttributes,
  suscripciones_alertasCreationAttributes,
  ubicacionesAttributes,
  ubicacionesCreationAttributes,
  usuariosAttributes,
  usuariosCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const alertas_activadas = _alertas_activadas.initModel(sequelize);
  const caracteristicas_categoria =
    _caracteristicas_categoria.initModel(sequelize);
  const caracteristicas_producto =
    _caracteristicas_producto.initModel(sequelize);
  const carrito_trueque = _carrito_trueque.initModel(sequelize);
  const categorias = _categorias.initModel(sequelize);
  const centros_distribucion = _centros_distribucion.initModel(sequelize);
  const envios = _envios.initModel(sequelize);
  const estadisticas_sistema = _estadisticas_sistema.initModel(sequelize);
  const historias_trueque = _historias_trueque.initModel(sequelize);
  const imagenes_producto = _imagenes_producto.initModel(sequelize);
  const intercambios = _intercambios.initModel(sequelize);
  const mensajes_propuesta = _mensajes_propuesta.initModel(sequelize);
  const notificaciones = _notificaciones.initModel(sequelize);
  const preguntas_productos = _preguntas_productos.initModel(sequelize);
  const productos = _productos.initModel(sequelize);
  const productos_propuesta = _productos_propuesta.initModel(sequelize);
  const propuestas_trueque = _propuestas_trueque.initModel(sequelize);
  const reseñas = _reseñas.initModel(sequelize);
  const respuestas_preguntas = _respuestas_preguntas.initModel(sequelize);
  const revision_productos = _revision_productos.initModel(sequelize);
  const suscripciones_alertas = _suscripciones_alertas.initModel(sequelize);
  const ubicaciones = _ubicaciones.initModel(sequelize);
  const usuarios = _usuarios.initModel(sequelize);

  caracteristicas_producto.belongsTo(caracteristicas_categoria, {
    as: 'caracteristica',
    foreignKey: 'caracteristica_id',
  });
  caracteristicas_categoria.hasMany(caracteristicas_producto, {
    as: 'caracteristicas_productos',
    foreignKey: 'caracteristica_id',
  });
  caracteristicas_categoria.belongsTo(categorias, {
    as: 'categorium',
    foreignKey: 'categoria_id',
  });
  categorias.hasMany(caracteristicas_categoria, {
    as: 'caracteristicas_categoria',
    foreignKey: 'categoria_id',
  });
  productos.belongsTo(categorias, {
    as: 'categorium',
    foreignKey: 'categoria_id',
  });
  categorias.hasMany(productos, {
    as: 'productos',
    foreignKey: 'categoria_id',
  });
  suscripciones_alertas.belongsTo(categorias, {
    as: 'categorium',
    foreignKey: 'categoria_id',
  });
  categorias.hasMany(suscripciones_alertas, {
    as: 'suscripciones_alerta',
    foreignKey: 'categoria_id',
  });
  intercambios.belongsTo(centros_distribucion, {
    as: 'centro_distribucion',
    foreignKey: 'centro_distribucion_id',
  });
  centros_distribucion.hasMany(intercambios, {
    as: 'intercambios',
    foreignKey: 'centro_distribucion_id',
  });
  envios.belongsTo(intercambios, {
    as: 'intercambio',
    foreignKey: 'intercambio_id',
  });
  intercambios.hasMany(envios, { as: 'envios', foreignKey: 'intercambio_id' });
  reseñas.belongsTo(intercambios, {
    as: 'intercambio',
    foreignKey: 'intercambio_id',
  });
  intercambios.hasMany(reseñas, {
    as: 'reseñas',
    foreignKey: 'intercambio_id',
  });
  revision_productos.belongsTo(intercambios, {
    as: 'intercambio',
    foreignKey: 'intercambio_id',
  });
  intercambios.hasMany(revision_productos, {
    as: 'revision_productos',
    foreignKey: 'intercambio_id',
  });
  respuestas_preguntas.belongsTo(preguntas_productos, {
    as: 'preguntum',
    foreignKey: 'pregunta_id',
  });
  preguntas_productos.hasMany(respuestas_preguntas, {
    as: 'respuestas_pregunta',
    foreignKey: 'pregunta_id',
  });
  alertas_activadas.belongsTo(productos, {
    as: 'producto',
    foreignKey: 'producto_id',
  });
  productos.hasMany(alertas_activadas, {
    as: 'alertas_activadas',
    foreignKey: 'producto_id',
  });
  caracteristicas_producto.belongsTo(productos, {
    as: 'producto',
    foreignKey: 'producto_id',
  });
  productos.hasMany(caracteristicas_producto, {
    as: 'caracteristicas_productos',
    foreignKey: 'producto_id',
  });
  carrito_trueque.belongsTo(productos, {
    as: 'producto',
    foreignKey: 'producto_id',
  });
  productos.hasMany(carrito_trueque, {
    as: 'carrito_trueques',
    foreignKey: 'producto_id',
  });
  envios.belongsTo(productos, { as: 'producto', foreignKey: 'producto_id' });
  productos.hasMany(envios, { as: 'envios', foreignKey: 'producto_id' });
  imagenes_producto.belongsTo(productos, {
    as: 'producto',
    foreignKey: 'producto_id',
  });
  productos.hasMany(imagenes_producto, {
    as: 'imagenes_productos',
    foreignKey: 'producto_id',
  });
  preguntas_productos.belongsTo(productos, {
    as: 'producto',
    foreignKey: 'producto_id',
  });
  productos.hasMany(preguntas_productos, {
    as: 'preguntas_productos',
    foreignKey: 'producto_id',
  });
  productos_propuesta.belongsTo(productos, {
    as: 'producto',
    foreignKey: 'producto_id',
  });
  productos.hasMany(productos_propuesta, {
    as: 'productos_propuesta',
    foreignKey: 'producto_id',
  });
  propuestas_trueque.belongsTo(productos, {
    as: 'producto_solicitado',
    foreignKey: 'producto_solicitado_id',
  });
  productos.hasMany(propuestas_trueque, {
    as: 'propuestas_trueques',
    foreignKey: 'producto_solicitado_id',
  });
  revision_productos.belongsTo(productos, {
    as: 'producto',
    foreignKey: 'producto_id',
  });
  productos.hasMany(revision_productos, {
    as: 'revision_productos',
    foreignKey: 'producto_id',
  });
  intercambios.belongsTo(propuestas_trueque, {
    as: 'propuestum',
    foreignKey: 'propuesta_id',
  });
  propuestas_trueque.hasMany(intercambios, {
    as: 'intercambios',
    foreignKey: 'propuesta_id',
  });
  mensajes_propuesta.belongsTo(propuestas_trueque, {
    as: 'propuestum',
    foreignKey: 'propuesta_id',
  });
  propuestas_trueque.hasMany(mensajes_propuesta, {
    as: 'mensajes_propuesta',
    foreignKey: 'propuesta_id',
  });
  productos_propuesta.belongsTo(propuestas_trueque, {
    as: 'propuestum',
    foreignKey: 'propuesta_id',
  });
  propuestas_trueque.hasMany(productos_propuesta, {
    as: 'productos_propuesta',
    foreignKey: 'propuesta_id',
  });
  alertas_activadas.belongsTo(suscripciones_alertas, {
    as: 'suscripcion',
    foreignKey: 'suscripcion_id',
  });
  suscripciones_alertas.hasMany(alertas_activadas, {
    as: 'alertas_activadas',
    foreignKey: 'suscripcion_id',
  });
  carrito_trueque.belongsTo(usuarios, {
    as: 'usuario',
    foreignKey: 'usuario_id',
  });
  usuarios.hasMany(carrito_trueque, {
    as: 'carrito_trueques',
    foreignKey: 'usuario_id',
  });
  historias_trueque.belongsTo(usuarios, {
    as: 'usuario',
    foreignKey: 'usuario_id',
  });
  usuarios.hasMany(historias_trueque, {
    as: 'historias_trueques',
    foreignKey: 'usuario_id',
  });
  mensajes_propuesta.belongsTo(usuarios, {
    as: 'usuario',
    foreignKey: 'usuario_id',
  });
  usuarios.hasMany(mensajes_propuesta, {
    as: 'mensajes_propuesta',
    foreignKey: 'usuario_id',
  });
  notificaciones.belongsTo(usuarios, {
    as: 'usuario',
    foreignKey: 'usuario_id',
  });
  usuarios.hasMany(notificaciones, {
    as: 'notificaciones',
    foreignKey: 'usuario_id',
  });
  preguntas_productos.belongsTo(usuarios, {
    as: 'usuario',
    foreignKey: 'usuario_id',
  });
  usuarios.hasMany(preguntas_productos, {
    as: 'preguntas_productos',
    foreignKey: 'usuario_id',
  });
  productos.belongsTo(usuarios, { as: 'usuario', foreignKey: 'usuario_id' });
  usuarios.hasMany(productos, { as: 'productos', foreignKey: 'usuario_id' });
  propuestas_trueque.belongsTo(usuarios, {
    as: 'usuario_oferente',
    foreignKey: 'usuario_oferente_id',
  });
  usuarios.hasMany(propuestas_trueque, {
    as: 'propuestas_trueques',
    foreignKey: 'usuario_oferente_id',
  });
  reseñas.belongsTo(usuarios, {
    as: 'usuario_calificador',
    foreignKey: 'usuario_calificador_id',
  });
  usuarios.hasMany(reseñas, {
    as: 'reseñas',
    foreignKey: 'usuario_calificador_id',
  });
  reseñas.belongsTo(usuarios, {
    as: 'usuario_calificado',
    foreignKey: 'usuario_calificado_id',
  });
  usuarios.hasMany(reseñas, {
    as: 'usuario_calificado_reseñas',
    foreignKey: 'usuario_calificado_id',
  });
  respuestas_preguntas.belongsTo(usuarios, {
    as: 'usuario',
    foreignKey: 'usuario_id',
  });
  usuarios.hasMany(respuestas_preguntas, {
    as: 'respuestas_pregunta',
    foreignKey: 'usuario_id',
  });
  ubicaciones.belongsTo(usuarios, { as: 'usuario', foreignKey: 'usuario_id' });
  usuarios.hasMany(ubicaciones, {
    as: 'ubicaciones',
    foreignKey: 'usuario_id',
  });

  return {
    alertas_activadas: alertas_activadas,
    caracteristicas_categoria: caracteristicas_categoria,
    caracteristicas_producto: caracteristicas_producto,
    carrito_trueque: carrito_trueque,
    categorias: categorias,
    centros_distribucion: centros_distribucion,
    envios: envios,
    estadisticas_sistema: estadisticas_sistema,
    historias_trueque: historias_trueque,
    imagenes_producto: imagenes_producto,
    intercambios: intercambios,
    mensajes_propuesta: mensajes_propuesta,
    notificaciones: notificaciones,
    preguntas_productos: preguntas_productos,
    productos: productos,
    productos_propuesta: productos_propuesta,
    propuestas_trueque: propuestas_trueque,
    reseñas: reseñas,
    respuestas_preguntas: respuestas_preguntas,
    revision_productos: revision_productos,
    suscripciones_alertas: suscripciones_alertas,
    ubicaciones: ubicaciones,
    usuarios: usuarios,
  };
}
