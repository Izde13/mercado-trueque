# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Generar Prisma Client
RUN npx prisma generate

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN pnpm run build

# Etapa 2: Producción
FROM node:20-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos necesarios desde builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# Exponer puerto
EXPOSE 3000

# Script de inicio: ejecutar migraciones y luego iniciar la aplicación
CMD ["sh", "-c", "npx prisma migrate deploy && pnpm start:prod"]