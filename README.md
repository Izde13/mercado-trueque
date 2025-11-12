# Mercado Trueque

Plataforma de intercambio (trueque) de productos entre usuarios, implementada con NestJS, PostgreSQL y Prisma.

## Tabla de Contenidos

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de Entorno](#variables-de-entorno)
- [Comandos Disponibles](#comandos-disponibles)
- [Documentación API](#documentación-api)
- [Flujo de Trueque](#flujo-de-trueque)
- [Autenticación y Autorización](#autenticación-y-autorización)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)

## Características

- **Autenticación JWT** con sistema de roles (admin, usuario, vendedor, moderator, revisor)
- **Gestión de Productos** con categorías y estados
- **Sistema de Trueque Completo** (6 fases: propuesta → aceptación → envío → revisión → entrega → calificación)
- **Documentación Swagger** interactiva con autenticación Bearer
- **Arquitectura Hexagonal** (Domain-Driven Design)
- **Seguridad OWASP** con validaciones, sanitización y logging
- **Patrones de Diseño**: Specifications, State Machine, SAGA, Command Pattern
- **PostgreSQL** con Prisma ORM

## Arquitectura

Este proyecto implementa **Arquitectura Hexagonal (Ports & Adapters)** con Domain-Driven Design:

```mermaid
graph TB
    subgraph "Presentation Layer"
        A[Controllers] --> B[DTOs]
    end

    subgraph "Application Layer"
        C[Use Cases] --> D[Application DTOs]
        C --> E[Validators]
    end

    subgraph "Domain Layer"
        F[Entities] --> G[Value Objects]
        F --> H[Domain Events]
        I[Specifications] --> F
        J[State Machines] --> F
        K[SAGA Orchestrators] --> F
        L[Commands] --> F
        M[Repository Interfaces]
    end

    subgraph "Infrastructure Layer"
        N[Prisma Repositories] --> M
        O[Database Config] --> N
        P[External Services]
    end

    A --> C
    C --> F
    C --> M
    N --> O

    style F fill:#ff9999
    style C fill:#99ccff
    style A fill:#99ff99
    style N fill:#ffcc99
```

### Capas de la Arquitectura

1. **Presentation** (`src/presentation`): Controladores y DTOs de respuesta
2. **Application** (`src/application`): Casos de uso, DTOs de entrada y validadores
3. **Domain** (`src/domain`): Lógica de negocio, entidades, VOs, especificaciones
4. **Infrastructure** (`src/infrastructure`): Implementación de repositorios, configuración

## Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x o **pnpm** >= 8.x
- **PostgreSQL** >= 14.x
- **Git**

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Izde13/mercado-trueque.git
cd mercado-trueque
```

### 2. Navegar al directorio del servidor

```bash
cd server
```

### 3. Instalar dependencias

```bash
npm install
# o si usas pnpm
pnpm install
```

### 4. Configurar variables de entorno

Crea un archivo `.env` en el directorio `server/` con las siguientes variables:

```env
# Database Configuration
DATABASE_HOST=tu-host.postgres.database.azure.com
DATABASE_PORT=5432
DATABASE_USERNAME=tu-usuario
DATABASE_PASSWORD=tu-contraseña
DATABASE_NAME=postgres
DATABASE_SCHEMA=mercadotrueque

# Prisma Connection String
DATABASE_URL="postgresql://usuario:contraseña@host:5432/postgres?schema=mercadotrueque&sslmode=require"

# JWT Configuration (opcional)
JWT_SECRET=tu-secreto-jwt-super-seguro
JWT_EXPIRATION=24h

# Application
PORT=3000
```

### 5. Sincronizar la base de datos

```bash
# Generar el cliente de Prisma
npx prisma generate

# Aplicar migraciones (si existen)
npx prisma migrate deploy

# O sincronizar el esquema directamente (desarrollo)
npx prisma db push
```

### 6. Ejecutar seed (opcional)

Si existe un archivo de seed para datos iniciales:

```bash
npx prisma db seed
```

### 7. Iniciar el servidor

```bash
# Modo desarrollo (con hot-reload)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

El servidor estará disponible en:
- API: http://localhost:3000/api/v1
- Swagger: http://localhost:3000/api-docs

## Variables de Entorno

| Variable | Descripción | Ejemplo | Requerida |
|----------|-------------|---------|-----------|
| `DATABASE_HOST` | Host de PostgreSQL | `localhost` | ✅ |
| `DATABASE_PORT` | Puerto de PostgreSQL | `5432` | ✅ |
| `DATABASE_USERNAME` | Usuario de la BD | `postgres` | ✅ |
| `DATABASE_PASSWORD` | Contraseña de la BD | `password123` | ✅ |
| `DATABASE_NAME` | Nombre de la base de datos | `postgres` | ✅ |
| `DATABASE_SCHEMA` | Esquema de PostgreSQL | `mercadotrueque` | ✅ |
| `DATABASE_URL` | Connection string completa | Ver ejemplo arriba | ✅ |
| `JWT_SECRET` | Secreto para firmar tokens JWT | `mysecret123` | ❌ |
| `JWT_EXPIRATION` | Tiempo de expiración del token | `24h` | ❌ |
| `PORT` | Puerto del servidor | `3000` | ❌ |

## Comandos Disponibles

### Desarrollo

```bash
# Iniciar en modo desarrollo (hot-reload)
npm run start:dev

# Iniciar en modo debug
npm run start:debug
```

### Producción

```bash
# Compilar el proyecto
npm run build

# Iniciar en modo producción
npm run start:prod
```

### Testing

```bash
# Ejecutar tests unitarios
npm run test

# Tests en modo watch
npm run test:watch

# Coverage de tests
npm run test:cov

# Tests e2e
npm run test:e2e
```

### Code Quality

```bash
# Formatear código con Prettier
npm run format

# Ejecutar ESLint
npm run lint
```

### Prisma

```bash
# Generar cliente de Prisma
npx prisma generate

# Crear una migración
npx prisma migrate dev --name nombre-migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Sincronizar esquema (desarrollo)
npx prisma db push

# Abrir Prisma Studio (GUI)
npx prisma studio

# Ejecutar seed
npx prisma db seed
```

## Documentación API

### Swagger UI

Una vez iniciado el servidor, accede a la documentación interactiva en:

**http://localhost:3000/api-docs**

### Autenticación en Swagger

1. Haz login en el endpoint `POST /api/v1/auth/login`
2. Copia el `access_token` de la respuesta
3. Haz clic en el botón **"Authorize"** en la parte superior derecha
4. Pega el token en el campo (sin el prefijo "Bearer")
5. Haz clic en "Authorize"
6. Ahora puedes acceder a los endpoints protegidos

### Endpoints Principales

#### Autenticación

- `POST /api/v1/auth/register` - Registrar nuevo usuario
- `POST /api/v1/auth/login` - Login de usuario (retorna JWT)
- `GET /api/v1/auth/admin/dashboard` - Dashboard admin (requiere rol admin)
- `POST /api/v1/auth/admin/assign-role` - Asignar rol (requiere rol admin)

#### Productos

- `GET /api/v1/products` - Listar productos (con filtros opcionales)
- `GET /api/v1/products/:id` - Obtener producto por ID
- `POST /api/v1/products` - Crear producto (requiere autenticación)

#### Categorías

- `GET /api/v1/categories` - Listar categorías (requiere autenticación)
- `GET /api/v1/categories/:id` - Obtener categoría (requiere autenticación)
- `POST /api/v1/categories` - Crear categoría (requiere rol admin)
- `PUT /api/v1/categories/:id` - Actualizar categoría (requiere rol admin)

#### Trueques

- `GET /api/v1/trades/user/:userId` - Obtener intercambios del usuario
- `GET /api/v1/trades/proposals/received/:userId` - Propuestas recibidas
- `POST /api/v1/trades/proposals` - Crear propuesta (FASE 1)
- `POST /api/v1/trades/proposals/:id/accept` - Aceptar propuesta (FASE 2)
- `POST /api/v1/trades/:id/ship` - Enviar productos (FASE 3)
- `POST /api/v1/trades/:id/products/:productId/review` - Revisar producto (FASE 4)
- `POST /api/v1/trades/:id/deliver` - Marcar entrega (FASE 5)
- `POST /api/v1/trades/:id/rate` - Calificar intercambio (FASE 6)

## Flujo de Trueque

El sistema implementa un proceso completo de trueque con **6 fases** bien definidas, utilizando una **máquina de estados finita** para garantizar la integridad del proceso.

### Máquina de Estados del Intercambio

```mermaid
stateDiagram-v2
    [*] --> PENDIENTE: Usuario crea propuesta

    PENDIENTE --> INICIADO: Usuario acepta propuesta
    PENDIENTE --> RECHAZADA: Usuario rechaza
    PENDIENTE --> EXPIRADA: Timeout (7 días)

    INICIADO --> PRODUCTOS_ENVIADOS: Ambos usuarios envían productos
    INICIADO --> CANCELADO: Usuario cancela

    PRODUCTOS_ENVIADOS --> EN_REVISION: Todos productos APROBADOS
    PRODUCTOS_ENVIADOS --> CANCELADO: Algún producto RECHAZADO

    EN_REVISION --> COMPLETADO: Ambos usuarios marcan entrega

    COMPLETADO --> CALIFICADO: Ambos usuarios califican
    COMPLETADO --> [*]: Fin del ciclo

    RECHAZADA --> [*]
    EXPIRADA --> [*]
    CANCELADO --> [*]: Productos devueltos
    CALIFICADO --> [*]

    note right of PENDIENTE
        Estado inicial
        Espera aceptación
    end note

    note right of COMPLETADO
        Estado final exitoso
        Puede calificarse
    end note
```

### Estados del Intercambio

| Estado | Descripción | Transiciones Permitidas | Actor |
|--------|-------------|------------------------|-------|
| **PENDIENTE** | Propuesta creada, esperando respuesta | → INICIADO, RECHAZADA, EXPIRADA | Receptor |
| **INICIADO** | Propuesta aceptada, intercambio iniciado | → PRODUCTOS_ENVIADOS, CANCELADO | Ambos usuarios |
| **PRODUCTOS_ENVIADOS** | Ambos enviaron al centro | → EN_REVISION, CANCELADO | Centro/Sistema |
| **EN_REVISION** | Productos aprobados, listos para entregar | → COMPLETADO | Ambos usuarios |
| **COMPLETADO** | Ambos recibieron productos | → CALIFICADO | Ambos usuarios |
| **CALIFICADO** | Intercambio finalizado con calificaciones | → (fin) | Sistema |
| **RECHAZADA** | Propuesta rechazada por receptor | → (fin) | - |
| **EXPIRADA** | Propuesta sin respuesta (7 días) | → (fin) | Sistema |
| **CANCELADO** | Intercambio cancelado (productos rechazados) | → (fin) | Sistema |

### Diagrama de Secuencia Completo

```mermaid
sequenceDiagram
    participant J as Juan (Oferente)
    participant S as Sistema
    participant M as María (Receptor)
    participant C as Centro Distribución
    participant DB as Base de Datos

    rect rgb(200, 220, 255)
    Note over J,S,M: FASE 1 - Crear Propuesta de Trueque
    J->>S: POST /trades/proposals
    activate S
    S->>S: Validar productos disponibles
    S->>S: Validar usuario tiene rating
    S->>DB: Crear PropuestaTrueque (estado: PENDIENTE)
    DB-->>S: PropuestaTrueque creada
    S-->>J: 201 Created - Propuesta creada
    deactivate S
    S->>M: Notificación: Nueva propuesta recibida
    end

    rect rgb(220, 255, 220)
    Note over J,S,M: FASE 2 - Aceptar Propuesta
    M->>S: POST /trades/proposals/:id/accept
    activate S
    S->>S: Validar es dueño del producto
    S->>S: Validar productos disponibles
    S->>S: Asignar centro de distribución
    S->>DB: Crear Intercambio (estado: INICIADO)
    S->>DB: Actualizar PropuestaTrueque (ACEPTADA)
    S->>DB: Marcar productos como EN_INTERCAMBIO
    DB-->>S: Intercambio creado
    S-->>M: 201 Created - Intercambio iniciado
    deactivate S
    S->>J: Propuesta aceptada por María
    S->>M: Propuesta aceptada, envía tus productos
    end

    rect rgb(255, 240, 200)
    Note over J,C: FASE 3 - Enviar Productos (Juan)
    J->>S: POST /trades/:id/ship
    activate S
    S->>DB: Crear Envio (Juan → Centro)
    S->>DB: Generar código tracking
    DB-->>S: Envio creado
    S-->>J: 201 Created - Envío registrado
    deactivate S
    J->>C: Envía productos físicamente
    end

    rect rgb(255, 240, 200)
    Note over M,C: FASE 3 - Enviar Productos (María)
    M->>S: POST /trades/:id/ship
    activate S
    S->>DB: Crear Envio (María → Centro)
    S->>DB: Verificar si ambos enviaron
    S->>DB: Actualizar estado: PRODUCTOS_ENVIADOS
    DB-->>S: Estado actualizado
    S-->>M: 201 Created - Envío registrado
    deactivate S
    M->>C: Envía producto físicamente
    S->>J: Ambos productos enviados
    S->>M: Ambos productos enviados
    end

    rect rgb(255, 220, 220)
    Note over C,S: FASE 4 - Revisar Productos en Centro
    C->>C: Recibe producto de Juan
    C->>S: POST /trades/:id/products/:productId/review
    activate S
    S->>S: Validar calificación (1-5)
    S->>DB: Crear RevisionProducto
    S->>DB: Estado: APROBADO (rating >= 3) o RECHAZADO (< 3)
    DB-->>S: Revisión registrada
    S-->>C: 201 Created - Revisión guardada
    deactivate S

    C->>C: Recibe producto de María
    C->>S: POST /trades/:id/products/:productId/review
    activate S
    S->>DB: Crear RevisionProducto
    S->>S: Verificar si todos aprobados
    alt Todos aprobados
        S->>DB: Actualizar estado: EN_REVISION
        S->>J: Productos aprobados, en camino
        S->>M: Productos aprobados, en camino
    else Alguno rechazado
        S->>DB: Actualizar estado: CANCELADO
        S->>J: Intercambio cancelado (productos rechazados)
        S->>M: Intercambio cancelado (productos rechazados)
    end
    S-->>C: 201 Created - Revisión completada
    deactivate S
    end

    rect rgb(220, 255, 240)
    Note over C,M: FASE 5 - Entregar Productos (a María)
    C->>M: Entrega productos de Juan
    M->>S: POST /trades/:id/deliver
    activate S
    S->>DB: Crear Entrega (productos Juan → María)
    S->>DB: Marcar entrega como COMPLETADA
    DB-->>S: Entrega registrada
    S-->>M: 201 Created - Entrega confirmada
    deactivate S
    end

    rect rgb(220, 255, 240)
    Note over C,J: FASE 5 - Entregar Productos (a Juan)
    C->>J: Entrega producto de María
    J->>S: POST /trades/:id/deliver
    activate S
    S->>DB: Crear Entrega (producto María → Juan)
    S->>DB: Verificar si ambos recibieron
    S->>DB: Actualizar estado: COMPLETADO
    DB-->>S: Intercambio completado
    S-->>J: 201 Created - Intercambio completado
    deactivate S
    S->>J: Intercambio completado, califica
    S->>M: Intercambio completado, califica
    end

    rect rgb(240, 220, 255)
    Note over J,M: FASE 6 - Calificar Mutuamente
    J->>S: POST /trades/:id/rate
    activate S
    S->>DB: Crear Calificacion (Juan → María)
    S->>DB: Calificación usuario: 5/5
    S->>DB: Calificación producto: 5/5
    DB-->>S: Calificación guardada
    S-->>J: 201 Created - Calificación registrada
    deactivate S

    M->>S: POST /trades/:id/rate
    activate S
    S->>DB: Crear Calificacion (María → Juan)
    S->>DB: Verificar si ambos calificaron
    S->>DB: Actualizar reputación de Juan
    S->>DB: Actualizar reputación de María
    S->>DB: Actualizar estado: CALIFICADO
    DB-->>S: Reputaciones actualizadas
    S-->>M: 201 Created - Proceso finalizado
    deactivate S
    S->>J: María te calificó
    S->>M: Juan te calificó
    end
```

### Descripción Detallada de Cada Fase

#### FASE 1: Crear Propuesta de Trueque

**Objetivo**: Usuario oferente (Juan) crea una propuesta para intercambiar sus productos por un producto de otro usuario (María).

**Proceso**:
1. Juan selecciona el producto de María que desea
2. Juan selecciona 1-5 de sus productos para ofrecer a cambio
3. Sistema valida:
   - Productos disponibles (estado PUBLICADO)
   - Usuario tiene rating suficiente
   - No hay propuestas duplicadas
4. Se crea la propuesta con estado **PENDIENTE**
5. María recibe notificación

**Endpoint**: `POST /api/v1/trades/proposals`

**Validaciones**:
- ✅ Producto solicitado existe y está PUBLICADO
- ✅ Productos ofrecidos están PUBLICADOS
- ✅ Usuario tiene rating >= requerido
- ✅ Entre 1 y 5 productos ofrecidos
- ❌ No se puede hacer propuesta duplicada

---

#### FASE 2: Aceptar Propuesta

**Objetivo**: Usuario receptor (María) acepta la propuesta y se crea el intercambio oficial.

**Proceso**:
1. María revisa la propuesta recibida
2. Decide aceptar o rechazar
3. Si acepta:
   - Se crea el **Intercambio** con estado **INICIADO**
   - Se asigna un centro de distribución geográficamente cercano
   - Productos se marcan como EN_INTERCAMBIO
   - Ambos usuarios reciben notificación

**Endpoint**: `POST /api/v1/trades/proposals/:id/accept`

**Validaciones**:
- ✅ Propuesta en estado PENDIENTE
- ✅ Usuario es el receptor de la propuesta
- ✅ Ambos usuarios activos
- ✅ Todos los productos siguen disponibles
- ✅ Centro de distribución asignado

---

#### FASE 3: Enviar Productos

**Objetivo**: Ambos usuarios envían sus productos al centro de distribución asignado.

**Proceso**:
1. Cada usuario empaqueta sus productos
2. Registra el envío en el sistema
3. Sistema genera código de tracking
4. Cuando **AMBOS** han enviado:
   - Estado cambia a **PRODUCTOS_ENVIADOS**
   - Centro de distribución recibe notificación

**Endpoint**: `POST /api/v1/trades/:id/ship`

**Datos del Envío**:
- Dirección origen (usuario)
- Dirección destino (centro)
- Código de tracking (auto-generado)
- Fecha de envío
- Notas opcionales

**Validaciones**:
- ✅ Intercambio en estado INICIADO
- ✅ Usuario está involucrado en el intercambio
- ✅ No ha enviado previamente

---

#### FASE 4: Revisar Productos

**Objetivo**: Centro de distribución inspecciona cada producto recibido y lo califica.

**Proceso**:
1. Centro recibe productos físicamente
2. Por CADA producto:
   - Inspección física del estado
   - Calificación de condición (1-5 estrellas)
   - Fotografías del producto
   - Observaciones
3. Decisión:
   - **Rating >= 3**: Producto APROBADO
   - **Rating < 3**: Producto RECHAZADO
4. Cuando TODOS los productos de AMBOS usuarios están aprobados:
   - Estado cambia a **EN_REVISION**
5. Si algún producto es rechazado:
   - Estado cambia a **CANCELADO**
   - Productos se devuelven a sus dueños

**Endpoint**: `POST /api/v1/trades/:id/products/:productId/review`

**Datos de Revisión**:
- Calificación de condición (1-5)
- Observaciones del revisor
- Fotografías del producto
- Timestamp de revisión

**Validaciones**:
- ✅ Intercambio en estado PRODUCTOS_ENVIADOS
- ✅ Producto pertenece al intercambio
- ✅ Calificación válida (1-5)

---

#### FASE 5: Entregar Productos

**Objetivo**: Centro distribuye los productos aprobados a los destinos finales.

**Proceso**:
1. Centro envía productos de Juan a María
2. María recibe y confirma entrega en sistema
3. Centro envía producto de María a Juan
4. Juan recibe y confirma entrega en sistema
5. Cuando **AMBOS** confirman:
   - Estado cambia a **COMPLETADO**
   - Sistema habilita calificaciones

**Endpoint**: `POST /api/v1/trades/:id/deliver`

**Datos de Entrega**:
- Dirección de entrega final
- Fecha de recepción
- Notas opcionales
- Confirmación de recepción

**Validaciones**:
- ✅ Intercambio en estado EN_REVISION
- ✅ Usuario está involucrado
- ✅ No ha confirmado previamente

---

#### FASE 6: Calificar

**Objetivo**: Ambos usuarios califican mutuamente la experiencia del intercambio.

**Proceso**:
1. Cada usuario califica:
   - **Al otro usuario** (1-5 estrellas)
   - **Los productos recibidos** (1-5 estrellas)
   - Comentario opcional
2. Cuando **AMBOS** califican:
   - Se actualiza la reputación de ambos usuarios
   - Se calcula promedio de calificaciones
   - Estado cambia a **CALIFICADO**
   - Intercambio finalizado completamente

**Endpoint**: `POST /api/v1/trades/:id/rate`

**Datos de Calificación**:
- Calificación al usuario (1-5)
- Calificación al producto (1-5)
- Comentario (opcional)
- Timestamp

**Validaciones**:
- ✅ Intercambio en estado COMPLETADO
- ✅ Usuario está involucrado
- ✅ No ha calificado previamente
- ✅ Calificaciones válidas (1-5)

**Actualización de Reputación**:
```typescript
nuevo_rating = (rating_actual × num_intercambios + nueva_calificacion) / (num_intercambios + 1)
```

---

### Estados Finales

```mermaid
graph LR
    A[Intercambio Iniciado] --> B{¿Resultado?}
    B -->|Exitoso| C[CALIFICADO]
    B -->|Rechazada| D[RECHAZADA]
    B -->|Sin respuesta| E[EXPIRADA]
    B -->|Producto malo| F[CANCELADO]

    C --> G[Ambos satisfechos]
    D --> H[Sin intercambio]
    E --> H
    F --> I[Productos devueltos]

    style C fill:#90EE90
    style D fill:#FFB6C1
    style E fill:#FFD700
    style F fill:#FFA500
```

### Reglas de Negocio Importantes

1. **Tiempo de expiración**: Propuestas pendientes expiran en 7 días
2. **Calificación mínima**: Productos con rating < 3 son rechazados
3. **Límite de productos**: Entre 1 y 5 productos por propuesta
4. **Estado de productos**: Solo productos PUBLICADOS pueden intercambiarse
5. **Sincronización**: Muchas transiciones requieren que AMBOS usuarios completen la acción
6. **Atomicidad**: Si un producto es rechazado, TODO el intercambio se cancela
7. **Trazabilidad**: Cada fase genera registros de auditoría

## Autenticación y Autorización

### Roles Disponibles

El sistema implementa los siguientes roles:

```mermaid
graph LR
    A[Roles] --> B[admin]
    A --> C[usuario]
    A --> D[vendedor]
    A --> E[moderator]
    A --> F[revisor]

    B --> G[Acceso total]
    C --> H[Crear productos, propuestas]
    D --> I[Gestión avanzada productos]
    E --> J[Moderación contenido]
    F --> K[Revisar productos en centro]

    style B fill:#ff6b6b
    style C fill:#4ecdc4
    style D fill:#45b7d1
    style E fill:#f7b731
    style F fill:#5f27cd
```

### Matriz de Permisos

| Endpoint | admin | usuario | vendedor | moderator | revisor |
|----------|-------|---------|----------|-----------|---------|
| Crear producto | ✅ | ✅ | ✅ | ✅ | ❌ |
| Listar categorías | ✅ | ✅ | ✅ | ❌ | ❌ |
| Crear categoría | ✅ | ❌ | ❌ | ❌ | ❌ |
| Crear propuesta | ✅ | ✅ | ✅ | ✅ | ❌ |
| Revisar productos | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dashboard admin | ✅ | ❌ | ❌ | ❌ | ❌ |
| Ver reportes | ✅ | ❌ | ❌ | ✅ | ❌ |

### Uso de JWT

El sistema utiliza JSON Web Tokens (JWT) para autenticación:

```typescript
// Ejemplo de respuesta de login
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-usuario",
    "email": "usuario@example.com",
    "roles": ["usuario"]
  }
}
```

Para usar el token en las peticiones:

```bash
# Ejemplo con curl
curl -H "Authorization: Bearer <tu-token>" \
  http://localhost:3000/api/v1/products
```

## Estructura del Proyecto

```
server/
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   └── seed.ts               # Datos iniciales
├── src/
│   ├── application/          # Capa de Aplicación
│   │   ├── dtos/            # DTOs de entrada
│   │   ├── use-cases/       # Casos de uso
│   │   └── validators/      # Validadores de negocio
│   ├── domain/              # Capa de Dominio
│   │   ├── commands/        # Command Pattern
│   │   ├── entities/        # Entidades de dominio
│   │   ├── errors/          # Excepciones de negocio
│   │   ├── events/          # Domain Events
│   │   ├── repositories/    # Interfaces de repositorios
│   │   ├── sagas/          # SAGA Orchestrators
│   │   ├── specifications/ # Specification Pattern
│   │   ├── state-machines/ # Máquinas de estado
│   │   └── value-objects/  # Value Objects
│   ├── infrastructure/      # Capa de Infraestructura
│   │   ├── builders/       # Builders para entidades
│   │   ├── config/         # Configuración de BD
│   │   ├── repositories/   # Implementación repositorios
│   │   └── services/       # Servicios externos
│   ├── presentation/        # Capa de Presentación
│   │   ├── controllers/    # Controladores REST
│   │   ├── dtos/           # DTOs de respuesta
│   │   └── filters/        # Filtros de excepciones
│   ├── auth/               # Módulo de autenticación
│   │   ├── decorators/     # Decoradores personalizados
│   │   ├── guards/         # Guards (JWT, Roles)
│   │   └── strategies/     # Estrategias Passport
│   ├── app.module.ts       # Módulo raíz
│   └── main.ts             # Entry point
├── test/                    # Tests e2e
├── .env                     # Variables de entorno
├── nest-cli.json           # Configuración NestJS
├── package.json
├── tsconfig.json
└── README.md
```

### Patrones de Diseño Implementados

```mermaid
graph TB
    subgraph "Patrones de Dominio"
        A[Specification Pattern] --> AA[Validaciones complejas]
        B[State Machine] --> BB[Estados de intercambio]
        C[SAGA Pattern] --> CC[Transacciones distribuidas]
        D[Command Pattern] --> DD[Operaciones de negocio]
        E[Value Objects] --> EE[Inmutabilidad de valores]
    end

    subgraph "Patrones Arquitecturales"
        F[Hexagonal Architecture] --> FF[Ports & Adapters]
        G[DDD] --> GG[Domain-Driven Design]
        H[Use Cases] --> HH[Clean Architecture]
    end

    style A fill:#e1f5ff
    style B fill:#e1f5ff
    style C fill:#e1f5ff
    style D fill:#e1f5ff
    style E fill:#e1f5ff
    style F fill:#fff4e1
    style G fill:#fff4e1
    style H fill:#fff4e1
```

## Seguridad

El proyecto implementa las mejores prácticas de seguridad según OWASP:

- **Autenticación JWT** con tokens firmados
- **Autorización basada en roles** (RBAC)
- **Validación de entrada** con class-validator
- **Sanitización de logs** para prevenir log injection
- **Hashing de contraseñas** con bcrypt
- **CORS configurado** para orígenes permitidos
- **Rate limiting** (pendiente de implementar)
- **SQL Injection prevention** con Prisma ORM
- **XSS prevention** con validación de datos

## Testing

```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:cov

# Tests e2e
npm run test:e2e

# Tests en modo watch
npm run test:watch
```

## Tecnologías Utilizadas

### Backend

- **NestJS** 11.x - Framework progresivo de Node.js
- **TypeScript** 5.x - Superset tipado de JavaScript
- **Prisma** 6.x - ORM moderno para TypeScript
- **PostgreSQL** 14+ - Base de datos relacional
- **JWT** - Autenticación stateless
- **Bcrypt** - Hashing de contraseñas
- **Passport** - Middleware de autenticación
- **Swagger/OpenAPI** - Documentación de API
- **Class Validator** - Validación de DTOs
- **Class Transformer** - Transformación de objetos

### Herramientas de Desarrollo

- **ESLint** - Linter de código
- **Prettier** - Formateador de código
- **Jest** - Testing framework
- **Supertest** - Testing de APIs

## Convenciones de Código

### Nombres de Archivos

- **Entities**: `nombre-entidad.entity.ts`
- **DTOs**: `nombre.dto.ts`
- **Controllers**: `nombre.controller.ts`
- **Services**: `nombre.service.ts`
- **Use Cases**: `accion-nombre.use-case.ts`
- **Repositories**: `nombre.repository.ts`

### Commits

Seguimos el estándar de [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: agregar endpoint de calificaciones
fix: corregir validación de propuestas
docs: actualizar README con instrucciones
refactor: mejorar estructura de repositorios
test: agregar tests para TradeService
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feat/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feat/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto es privado y no tiene licencia pública.

## Autores

- **Equipo de Desarrollo** - Universidad

## Soporte

Para reportar bugs o solicitar features, abre un issue en el repositorio.
