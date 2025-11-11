-- CreateTable
CREATE TABLE "alertas_activadas" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "suscripcion_id" UUID NOT NULL,
    "producto_id" UUID NOT NULL,
    "enviada" BOOLEAN DEFAULT false,
    "fecha_activacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alertas_activadas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caracteristicas_categoria" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "categoria_id" UUID NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "tipo_dato" VARCHAR(20) DEFAULT 'text',
    "requerido" BOOLEAN DEFAULT false,
    "opciones" JSONB,

    CONSTRAINT "caracteristicas_categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caracteristicas_producto" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "producto_id" UUID NOT NULL,
    "caracteristica_id" UUID NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "caracteristicas_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carrito_trueque" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "usuario_id" UUID NOT NULL,
    "producto_id" UUID NOT NULL,
    "fecha_agregado" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carrito_trueque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "codigo" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN DEFAULT true,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "centros_distribucion" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "codigo" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "direccion" TEXT NOT NULL,
    "ciudad" VARCHAR(100) NOT NULL,
    "departamento" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(20),
    "email" VARCHAR(255),
    "activo" BOOLEAN DEFAULT true,
    "capacidad_maxima" INTEGER DEFAULT 100,

    CONSTRAINT "centros_distribucion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "envios" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "intercambio_id" UUID NOT NULL,
    "producto_id" UUID NOT NULL,
    "direccion_origen" TEXT NOT NULL,
    "fecha_envio" TIMESTAMP(6),
    "fecha_recepcion_centro" TIMESTAMP(6),
    "codigo_tracking" VARCHAR(50),
    "transportadora" VARCHAR(100),
    "estado_envio" VARCHAR(30) DEFAULT 'preparando',
    "costo_envio" DECIMAL(10,2) DEFAULT 0,

    CONSTRAINT "envios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estadisticas_sistema" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "fecha" DATE NOT NULL,
    "articulos_disponibles" INTEGER DEFAULT 0,
    "usuarios_activos" INTEGER DEFAULT 0,
    "trueques_completados" INTEGER DEFAULT 0,

    CONSTRAINT "estadisticas_sistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estados_producto" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "codigo" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "orden" INTEGER NOT NULL,
    "activo" BOOLEAN DEFAULT true,

    CONSTRAINT "estados_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historias_trueque" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "usuario_id" UUID NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "historia" TEXT NOT NULL,
    "imagen_url" TEXT,
    "fecha_publicacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "activa" BOOLEAN DEFAULT true,

    CONSTRAINT "historias_trueque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagenes_producto" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "producto_id" UUID NOT NULL,
    "url_imagen" TEXT NOT NULL,
    "orden" INTEGER DEFAULT 1,
    "es_principal" BOOLEAN DEFAULT false,

    CONSTRAINT "imagenes_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intercambios" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "propuesta_id" UUID NOT NULL,
    "fecha_inicio" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "estado" VARCHAR(30) DEFAULT 'iniciado',
    "centro_distribucion_id" UUID NOT NULL,
    "fecha_completado" TIMESTAMP(6),
    "notas_revision" TEXT,
    "costo_envio_total" DECIMAL(10,2) DEFAULT 0,

    CONSTRAINT "intercambios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensajes_propuesta" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "propuesta_id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "mensaje" TEXT NOT NULL,
    "fecha_mensaje" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensajes_propuesta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "usuario_id" UUID NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leida" BOOLEAN DEFAULT false,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "referencia_id" UUID,
    "referencia_tipo" VARCHAR(50),

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preguntas_productos" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "producto_id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "pregunta" TEXT NOT NULL,
    "fecha_pregunta" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "activa" BOOLEAN DEFAULT true,

    CONSTRAINT "preguntas_productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "usuario_id" UUID NOT NULL,
    "categoria_id" UUID NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "valor_estimado" DECIMAL(12,2),
    "fecha_publicacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "estado_publicacion" VARCHAR(20) DEFAULT 'disponible',
    "imagen_principal" TEXT,
    "vistas" INTEGER DEFAULT 0,
    "popularidad" INTEGER DEFAULT 0,
    "estado_producto_id" UUID,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos_propuesta" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "propuesta_id" UUID NOT NULL,
    "producto_id" UUID NOT NULL,
    "orden" INTEGER DEFAULT 1,

    CONSTRAINT "productos_propuesta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "propuestas_trueque" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "producto_solicitado_id" UUID NOT NULL,
    "usuario_oferente_id" UUID NOT NULL,
    "mensaje" TEXT,
    "fecha_propuesta" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "estado" VARCHAR(20) DEFAULT 'pendiente',
    "fecha_respuesta" TIMESTAMP(6),

    CONSTRAINT "propuestas_trueque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reseñas" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "intercambio_id" UUID NOT NULL,
    "usuario_calificador_id" UUID NOT NULL,
    "usuario_calificado_id" UUID NOT NULL,
    "calificacion_usuario" INTEGER NOT NULL,
    "calificacion_producto" INTEGER NOT NULL,
    "comentario" TEXT,
    "fecha_reseña" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "visible" BOOLEAN DEFAULT true,

    CONSTRAINT "reseñas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respuestas_preguntas" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "pregunta_id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "respuesta" TEXT NOT NULL,
    "fecha_respuesta" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "respuestas_preguntas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revision_productos" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "intercambio_id" UUID NOT NULL,
    "producto_id" UUID NOT NULL,
    "empleado_revisor" VARCHAR(100),
    "estado_revision" VARCHAR(30) DEFAULT 'pendiente',
    "calificacion_estado" INTEGER,
    "observaciones" TEXT,
    "fecha_revision" TIMESTAMP(6),
    "fotos_revision" JSONB,

    CONSTRAINT "revision_productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suscripciones_alertas" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "email" VARCHAR(255) NOT NULL,
    "categoria_id" UUID,
    "palabras_clave" TEXT,
    "activa" BOOLEAN DEFAULT true,
    "fecha_suscripcion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suscripciones_alertas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ubicaciones" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "usuario_id" UUID NOT NULL,
    "direccion" TEXT NOT NULL,
    "ciudad" VARCHAR(100) NOT NULL,
    "departamento" VARCHAR(100) NOT NULL,
    "codigo_postal" VARCHAR(10),
    "nombre_contacto" VARCHAR(200) NOT NULL,
    "telefono_contacto" VARCHAR(20),
    "es_principal" BOOLEAN DEFAULT false,
    "activa" BOOLEAN DEFAULT true,

    CONSTRAINT "ubicaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "email" VARCHAR(255) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(20),
    "fecha_registro" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "estado" VARCHAR(20) DEFAULT 'activo',
    "avatar_url" TEXT,
    "calificacion_promedio" DECIMAL(3,2) DEFAULT 0.00,
    "total_intercambios" INTEGER DEFAULT 0,
    "contrasena" VARCHAR(255) NOT NULL DEFAULT '',
    "rol_id" UUID,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permisos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "creado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rol_permisos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "rol_id" UUID NOT NULL,
    "permiso_id" UUID NOT NULL,
    "creado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rol_permisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "creado_en" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_caracteristicas_categoria" ON "caracteristicas_categoria"("categoria_id");

-- CreateIndex
CREATE UNIQUE INDEX "caracteristicas_categoria_categoria_id_nombre_key" ON "caracteristicas_categoria"("categoria_id", "nombre");

-- CreateIndex
CREATE INDEX "idx_caracteristicas_producto" ON "caracteristicas_producto"("producto_id");

-- CreateIndex
CREATE UNIQUE INDEX "caracteristicas_producto_producto_id_caracteristica_id_key" ON "caracteristicas_producto"("producto_id", "caracteristica_id");

-- CreateIndex
CREATE INDEX "idx_carrito_producto" ON "carrito_trueque"("producto_id");

-- CreateIndex
CREATE INDEX "idx_carrito_usuario" ON "carrito_trueque"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "carrito_trueque_usuario_id_producto_id_key" ON "carrito_trueque"("usuario_id", "producto_id");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_codigo_key" ON "categorias"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nombre_key" ON "categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "centros_distribucion_codigo_key" ON "centros_distribucion"("codigo");

-- CreateIndex
CREATE INDEX "idx_envios_estado" ON "envios"("estado_envio");

-- CreateIndex
CREATE INDEX "idx_envios_intercambio" ON "envios"("intercambio_id");

-- CreateIndex
CREATE INDEX "idx_envios_producto" ON "envios"("producto_id");

-- CreateIndex
CREATE INDEX "idx_envios_tracking" ON "envios"("codigo_tracking");

-- CreateIndex
CREATE UNIQUE INDEX "estadisticas_sistema_fecha_key" ON "estadisticas_sistema"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "estados_producto_codigo_key" ON "estados_producto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "estados_producto_nombre_key" ON "estados_producto"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "estados_producto_orden_key" ON "estados_producto"("orden");

-- CreateIndex
CREATE INDEX "idx_estados_producto_codigo" ON "estados_producto"("codigo");

-- CreateIndex
CREATE INDEX "idx_estados_producto_orden" ON "estados_producto"("orden");

-- CreateIndex
CREATE INDEX "idx_intercambios_centro" ON "intercambios"("centro_distribucion_id");

-- CreateIndex
CREATE INDEX "idx_intercambios_estado" ON "intercambios"("estado");

-- CreateIndex
CREATE INDEX "idx_intercambios_fecha" ON "intercambios"("fecha_inicio" DESC);

-- CreateIndex
CREATE INDEX "idx_intercambios_propuesta" ON "intercambios"("propuesta_id");

-- CreateIndex
CREATE INDEX "idx_notificaciones_fecha" ON "notificaciones"("fecha_creacion" DESC);

-- CreateIndex
CREATE INDEX "idx_notificaciones_leida" ON "notificaciones"("leida");

-- CreateIndex
CREATE INDEX "idx_notificaciones_tipo" ON "notificaciones"("tipo");

-- CreateIndex
CREATE INDEX "idx_notificaciones_usuario" ON "notificaciones"("usuario_id");

-- CreateIndex
CREATE INDEX "idx_preguntas_fecha" ON "preguntas_productos"("fecha_pregunta" DESC);

-- CreateIndex
CREATE INDEX "idx_preguntas_producto" ON "preguntas_productos"("producto_id");

-- CreateIndex
CREATE INDEX "idx_preguntas_usuario" ON "preguntas_productos"("usuario_id");

-- CreateIndex
CREATE INDEX "idx_productos_categoria" ON "productos"("categoria_id");

-- CreateIndex
CREATE INDEX "idx_productos_estado_producto" ON "productos"("estado_producto_id");

-- CreateIndex
CREATE INDEX "idx_productos_estado_publicacion" ON "productos"("estado_publicacion");

-- CreateIndex
CREATE INDEX "idx_productos_fecha_publicacion" ON "productos"("fecha_publicacion" DESC);

-- CreateIndex
CREATE INDEX "idx_productos_popularidad" ON "productos"("popularidad" DESC);

-- CreateIndex
CREATE INDEX "idx_productos_usuario" ON "productos"("usuario_id");

-- CreateIndex
CREATE INDEX "idx_productos_valor" ON "productos"("valor_estimado");

-- CreateIndex
CREATE INDEX "idx_productos_vistas" ON "productos"("vistas" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "productos_propuesta_propuesta_id_producto_id_key" ON "productos_propuesta"("propuesta_id", "producto_id");

-- CreateIndex
CREATE INDEX "idx_propuestas_estado" ON "propuestas_trueque"("estado");

-- CreateIndex
CREATE INDEX "idx_propuestas_fecha" ON "propuestas_trueque"("fecha_propuesta" DESC);

-- CreateIndex
CREATE INDEX "idx_propuestas_oferente" ON "propuestas_trueque"("usuario_oferente_id");

-- CreateIndex
CREATE INDEX "idx_propuestas_solicitado" ON "propuestas_trueque"("producto_solicitado_id");

-- CreateIndex
CREATE UNIQUE INDEX "reseñas_intercambio_id_usuario_calificador_id_key" ON "reseñas"("intercambio_id", "usuario_calificador_id");

-- CreateIndex
CREATE UNIQUE INDEX "revision_productos_intercambio_id_producto_id_key" ON "revision_productos"("intercambio_id", "producto_id");

-- CreateIndex
CREATE INDEX "idx_suscripciones_activa" ON "suscripciones_alertas"("activa");

-- CreateIndex
CREATE INDEX "idx_suscripciones_categoria" ON "suscripciones_alertas"("categoria_id");

-- CreateIndex
CREATE INDEX "idx_suscripciones_email" ON "suscripciones_alertas"("email");

-- CreateIndex
CREATE INDEX "idx_ubicaciones_ciudad" ON "ubicaciones"("ciudad");

-- CreateIndex
CREATE INDEX "idx_ubicaciones_usuario" ON "ubicaciones"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "idx_usuarios_calificacion" ON "usuarios"("calificacion_promedio" DESC);

-- CreateIndex
CREATE INDEX "idx_usuarios_email" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "idx_usuarios_estado" ON "usuarios"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "permisos_nombre_key" ON "permisos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "rol_permisos_rol_id_permiso_id_key" ON "rol_permisos"("rol_id", "permiso_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_key" ON "roles"("nombre");

-- AddForeignKey
ALTER TABLE "alertas_activadas" ADD CONSTRAINT "alertas_activadas_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alertas_activadas" ADD CONSTRAINT "alertas_activadas_suscripcion_id_fkey" FOREIGN KEY ("suscripcion_id") REFERENCES "suscripciones_alertas"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "caracteristicas_categoria" ADD CONSTRAINT "caracteristicas_categoria_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "caracteristicas_producto" ADD CONSTRAINT "caracteristicas_producto_caracteristica_id_fkey" FOREIGN KEY ("caracteristica_id") REFERENCES "caracteristicas_categoria"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "caracteristicas_producto" ADD CONSTRAINT "caracteristicas_producto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "carrito_trueque" ADD CONSTRAINT "carrito_trueque_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "carrito_trueque" ADD CONSTRAINT "carrito_trueque_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "envios" ADD CONSTRAINT "envios_intercambio_id_fkey" FOREIGN KEY ("intercambio_id") REFERENCES "intercambios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "envios" ADD CONSTRAINT "envios_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "historias_trueque" ADD CONSTRAINT "historias_trueque_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "imagenes_producto" ADD CONSTRAINT "imagenes_producto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intercambios" ADD CONSTRAINT "intercambios_centro_distribucion_id_fkey" FOREIGN KEY ("centro_distribucion_id") REFERENCES "centros_distribucion"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intercambios" ADD CONSTRAINT "intercambios_propuesta_id_fkey" FOREIGN KEY ("propuesta_id") REFERENCES "propuestas_trueque"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mensajes_propuesta" ADD CONSTRAINT "mensajes_propuesta_propuesta_id_fkey" FOREIGN KEY ("propuesta_id") REFERENCES "propuestas_trueque"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mensajes_propuesta" ADD CONSTRAINT "mensajes_propuesta_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "preguntas_productos" ADD CONSTRAINT "preguntas_productos_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "preguntas_productos" ADD CONSTRAINT "preguntas_productos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "fk_productos_estado_producto" FOREIGN KEY ("estado_producto_id") REFERENCES "estados_producto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productos_propuesta" ADD CONSTRAINT "productos_propuesta_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productos_propuesta" ADD CONSTRAINT "productos_propuesta_propuesta_id_fkey" FOREIGN KEY ("propuesta_id") REFERENCES "propuestas_trueque"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "propuestas_trueque" ADD CONSTRAINT "propuestas_trueque_producto_solicitado_id_fkey" FOREIGN KEY ("producto_solicitado_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "propuestas_trueque" ADD CONSTRAINT "propuestas_trueque_usuario_oferente_id_fkey" FOREIGN KEY ("usuario_oferente_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reseñas" ADD CONSTRAINT "reseñas_intercambio_id_fkey" FOREIGN KEY ("intercambio_id") REFERENCES "intercambios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reseñas" ADD CONSTRAINT "reseñas_usuario_calificado_id_fkey" FOREIGN KEY ("usuario_calificado_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reseñas" ADD CONSTRAINT "reseñas_usuario_calificador_id_fkey" FOREIGN KEY ("usuario_calificador_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "respuestas_preguntas" ADD CONSTRAINT "respuestas_preguntas_pregunta_id_fkey" FOREIGN KEY ("pregunta_id") REFERENCES "preguntas_productos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "respuestas_preguntas" ADD CONSTRAINT "respuestas_preguntas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "revision_productos" ADD CONSTRAINT "revision_productos_intercambio_id_fkey" FOREIGN KEY ("intercambio_id") REFERENCES "intercambios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "revision_productos" ADD CONSTRAINT "revision_productos_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "suscripciones_alertas" ADD CONSTRAINT "suscripciones_alertas_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ubicaciones" ADD CONSTRAINT "ubicaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rol_permisos" ADD CONSTRAINT "rol_permisos_permiso_id_fkey" FOREIGN KEY ("permiso_id") REFERENCES "permisos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rol_permisos" ADD CONSTRAINT "rol_permisos_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
