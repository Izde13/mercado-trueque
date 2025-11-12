# 🔄 Mercado Trueque

Plataforma de intercambio (trueque) de productos entre usuarios, implementada con NestJS, PostgreSQL y Prisma.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Variables de Entorno](#-variables-de-entorno)
- [Comandos Disponibles](#-comandos-disponibles)
- [Documentación API](#-documentación-api)
- [Flujo de Trueque](#-flujo-de-trueque)
- [Autenticación y Autorización](#-autenticación-y-autorización)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)

## ✨ Características

- 🔐 **Autenticación JWT** con sistema de roles (admin, usuario, vendedor, moderator, revisor)
- 📦 **Gestión de Productos** con categorías y estados
- 🔄 **Sistema de Trueque Completo** (6 fases: propuesta → aceptación → envío → revisión → entrega → calificación)
- 📊 **Documentación Swagger** interactiva con autenticación Bearer
- 🏗️ **Arquitectura Hexagonal** (Domain-Driven Design)
- 🛡️ **Seguridad OWASP** con validaciones, sanitización y logging
- 🎯 **Patrones de Diseño**: Specifications, State Machine, SAGA, Command Pattern
- 📝 **PostgreSQL** con Prisma ORM

## 🏛️ Arquitectura

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

## 📋 Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x o **pnpm** >= 8.x
- **PostgreSQL** >= 14.x
- **Git**

## 🚀 Instalación

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
- 🚀 API: http://localhost:3000/api/v1
- 📚 Swagger: http://localhost:3000/api-docs

## 🔐 Variables de Entorno

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

## 🛠️ Comandos Disponibles

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

## 📖 Documentación API

### Swagger UI

Una vez iniciado el servidor, accede a la documentación interactiva en:

**http://localhost:3000/api-docs**

### Autenticación en Swagger

1. Haz login en el endpoint `POST /api/v1/auth/login`
2. Copia el `access_token` de la respuesta
3. Haz clic en el botón **"Authorize"** (🔓) en la parte superior derecha
4. Pega el token en el campo (sin el prefijo "Bearer")
5. Haz clic en "Authorize"
6. Ahora puedes acceder a los endpoints protegidos

### Endpoints Principales

#### Autenticación

- `POST /api/v1/auth/register` - Registrar nuevo usuario
- `POST /api/v1/auth/login` - Login de usuario (retorna JWT)
- `GET /api/v1/auth/admin/dashboard` - Dashboard admin (🔒 admin)
- `POST /api/v1/auth/admin/assign-role` - Asignar rol (🔒 admin)

#### Productos

- `GET /api/v1/products` - Listar productos (con filtros opcionales)
- `GET /api/v1/products/:id` - Obtener producto por ID
- `POST /api/v1/products` - Crear producto (🔒 autenticado)

#### Categorías

- `GET /api/v1/categories` - Listar categorías (🔒 admin, usuario, vendedor)
- `GET /api/v1/categories/:id` - Obtener categoría (🔒 admin, usuario, vendedor)
- `POST /api/v1/categories` - Crear categoría (🔒 admin)
- `PUT /api/v1/categories/:id` - Actualizar categoría (🔒 admin)

#### Trueques

- `GET /api/v1/trades/user/:userId` - Obtener intercambios del usuario (🔒)
- `GET /api/v1/trades/proposals/received/:userId` - Propuestas recibidas (🔒)
- `POST /api/v1/trades/proposals` - Crear propuesta (FASE 1) (🔒)
- `POST /api/v1/trades/proposals/:id/accept` - Aceptar propuesta (FASE 2) (🔒)
- `POST /api/v1/trades/:id/ship` - Enviar productos (FASE 3) (🔒)
- `POST /api/v1/trades/:id/products/:productId/review` - Revisar producto (FASE 4) (🔒)
- `POST /api/v1/trades/:id/deliver` - Marcar entrega (FASE 5) (🔒)
- `POST /api/v1/trades/:id/rate` - Calificar intercambio (FASE 6) (🔒)

## 🔄 Flujo de Trueque

El sistema implementa un proceso de trueque de 6 fases con máquina de estados:

```mermaid
stateDiagram-v2
    [*] --> PENDIENTE: Usuario crea propuesta
    PENDIENTE --> INICIADO: Usuario acepta propuesta
    PENDIENTE --> RECHAZADA: Usuario rechaza
    PENDIENTE --> EXPIRADA: Timeout

    INICIADO --> PRODUCTOS_ENVIADOS: Ambos usuarios envían productos

    PRODUCTOS_ENVIADOS --> EN_REVISION: Todos productos aprobados
    PRODUCTOS_ENVIADOS --> CANCELADO: Algún producto rechazado

    EN_REVISION --> COMPLETADO: Ambos usuarios marcan entrega

    COMPLETADO --> CALIFICADO: Ambos usuarios califican
    COMPLETADO --> [*]

    RECHAZADA --> [*]
    EXPIRADA --> [*]
    CANCELADO --> [*]
```

### Descripción de las Fases

```mermaid
sequenceDiagram
    participant J as Juan (Oferente)
    participant S as Sistema
    participant M as María (Receptor)
    participant C as Centro Distribución

    Note over J,M: FASE 1: Crear Propuesta
    J->>S: Crear propuesta (ofrece productos por producto de María)
    S->>M: Notificación de propuesta

    Note over J,M: FASE 2: Aceptar Propuesta
    M->>S: Acepta propuesta
    S->>S: Crea Intercambio (estado: INICIADO)
    S->>J: Notificación de aceptación
    S->>M: Notificación de aceptación

    Note over J,M: FASE 3: Enviar Productos
    J->>C: Envía sus productos
    M->>C: Envía su producto
    S->>S: Estado: PRODUCTOS_ENVIADOS

    Note over J,M: FASE 4: Revisar Productos
    C->>S: Revisa producto de Juan (calificación)
    C->>S: Revisa producto de María (calificación)
    S->>S: Estado: EN_REVISION (si ambos aprobados)

    Note over J,M: FASE 5: Entregar Productos
    C->>M: Entrega productos de Juan
    M->>S: Marca recibido
    C->>J: Entrega producto de María
    J->>S: Marca recibido
    S->>S: Estado: COMPLETADO

    Note over J,M: FASE 6: Calificar
    J->>S: Califica a María y producto
    M->>S: Califica a Juan y productos
    S->>S: Actualiza reputación de ambos
```

## 🔐 Autenticación y Autorización

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

## 📁 Estructura del Proyecto

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

## 🛡️ Seguridad

El proyecto implementa las mejores prácticas de seguridad según OWASP:

- ✅ **Autenticación JWT** con tokens firmados
- ✅ **Autorización basada en roles** (RBAC)
- ✅ **Validación de entrada** con class-validator
- ✅ **Sanitización de logs** para prevenir log injection
- ✅ **Hashing de contraseñas** con bcrypt
- ✅ **CORS configurado** para orígenes permitidos
- ✅ **Rate limiting** (pendiente de implementar)
- ✅ **SQL Injection prevention** con Prisma ORM
- ✅ **XSS prevention** con validación de datos

## 🧪 Testing

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

## 🚀 Tecnologías Utilizadas

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

## 📝 Convenciones de Código

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

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feat/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feat/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y no tiene licencia pública.

## 👥 Autores

- **Equipo de Desarrollo** - Universidad

## 🆘 Soporte

Para reportar bugs o solicitar features, abre un issue en el repositorio.

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!
