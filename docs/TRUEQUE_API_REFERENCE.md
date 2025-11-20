# Referencia de API del Sistema de Trueque

## Tabla de Contenidos

- [Introducción](#introducción)
- [Autenticación](#autenticación)
- [Estructura de Respuestas](#estructura-de-respuestas)
- [Códigos de Estado HTTP](#códigos-de-estado-http)
- [Endpoints](#endpoints)
  - [Fase 1: Crear Propuesta](#fase-1-crear-propuesta)
  - [Fase 2: Aceptar/Rechazar Propuesta](#fase-2-aceptarrechazar-propuesta)
  - [Fase 3: Enviar Productos](#fase-3-enviar-productos)
  - [Fase 4: Revisar Productos](#fase-4-revisar-productos)
  - [Fase 5: Entregar Productos](#fase-5-entregar-productos)
  - [Fase 6: Calificar Usuario](#fase-6-calificar-usuario)
  - [Endpoints de Consulta](#endpoints-de-consulta)
- [Modelos de Datos](#modelos-de-datos)
- [Errores Comunes](#errores-comunes)
- [Ejemplos de Flujo Completo](#ejemplos-de-flujo-completo)

---

## Introducción

Esta es la referencia técnica completa de los endpoints del sistema de trueque. Todos los endpoints requieren autenticación mediante Bearer Token y devuelven respuestas en formato JSON.

**Base URL**: `https://api.mercado-trueque.com`

**Versión**: v1

---

## Autenticación

Todos los endpoints requieren un token de acceso válido en el header `Authorization`.

### Header de Autenticación

```http
Authorization: Bearer {access_token}
```

### Obtener Token

```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

**Respuesta**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

---

## Estructura de Respuestas

### Respuesta Exitosa

```json
{
  "status": "success",
  "data": {
    // Datos de la respuesta
  },
  "timestamp": "2025-11-19T10:30:00.000Z"
}
```

### Respuesta de Error

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los productos ofrecidos no pertenecen al usuario",
    "details": [
      {
        "field": "productos_ofrecidos",
        "message": "El producto 660e8400-... no pertenece al usuario"
      }
    ]
  },
  "timestamp": "2025-11-19T10:30:00.000Z"
}
```

---

## Códigos de Estado HTTP

| Código | Descripción | Uso |
|--------|-------------|-----|
| `200` | OK | Operación de lectura exitosa |
| `201` | Created | Recurso creado exitosamente |
| `400` | Bad Request | Datos de entrada inválidos |
| `401` | Unauthorized | Token inválido o expirado |
| `403` | Forbidden | Sin permisos para la operación |
| `404` | Not Found | Recurso no encontrado |
| `409` | Conflict | Estado inválido o recurso en conflicto |
| `422` | Unprocessable Entity | Validación de negocio fallida |
| `500` | Internal Server Error | Error del servidor |

---

## Endpoints

### Fase 1: Crear Propuesta

Crea una nueva propuesta de trueque.

#### Request

```http
POST /trades/proposals
Content-Type: application/json
Authorization: Bearer {token}
```

**Body**:
```json
{
  "usuario_oferente_id": "550e8400-e29b-41d4-a716-446655440000",
  "productos_ofrecidos": [
    "660e8400-e29b-41d4-a716-446655440001",
    "770e8400-e29b-41d4-a716-446655440002"
  ],
  "producto_solicitado_id": "880e8400-e29b-41d4-a716-446655440003",
  "mensaje": "Hola! Estoy interesado en tu bicicleta."
}
```

**Parámetros**:

| Campo | Tipo | Requerido | Validación | Descripción |
|-------|------|-----------|------------|-------------|
| `usuario_oferente_id` | UUID | Sí | UUID válido | ID del usuario que hace la propuesta |
| `productos_ofrecidos` | UUID[] | Sí | 1-5 elementos, UUIDs válidos | Productos que ofrece el usuario |
| `producto_solicitado_id` | UUID | Sí | UUID válido | Producto que desea obtener |
| `mensaje` | string | No | Máx 500 chars | Mensaje personalizado |

#### Response

**Código**: `201 Created`

```json
{
  "id": "990e8400-e29b-41d4-a716-446655440004",
  "usuario_oferente_id": "550e8400-e29b-41d4-a716-446655440000",
  "producto_solicitado_id": "880e8400-e29b-41d4-a716-446655440003",
  "estado": "PROPUESTA",
  "mensaje": "Hola! Estoy interesado en tu bicicleta.",
  "fecha_propuesta": "2025-11-19T10:30:00.000Z",
  "fecha_respuesta": null
}
```

#### Errores

| Código | Error | Descripción |
|--------|-------|-------------|
| `400` | `INVALID_PRODUCTS_COUNT` | Debe ofrecer entre 1 y 5 productos |
| `403` | `NOT_PRODUCT_OWNER` | Los productos no pertenecen al usuario |
| `404` | `PRODUCT_NOT_FOUND` | Producto solicitado no existe |
| `409` | `PRODUCT_NOT_AVAILABLE` | Productos no disponibles |
| `422` | `SELF_TRADE_NOT_ALLOWED` | No puede intercambiar consigo mismo |

#### Ejemplo con cURL

```bash
curl -X POST https://api.mercado-trueque.com/trades/proposals \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_oferente_id": "550e8400-e29b-41d4-a716-446655440000",
    "productos_ofrecidos": ["660e8400-e29b-41d4-a716-446655440001"],
    "producto_solicitado_id": "880e8400-e29b-41d4-a716-446655440003",
    "mensaje": "Interesado en tu producto"
  }'
```

---

### Fase 2: Aceptar/Rechazar Propuesta

#### Aceptar Propuesta

Acepta una propuesta y crea el intercambio.

**Request**:

```http
POST /trades/proposals/:proposalId/accept
Content-Type: application/json
Authorization: Bearer {token}
```

**Parámetros URL**:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `proposalId` | UUID | ID de la propuesta |

**Body**:
```json
{
  "usuario_aceptante_id": "aa0e8400-e29b-41d4-a716-446655440005"
}
```

**Response**: `201 Created`

```json
{
  "id": "bb0e8400-e29b-41d4-a716-446655440006",
  "propuesta_id": "990e8400-e29b-41d4-a716-446655440004",
  "estado": "ACEPTADA",
  "fecha_inicio": "2025-11-19T11:00:00.000Z",
  "centro_distribucion_id": "cc0e8400-e29b-41d4-a716-446655440007",
  "fecha_completado": null
}
```

**Errores**:

| Código | Error | Descripción |
|--------|-------|-------------|
| `403` | `NOT_AUTHORIZED` | No eres el dueño del producto solicitado |
| `404` | `PROPOSAL_NOT_FOUND` | Propuesta no existe |
| `409` | `PROPOSAL_ALREADY_RESPONDED` | Ya fue aceptada o rechazada |
| `409` | `PRODUCTS_NOT_AVAILABLE` | Productos ya no disponibles |

**cURL**:

```bash
curl -X POST https://api.mercado-trueque.com/trades/proposals/990e8400-e29b-41d4-a716-446655440004/accept \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_aceptante_id": "aa0e8400-e29b-41d4-a716-446655440005"
  }'
```

#### Rechazar Propuesta

Rechaza una propuesta.

**Request**:

```http
POST /trades/proposals/:proposalId/reject
Authorization: Bearer {token}
```

**Response**: `200 OK`

```json
{
  "id": "990e8400-e29b-41d4-a716-446655440004",
  "estado": "RECHAZADA",
  "fecha_respuesta": "2025-11-19T11:00:00.000Z"
}
```

---

### Fase 3: Enviar Productos

Registra el envío de productos al centro de distribución.

#### Request

```http
POST /trades/:intercambioId/ship
Content-Type: application/json
Authorization: Bearer {token}
```

**Parámetros URL**:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `intercambioId` | UUID | ID del intercambio |

**Body**:
```json
{
  "usuario_id": "550e8400-e29b-41d4-a716-446655440000",
  "intercambio_id": "bb0e8400-e29b-41d4-a716-446655440006",
  "origen_direccion": "Calle 123 #45-67, Bogotá",
  "destino_direccion": "Centro Distribución Norte, Av. 68 #80-90",
  "notas_envio": "Producto empacado en caja original"
}
```

**Parámetros Body**:

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `usuario_id` | UUID | Sí | ID del usuario que envía |
| `intercambio_id` | UUID | Sí | ID del intercambio |
| `origen_direccion` | string | Sí | Dirección de origen |
| `destino_direccion` | string | Sí | Dirección del centro |
| `notas_envio` | string | No | Notas adicionales |

#### Response

**Código**: `201 Created`

```json
{
  "id": "dd0e8400-e29b-41d4-a716-446655440008",
  "intercambio_id": "bb0e8400-e29b-41d4-a716-446655440006",
  "usuario_id": "550e8400-e29b-41d4-a716-446655440000",
  "tracking_code": "TRK-2025-001234",
  "origen_direccion": "Calle 123 #45-67, Bogotá",
  "destino_direccion": "Centro Distribución Norte, Av. 68 #80-90",
  "estado_envio": "EN_TRANSITO",
  "fecha_envio": "2025-11-19T12:00:00.000Z",
  "fecha_llegada": null,
  "notas": "Producto empacado en caja original"
}
```

#### Errores

| Código | Error | Descripción |
|--------|-------|-------------|
| `403` | `NOT_PARTICIPANT` | No eres parte del intercambio |
| `404` | `TRADE_NOT_FOUND` | Intercambio no existe |
| `409` | `ALREADY_SHIPPED` | Ya enviaste tus productos |
| `409` | `INVALID_STATE` | Estado del intercambio no permite envío |

#### cURL

```bash
curl -X POST https://api.mercado-trueque.com/trades/bb0e8400-e29b-41d4-a716-446655440006/ship \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": "550e8400-e29b-41d4-a716-446655440000",
    "intercambio_id": "bb0e8400-e29b-41d4-a716-446655440006",
    "origen_direccion": "Calle 123 #45-67, Bogotá",
    "destino_direccion": "Centro Distribución Norte, Av. 68 #80-90"
  }'
```

---

### Fase 4: Revisar Productos

El centro de distribución revisa y califica cada producto.

#### Request

```http
POST /trades/:intercambioId/products/:productId/review
Content-Type: application/json
Authorization: Bearer {token}
```

**Parámetros URL**:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `intercambioId` | UUID | ID del intercambio |
| `productId` | UUID | ID del producto a revisar |

**Body**:
```json
{
  "intercambio_id": "bb0e8400-e29b-41d4-a716-446655440006",
  "producto_id": "660e8400-e29b-41d4-a716-446655440001",
  "condition_rating": 4,
  "observations": "Producto en excelente estado, sin rayones ni daños visibles.",
  "photos": [
    "https://storage.example.com/review-photos/foto1.jpg",
    "https://storage.example.com/review-photos/foto2.jpg"
  ]
}
```

**Parámetros Body**:

| Campo | Tipo | Requerido | Validación | Descripción |
|-------|------|-----------|------------|-------------|
| `intercambio_id` | UUID | Sí | UUID válido | ID del intercambio |
| `producto_id` | UUID | Sí | UUID válido | ID del producto |
| `condition_rating` | number | Sí | 1-5 | Calificación del producto |
| `observations` | string | No | Mín 20 chars | Observaciones detalladas |
| `photos` | string[] | No | URLs válidas | Fotos de la inspección |

**Criterios de Calificación**:
- `5 estrellas`: Producto como nuevo, sin defectos
- `4 estrellas`: Producto en muy buen estado, detalles mínimos
- `3 estrellas`: Producto en buen estado, uso evidente pero funcional
- `2 estrellas`: Producto con desgaste considerable
- `1 estrella`: Producto en mal estado o no funcional

**Criterio de Aprobación**:
- `rating >= 3`: **APROBADO**
- `rating < 3`: **RECHAZADO**

#### Response

**Código**: `201 Created`

```json
{
  "id": "ee0e8400-e29b-41d4-a716-446655440009",
  "intercambio_id": "bb0e8400-e29b-41d4-a716-446655440006",
  "producto_id": "660e8400-e29b-41d4-a716-446655440001",
  "calificacion_producto": 4,
  "estado_revision": "APROBADO",
  "fecha_revision": "2025-11-19T14:00:00.000Z"
}
```

#### Errores

| Código | Error | Descripción |
|--------|-------|-------------|
| `400` | `INVALID_RATING` | Calificación debe ser 1-5 |
| `400` | `OBSERVATIONS_TOO_SHORT` | Observaciones deben tener mínimo 20 caracteres |
| `403` | `NOT_AUTHORIZED` | No tienes permisos de revisor |
| `404` | `PRODUCT_NOT_IN_TRADE` | Producto no es parte del intercambio |
| `409` | `ALREADY_REVIEWED` | Producto ya fue revisado |

#### cURL

```bash
curl -X POST https://api.mercado-trueque.com/trades/bb0e8400-e29b-41d4-a716-446655440006/products/660e8400-e29b-41d4-a716-446655440001/review \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "intercambio_id": "bb0e8400-e29b-41d4-a716-446655440006",
    "producto_id": "660e8400-e29b-41d4-a716-446655440001",
    "condition_rating": 4,
    "observations": "Producto en excelente estado general"
  }'
```

---

### Fase 5: Entregar Productos

Los usuarios confirman la recepción de sus productos.

#### Request

```http
POST /trades/:intercambioId/deliver
Content-Type: application/json
Authorization: Bearer {token}
```

**Parámetros URL**:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `intercambioId` | UUID | ID del intercambio |

**Body**:
```json
{
  "usuario_id": "aa0e8400-e29b-41d4-a716-446655440005",
  "intercambio_id": "bb0e8400-e29b-41d4-a716-446655440006",
  "delivery_address": "Carrera 45 #78-90, Apartamento 301, Medellín",
  "delivery_notes": "Dejar con portería si no estoy"
}
```

**Parámetros Body**:

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `usuario_id` | UUID | Sí | ID del usuario que recibe |
| `intercambio_id` | UUID | No | ID del intercambio (opcional, redundante con URL) |
| `delivery_address` | string | Sí | Dirección de entrega final |
| `delivery_notes` | string | No | Notas para el delivery |

#### Response

**Código**: `201 Created`

**Respuesta cuando primer usuario confirma**:
```json
{
  "id": "bb0e8400-e29b-41d4-a716-446655440006",
  "intercambio_id": "bb0e8400-e29b-41d4-a716-446655440006",
  "estado": "ENTREGADO",
  "fecha_completado": null
}
```

**Respuesta cuando segundo usuario confirma**:
```json
{
  "id": "bb0e8400-e29b-41d4-a716-446655440006",
  "intercambio_id": "bb0e8400-e29b-41d4-a716-446655440006",
  "estado": "COMPLETADO",
  "fecha_completado": "2025-11-19T16:00:00.000Z"
}
```

#### Errores

| Código | Error | Descripción |
|--------|-------|-------------|
| `403` | `NOT_PARTICIPANT` | No eres parte del intercambio |
| `404` | `TRADE_NOT_FOUND` | Intercambio no existe |
| `409` | `ALREADY_DELIVERED` | Ya confirmaste la recepción |
| `409` | `INVALID_STATE` | Estado no permite entrega (productos no aprobados) |

#### cURL

```bash
curl -X POST https://api.mercado-trueque.com/trades/bb0e8400-e29b-41d4-a716-446655440006/deliver \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": "aa0e8400-e29b-41d4-a716-446655440005",
    "delivery_address": "Carrera 45 #78-90, Medellín"
  }'
```

---

### Fase 6: Calificar Usuario

Los usuarios se califican mutuamente (opcional).

#### Request

```http
POST /trades/:intercambioId/rate
Content-Type: application/json
Authorization: Bearer {token}
```

**Parámetros URL**:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `intercambioId` | UUID | ID del intercambio completado |

**Body**:
```json
{
  "usuario_id": "550e8400-e29b-41d4-a716-446655440000",
  "intercambio_id": "bb0e8400-e29b-41d4-a716-446655440006",
  "usuario_calificado_id": "aa0e8400-e29b-41d4-a716-446655440005",
  "calificacion_usuario": 5,
  "calificacion_producto": 4,
  "comentario": "Excelente experiencia! Muy responsable.",
  "aspectos_positivos": [
    "Buena comunicación",
    "Producto bien empacado",
    "Envío rápido"
  ],
  "aspectos_negativos": []
}
```

**Parámetros Body**:

| Campo | Tipo | Requerido | Validación | Descripción |
|-------|------|-----------|------------|-------------|
| `usuario_id` | UUID | Sí | UUID válido | Usuario que califica |
| `intercambio_id` | UUID | Sí | UUID válido | ID del intercambio |
| `usuario_calificado_id` | UUID | Sí | UUID válido | Usuario calificado |
| `calificacion_usuario` | number | Sí | 1-5 | Calificación al usuario |
| `calificacion_producto` | number | Sí | 1-5 | Calificación al producto recibido |
| `comentario` | string | No | Máx 500 chars | Comentario detallado |
| `aspectos_positivos` | string[] | No | - | Aspectos positivos |
| `aspectos_negativos` | string[] | No | - | Aspectos a mejorar |

#### Response

**Código**: `201 Created`

```json
{
  "id": "ff0e8400-e29b-41d4-a716-446655440010",
  "intercambio_id": "bb0e8400-e29b-41d4-a716-446655440006",
  "usuario_calificador_id": "550e8400-e29b-41d4-a716-446655440000",
  "usuario_calificado_id": "aa0e8400-e29b-41d4-a716-446655440005",
  "calificacion_usuario": 5,
  "calificacion_producto": 4,
  "comentario": "Excelente experiencia! Muy responsable.",
  "fecha_resena": "2025-11-19T17:00:00.000Z"
}
```

#### Errores

| Código | Error | Descripción |
|--------|-------|-------------|
| `400` | `INVALID_RATING` | Calificaciones deben ser 1-5 |
| `400` | `COMMENT_TOO_LONG` | Comentario excede 500 caracteres |
| `403` | `NOT_PARTICIPANT` | No eres parte del intercambio |
| `404` | `TRADE_NOT_FOUND` | Intercambio no existe |
| `409` | `ALREADY_RATED` | Ya calificaste en este intercambio |
| `409` | `TRADE_NOT_COMPLETED` | Intercambio no está completado |
| `422` | `SELF_RATING` | No puedes calificarte a ti mismo |

#### cURL

```bash
curl -X POST https://api.mercado-trueque.com/trades/bb0e8400-e29b-41d4-a716-446655440006/rate \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": "550e8400-e29b-41d4-a716-446655440000",
    "intercambio_id": "bb0e8400-e29b-41d4-a716-446655440006",
    "usuario_calificado_id": "aa0e8400-e29b-41d4-a716-446655440005",
    "calificacion_usuario": 5,
    "calificacion_producto": 4,
    "comentario": "Excelente experiencia!"
  }'
```

---

## Endpoints de Consulta

### Obtener Intercambios del Usuario

Retorna todos los intercambios donde el usuario participa.

#### Request

```http
GET /trades/user/:userId
Authorization: Bearer {token}
```

**Parámetros URL**:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `userId` | UUID | ID del usuario |

**Query Parameters** (opcionales):

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `estado` | string | - | Filtrar por estado |
| `page` | number | 1 | Número de página |
| `limit` | number | 10 | Items por página |

#### Response

**Código**: `200 OK`

```json
{
  "data": [
    {
      "id": "bb0e8400-e29b-41d4-a716-446655440006",
      "propuesta_id": "990e8400-e29b-41d4-a716-446655440004",
      "estado": "EN_ENVIO",
      "fecha_inicio": "2025-11-19T11:00:00.000Z",
      "centro_distribucion_id": "cc0e8400-e29b-41d4-a716-446655440007",
      "participantes": [
        {
          "usuario_id": "550e8400-e29b-41d4-a716-446655440000",
          "rol": "oferente"
        },
        {
          "usuario_id": "aa0e8400-e29b-41d4-a716-446655440005",
          "rol": "receptor"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### cURL

```bash
curl -X GET "https://api.mercado-trueque.com/trades/user/550e8400-e29b-41d4-a716-446655440000?estado=EN_ENVIO&page=1&limit=10" \
  -H "Authorization: Bearer {token}"
```

---

### Obtener Propuestas Recibidas

Retorna propuestas donde el usuario es el receptor.

#### Request

```http
GET /trades/proposals/received/:userId
Authorization: Bearer {token}
```

**Query Parameters**:

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `estado` | string | - | Filtrar por estado (PROPUESTA, ACEPTADA, RECHAZADA) |
| `page` | number | 1 | Página |
| `limit` | number | 10 | Items por página |

#### Response

**Código**: `200 OK`

```json
{
  "data": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440004",
      "usuario_oferente": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "nombre": "Juan Pérez",
        "calificacion_promedio": 4.5
      },
      "productos_ofrecidos": [
        {
          "id": "660e8400-e29b-41d4-a716-446655440001",
          "nombre": "Bicicleta Montaña",
          "categoria": "Deportes"
        }
      ],
      "producto_solicitado": {
        "id": "880e8400-e29b-41d4-a716-446655440003",
        "nombre": "Patineta Eléctrica"
      },
      "estado": "PROPUESTA",
      "mensaje": "Hola! Estoy interesado en tu producto.",
      "fecha_propuesta": "2025-11-19T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

---

### Obtener Intercambios Pendientes de Revisión

Endpoint para revisores del centro de distribución.

#### Request

```http
GET /trades/pending-review/list
Authorization: Bearer {token}
```

**Query Parameters**:

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `centro_id` | UUID | - | Filtrar por centro |
| `page` | number | 1 | Página |
| `limit` | number | 20 | Items por página |

#### Response

**Código**: `200 OK`

```json
{
  "data": [
    {
      "intercambio_id": "bb0e8400-e29b-41d4-a716-446655440006",
      "estado": "EN_ENVIO",
      "fecha_inicio": "2025-11-19T11:00:00.000Z",
      "productos_pendientes": [
        {
          "id": "660e8400-e29b-41d4-a716-446655440001",
          "nombre": "Bicicleta",
          "enviado_por": "Juan Pérez",
          "fecha_envio": "2025-11-19T12:00:00.000Z"
        }
      ],
      "total_productos": 3,
      "productos_revisados": 0
    }
  ],
  "total": 12
}
```

---

### Obtener Detalles de Envíos

Retorna información de los envíos de un intercambio.

#### Request

```http
GET /trades/:intercambioId/shipments
Authorization: Bearer {token}
```

#### Response

**Código**: `200 OK`

```json
{
  "intercambio_id": "bb0e8400-e29b-41d4-a716-446655440006",
  "envios": [
    {
      "id": "dd0e8400-e29b-41d4-a716-446655440008",
      "usuario": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "nombre": "Juan Pérez"
      },
      "tracking_code": "TRK-2025-001234",
      "origen_direccion": "Calle 123 #45-67, Bogotá",
      "destino_direccion": "Centro Norte, Av. 68 #80-90",
      "estado_envio": "EN_TRANSITO",
      "fecha_envio": "2025-11-19T12:00:00.000Z",
      "fecha_llegada": null
    },
    {
      "id": "dd0e8400-e29b-41d4-a716-446655440009",
      "usuario": {
        "id": "aa0e8400-e29b-41d4-a716-446655440005",
        "nombre": "María García"
      },
      "tracking_code": "TRK-2025-001235",
      "estado_envio": "ENTREGADO",
      "fecha_envio": "2025-11-19T12:30:00.000Z",
      "fecha_llegada": "2025-11-19T15:00:00.000Z"
    }
  ]
}
```

---

## Modelos de Datos

### TradeProposal (Propuesta)

```typescript
interface TradeProposal {
  id: string;                    // UUID
  usuario_oferente_id: string;   // UUID del oferente
  producto_solicitado_id: string; // UUID del producto deseado
  estado: ProposalState;         // PROPUESTA | ACEPTADA | RECHAZADA | AUTO_RECHAZADA
  mensaje?: string;              // Mensaje opcional
  fecha_propuesta: Date;         // Timestamp de creación
  fecha_respuesta?: Date;        // Timestamp de respuesta
}
```

### Intercambio (Trade)

```typescript
interface Intercambio {
  id: string;                      // UUID
  propuesta_id: string;            // UUID de la propuesta origen
  estado: TradeState;              // Estado actual del intercambio
  fecha_inicio: Date;              // Inicio del intercambio
  fecha_completado?: Date;         // Fecha de finalización
  centro_distribucion_id: string;  // UUID del centro asignado
}
```

### Envio (Shipment)

```typescript
interface Envio {
  id: string;                 // UUID
  intercambio_id: string;     // UUID del intercambio
  usuario_id: string;         // UUID del usuario que envía
  tracking_code: string;      // Código de tracking (TRK-YYYY-NNNNNN)
  origen_direccion: string;   // Dirección origen
  destino_direccion: string;  // Dirección destino (centro)
  estado_envio: ShipmentState; // EN_TRANSITO | ENTREGADO | PERDIDO
  fecha_envio: Date;          // Fecha de envío
  fecha_llegada?: Date;       // Fecha de llegada al centro
  notas?: string;             // Notas adicionales
}
```

### Revision (Review)

```typescript
interface Revision {
  id: string;                   // UUID
  intercambio_id: string;       // UUID del intercambio
  producto_id: string;          // UUID del producto revisado
  calificacion_producto: number; // 1-5 estrellas
  estado_revision: ReviewState;  // APROBADO | RECHAZADO
  observations?: string;         // Observaciones detalladas
  photos?: string[];            // URLs de fotos
  fecha_revision: Date;         // Fecha de la revisión
}
```

### Calificacion (Rating)

```typescript
interface Calificacion {
  id: string;                      // UUID
  intercambio_id: string;          // UUID del intercambio
  usuario_calificador_id: string;  // UUID de quien califica
  usuario_calificado_id: string;   // UUID de quien recibe la calificación
  calificacion_usuario: number;    // 1-5 estrellas al usuario
  calificacion_producto: number;   // 1-5 estrellas al producto
  comentario?: string;             // Comentario (max 500 chars)
  aspectos_positivos?: string[];   // Lista de aspectos positivos
  aspectos_negativos?: string[];   // Lista de aspectos negativos
  fecha_resena: Date;              // Fecha de la calificación
}
```

### Enums

```typescript
enum ProposalState {
  PROPUESTA = 'PROPUESTA',
  ACEPTADA = 'ACEPTADA',
  RECHAZADA = 'RECHAZADA',
  AUTO_RECHAZADA = 'AUTO_RECHAZADA'
}

enum TradeState {
  PROPUESTA = 'PROPUESTA',
  ACEPTADA = 'ACEPTADA',
  RECHAZADA = 'RECHAZADA',
  AUTO_RECHAZADA = 'AUTO_RECHAZADA',
  EN_ENVIO = 'EN_ENVIO',
  EN_REVISION = 'EN_REVISION',
  REVISION_RECHAZADA = 'REVISION_RECHAZADA',
  ENTREGADO = 'ENTREGADO',
  COMPLETADO = 'COMPLETADO'
}

enum ShipmentState {
  EN_TRANSITO = 'EN_TRANSITO',
  ENTREGADO = 'ENTREGADO',
  PERDIDO = 'PERDIDO'
}

enum ReviewState {
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO'
}
```

---

## Errores Comunes

### Error de Validación (400)

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Datos de entrada inválidos",
    "details": [
      {
        "field": "calificacion_usuario",
        "value": 6,
        "message": "Debe ser un número entre 1 y 5"
      }
    ]
  }
}
```

### Error de Autenticación (401)

```json
{
  "status": "error",
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token de acceso inválido o expirado"
  }
}
```

### Error de Permisos (403)

```json
{
  "status": "error",
  "error": {
    "code": "FORBIDDEN",
    "message": "No tienes permisos para realizar esta operación",
    "details": [
      {
        "reason": "Solo el dueño del producto puede aceptar la propuesta"
      }
    ]
  }
}
```

### Recurso No Encontrado (404)

```json
{
  "status": "error",
  "error": {
    "code": "NOT_FOUND",
    "message": "Propuesta no encontrada",
    "resource": "TradeProposal",
    "id": "990e8400-e29b-41d4-a716-446655440004"
  }
}
```

### Conflicto de Estado (409)

```json
{
  "status": "error",
  "error": {
    "code": "CONFLICT",
    "message": "La propuesta ya fue respondida",
    "current_state": "ACEPTADA",
    "expected_state": "PROPUESTA"
  }
}
```

### Error de Negocio (422)

```json
{
  "status": "error",
  "error": {
    "code": "BUSINESS_RULE_VIOLATION",
    "message": "No puedes intercambiar productos contigo mismo",
    "rule": "NO_SELF_TRADE"
  }
}
```

---

## Ejemplos de Flujo Completo

### Ejemplo 1: Intercambio Exitoso con JavaScript/Fetch

```javascript
const API_BASE = 'https://api.mercado-trueque.com';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

// FASE 1: Crear Propuesta
const createProposal = async () => {
  const response = await fetch(`${API_BASE}/trades/proposals`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      usuario_oferente_id: 'user-juan-id',
      productos_ofrecidos: ['producto-bici-id'],
      producto_solicitado_id: 'producto-patineta-id',
      mensaje: 'Interesado en tu patineta'
    })
  });

  const propuesta = await response.json();
  console.log('Propuesta creada:', propuesta.id);
  return propuesta.id;
};

// FASE 2: Aceptar Propuesta (desde cuenta de María)
const acceptProposal = async (proposalId) => {
  const response = await fetch(`${API_BASE}/trades/proposals/${proposalId}/accept`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      usuario_aceptante_id: 'user-maria-id'
    })
  });

  const intercambio = await response.json();
  console.log('Intercambio creado:', intercambio.id);
  return intercambio.id;
};

// FASE 3: Enviar Productos
const shipProducts = async (intercambioId, userId) => {
  const response = await fetch(`${API_BASE}/trades/${intercambioId}/ship`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      usuario_id: userId,
      intercambio_id: intercambioId,
      origen_direccion: 'Calle 123, Bogotá',
      destino_direccion: 'Centro Norte, Av 68'
    })
  });

  const envio = await response.json();
  console.log('Tracking code:', envio.tracking_code);
  return envio.tracking_code;
};

// FASE 4: Revisar Producto (desde cuenta de centro)
const reviewProduct = async (intercambioId, productId) => {
  const response = await fetch(
    `${API_BASE}/trades/${intercambioId}/products/${productId}/review`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        intercambio_id: intercambioId,
        producto_id: productId,
        condition_rating: 4,
        observations: 'Producto en excelente estado general'
      })
    }
  );

  const review = await response.json();
  console.log('Producto revisado:', review.estado_revision);
  return review;
};

// FASE 5: Confirmar Entrega
const confirmDelivery = async (intercambioId, userId) => {
  const response = await fetch(`${API_BASE}/trades/${intercambioId}/deliver`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      usuario_id: userId,
      delivery_address: 'Carrera 45, Medellín'
    })
  });

  const result = await response.json();
  console.log('Estado del intercambio:', result.estado);
  return result;
};

// FASE 6: Calificar Usuario
const rateUser = async (intercambioId, calificadorId, calificadoId) => {
  const response = await fetch(`${API_BASE}/trades/${intercambioId}/rate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      usuario_id: calificadorId,
      intercambio_id: intercambioId,
      usuario_calificado_id: calificadoId,
      calificacion_usuario: 5,
      calificacion_producto: 4,
      comentario: 'Excelente experiencia!'
    })
  });

  const rating = await response.json();
  console.log('Calificación registrada:', rating.id);
  return rating;
};

// Ejecutar flujo completo
(async () => {
  try {
    const proposalId = await createProposal();
    const intercambioId = await acceptProposal(proposalId);

    // Ambos usuarios envían
    await shipProducts(intercambioId, 'user-juan-id');
    await shipProducts(intercambioId, 'user-maria-id');

    // Centro revisa productos
    await reviewProduct(intercambioId, 'producto-bici-id');
    await reviewProduct(intercambioId, 'producto-patineta-id');

    // Ambos confirman entrega
    await confirmDelivery(intercambioId, 'user-juan-id');
    await confirmDelivery(intercambioId, 'user-maria-id');

    // Calificaciones mutuas
    await rateUser(intercambioId, 'user-juan-id', 'user-maria-id');
    await rateUser(intercambioId, 'user-maria-id', 'user-juan-id');

    console.log('Intercambio completado exitosamente!');
  } catch (error) {
    console.error('Error en el flujo:', error);
  }
})();
```

---

### Ejemplo 2: Python con Requests

```python
import requests

API_BASE = 'https://api.mercado-trueque.com'
TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

headers = {
    'Authorization': f'Bearer {TOKEN}',
    'Content-Type': 'application/json'
}

# FASE 1: Crear Propuesta
def create_proposal():
    response = requests.post(
        f'{API_BASE}/trades/proposals',
        headers=headers,
        json={
            'usuario_oferente_id': 'user-juan-id',
            'productos_ofrecidos': ['producto-bici-id'],
            'producto_solicitado_id': 'producto-patineta-id',
            'mensaje': 'Interesado en tu patineta'
        }
    )
    response.raise_for_status()
    return response.json()['id']

# FASE 2: Aceptar Propuesta
def accept_proposal(proposal_id):
    response = requests.post(
        f'{API_BASE}/trades/proposals/{proposal_id}/accept',
        headers=headers,
        json={'usuario_aceptante_id': 'user-maria-id'}
    )
    response.raise_for_status()
    return response.json()['id']

# Ejecutar
try:
    proposal_id = create_proposal()
    print(f'Propuesta creada: {proposal_id}')

    trade_id = accept_proposal(proposal_id)
    print(f'Intercambio creado: {trade_id}')

except requests.exceptions.HTTPError as e:
    print(f'Error HTTP: {e.response.status_code}')
    print(f'Detalle: {e.response.json()}')
```

---

## Rate Limiting

Todos los endpoints tienen límites de tasa para prevenir abuso:

| Endpoint | Límite | Ventana |
|----------|--------|---------|
| Crear Propuesta | 10 requests | 1 hora |
| Aceptar/Rechazar | 20 requests | 1 hora |
| Enviar Productos | 5 requests | 1 hora |
| Revisar Productos | 50 requests | 1 hora (solo centros) |
| Calificar | 10 requests | 1 día |
| Consultas (GET) | 100 requests | 15 minutos |

**Headers de Rate Limit**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1732017600
```

Cuando se excede el límite:
```json
{
  "status": "error",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Demasiadas solicitudes. Intenta de nuevo en 15 minutos.",
    "retry_after": 900
  }
}
```

---

## Versionamiento

La API usa versionamiento mediante URL:

- Versión actual: `v1`
- URL: `https://api.mercado-trueque.com/v1/trades/...`

Se mantendrá soporte para versiones anteriores por al menos 12 meses después de lanzar una nueva versión.

---

## Soporte y Contacto

- **Documentación**: https://docs.mercado-trueque.com
- **Email Soporte**: api-support@mercado-trueque.com
- **Estado del Servicio**: https://status.mercado-trueque.com
- **Changelog**: https://docs.mercado-trueque.com/changelog

---

**Versión de API**: 1.0.0
**Última Actualización**: 2025-11-19
**Mantenido por**: Equipo Backend Mercado Trueque
