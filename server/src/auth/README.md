# 🔐 Autenticación y Autorización - Mercado Trueque API

## Descripción General

El backend implementa un sistema completo de **autenticación** basado en **JWT (JSON Web Tokens)** y un sistema de **autorización** basado en **roles** (RBAC - Role-Based Access Control).

## Flujo de Autenticación

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (Frontend)                        │
└────────────────────┬────────────────────────────────────────┘
                     │
         1. POST /api/v1/auth/register
            {email, nombre, apellido, contrasena}
                     │
         ┌───────────▼──────────────┐
         │ Crear usuario en BD      │
         │ Hash contraseña (bcrypt) │
         └─────────────────────────┘
                     │
         2. POST /api/v1/auth/login
            {email, contrasena}
                     │
         ┌───────────▼──────────────────────────┐
         │ Validar email y contraseña           │
         │ Generar JWT token (válido 7 días)    │
         └──────────┬─────────────────────────┘
                    │
         ◄──────────┘
         access_token + user data
                    │
   3. Usar token en requests posteriores
      Authorization: Bearer <token>
                    │
         ┌───────────▼──────────────────────────┐
         │ @Auth() / JwtAuthGuard               │
         │ Validar token y extraer usuario      │
         └─────────────────────────────────────┘
```

## Variables de Entorno

Configurar en `.env`:

```env
# JWT CONFIGURATION
JWT_SECRET=su_clave_secreta_aleatoria_de_32_caracteres_minimo
JWT_EXPIRES_IN=7d
```

**Importante:** En producción, generar una clave segura:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Componentes Implementados

### 1. **Auth Service** (`auth.service.ts`)

Maneja:
- `register(dto)` - Registro de nuevos usuarios
- `login(dto)` - Login con email y contraseña
- Hash de contraseñas con bcrypt
- Generación de JWT tokens

### 2. **JWT Strategy** (`strategies/jwt.strategy.ts`)

Valida tokens JWT y extrae la información del usuario:
```typescript
{
  userId: "uuid-usuario",
  email: "usuario@email.com"
}
```

### 3. **Guards de Autenticación**

#### **JwtAuthGuard** (`guards/jwt-auth.guard.ts`)
Valida que el usuario tenga un token JWT válido.

```typescript
@UseGuards(JwtAuthGuard)
async getUserTrades(@Param('userId') userId: string) { ... }
```

#### **RolesGuard** (`guards/roles.guard.ts`)
Valida que el usuario tenga uno de los roles requeridos.

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'moderator')
async deleteUser() { ... }
```

### 4. **Decoradores Personalizados**

#### **@Auth()** - Combinación de JwtAuthGuard + RolesGuard
```typescript
// Solo autenticación (sin validar roles)
@Auth()
async getProfile() { ... }

// Con validación de roles
@Auth('admin', 'moderator')
async deleteUser() { ... }
```

#### **@CurrentUser()** - Inyectar usuario autenticado
```typescript
@Auth()
async getProfile(@CurrentUser() user: any) {
  return { userId: user.userId, email: user.email };
}
```

#### **@Roles()** - Especificar roles requeridos
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
async deleteUser() { ... }
```

## Cómo Usar en Controladores

### Ejemplo 1: Endpoint Público (sin autenticación)
```typescript
@Get('products')
async getProducts() {
  return this.getProductsUseCase.execute();
}
```

**Llamada:**
```bash
GET /api/v1/products
```

---

### Ejemplo 2: Endpoint Protegido (requiere autenticación)
```typescript
@Post('products')
@Auth()
async createProduct(
  @Body() dto: CreateProductDto,
  @CurrentUser() user: any,
) {
  // Validar que el usuario es el propietario
  if (user.userId !== dto.usuarioId) {
    throw new BadRequestException('No autorizado');
  }
  return this.createProductUseCase.execute(dto);
}
```

**Llamada:**
```bash
POST /api/v1/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "usuarioId": "uuid-usuario",
  "titulo": "Mi producto",
  "descripcion": "Descripción del producto"
}
```

---

### Ejemplo 3: Endpoint con Validación de Roles
```typescript
@Post('users/:id/delete')
@Auth('admin')
async deleteUser(@Param('id') userId: string) {
  return this.userService.delete(userId);
}
```

**Llamada:**
```bash
POST /api/v1/users/uuid-usuario/delete
Authorization: Bearer <token-admin>
```

---

## Flujo Completo: Registro → Login → Acceso a Datos Protegidos

### Paso 1: Registro
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@email.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "contrasena": "MiPassword123"
  }'

Response:
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "uuid-juan",
    "email": "juan@email.com",
    "nombre": "Juan",
    "apellido": "Pérez"
  }
}
```

### Paso 2: Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@email.com",
    "contrasena": "MiPassword123"
  }'

Response:
{
  "message": "Inicio de sesión exitoso",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1dWlkLWp1YW4iLCJlbWFpbCI6Imp1YW5AZW1haWwuY29tIiwiaWF0IjoxNjk0NjU5NDU5LCJleHAiOjE2OTUyNjQyNTl9.hpL...",
  "user": {
    "id": "uuid-juan",
    "email": "juan@email.com",
    "nombre": "Juan",
    "apellido": "Pérez"
  }
}
```

### Paso 3: Acceder a Endpoint Protegido
```bash
curl -X GET http://localhost:3000/api/v1/trades/user/uuid-juan \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1dWlkLWp1YW4i..."

Response:
[
  {
    "id": "uuid-intercambio-1",
    "estado": "COMPLETADO",
    ...
  }
]
```

### Paso 4: Crear Producto (Requiere Autenticación)
```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": "uuid-juan",
    "categoriaId": "uuid-categoria",
    "titulo": "Laptop Dell",
    "descripcion": "Laptop en buen estado",
    "valorEstimado": 800000
  }'
```

---

## Estructura del Token JWT

El token contiene la siguiente información (payload):

```json
{
  "sub": "uuid-usuario",        // ID del usuario (subject)
  "email": "usuario@email.com",  // Email del usuario
  "iat": 1694659459,            // Emitido en (timestamp)
  "exp": 1695264259             // Expira en (timestamp)
}
```

**Decodificar token en:** https://jwt.io

---

## Endpoints de Autenticación

### Registro
```
POST /api/v1/auth/register
Body: { email, nombre, apellido, contrasena }
Response: { message, user: { id, email, nombre, apellido } }
```

### Login
```
POST /api/v1/auth/login
Body: { email, contrasena }
Response: { message, access_token, user: { id, email, nombre, apellido } }
```

---

## Endpoints Protegidos (Requieren Token)

### Trades
- ✅ `GET /api/v1/trades/user/:userId` - Ver tus intercambios
- ✅ `GET /api/v1/trades/proposals/received/:userId` - Ver propuestas recibidas
- ✅ `POST /api/v1/trades/proposals` - Crear propuesta
- ✅ `POST /api/v1/trades/proposals/:proposalId/accept` - Aceptar propuesta
- ✅ `POST /api/v1/trades/:intercambioId/ship` - Enviar productos
- ✅ `POST /api/v1/trades/:intercambioId/deliver` - Marcar entregado
- ✅ `POST /api/v1/trades/:intercambioId/rate` - Calificar usuario

### Products
- ✅ `POST /api/v1/products` - Crear producto
- ❌ `GET /api/v1/products` - Ver catálogo (público)

---

## Validaciones Implementadas

### 1. Token Válido
Si el token es inválido o expirado, se obtiene:
```json
{
  "statusCode": 401,
  "message": "Token inválido o expirado. Debes autenticarte primero.",
  "error": "Unauthorized"
}
```

### 2. Validación de Autorización
Si intentas acceder a datos de otro usuario:
```json
{
  "statusCode": 400,
  "message": "No tienes permiso para ver los intercambios de otro usuario",
  "error": "Bad Request"
}
```

### 3. Rol Insuficiente
```json
{
  "statusCode": 403,
  "message": "No tienes el rol requerido para acceder a este recurso",
  "error": "Forbidden"
}
```

---

## Próximos Pasos

### TODO - Por Implementar

- [ ] **Refresh Tokens**: Permitir renovación de tokens sin hacer login nuevamente
- [ ] **Roles en BD**: Integrar validación de roles desde la base de datos
- [ ] **Permisos Granulares**: Sistema de permisos más detallado
- [ ] **2FA (Two-Factor Authentication)**: Autenticación de dos factores
- [ ] **Logout**: Invalidar tokens al hacer logout
- [ ] **Password Reset**: Recuperación de contraseña por email
- [ ] **OAuth/Google Login**: Autenticación con proveedores externos

---

## Seguridad

### Mejores Prácticas Implementadas

✅ Hash de contraseñas con bcrypt (10 salt rounds)
✅ Tokens JWT con expiración (7 días)
✅ Validación de autenticación en endpoints sensibles
✅ Inyección de usuario autenticado via decorador
✅ Validación de autorización (usuario solo puede acceder a sus datos)
✅ JWT_SECRET desde variables de entorno

### Recomendaciones para Producción

1. **HTTPS Obligatorio** - Usar HTTPS siempre
2. **JWT_SECRET Fuerte** - Generar clave de 32+ caracteres
3. **CORS Restrictivo** - Configurar CORS solo para dominios permitidos
4. **Rate Limiting** - Agregar limitación de solicitudes
5. **Logging** - Mantener logs de intentos de acceso
6. **Refresh Tokens** - Implementar refresh tokens para mayor seguridad
7. **Validación de Email** - Verificar email antes de permitir login

---

## Debugging

### Ver Token en Logs
```typescript
@Auth()
async getProfile(@CurrentUser() user: any) {
  console.log('Usuario autenticado:', user);
  // Output: { userId: 'uuid-...', email: 'user@email.com' }
}
```

### Decodificar JWT
```bash
curl http://localhost:3000/api/v1/auth/login \
  | jq '.access_token' | sed 's/"//g' | jwt decode -
```

---

## Referencias

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Passport.js](http://www.passportjs.org/)
- [JWT (JSON Web Tokens)](https://jwt.io)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

**Última actualización:** 11 de noviembre de 2025
