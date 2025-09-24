# Mercado Trueque Server

A Node.js REST API built with NestJS following Clean Architecture principles.

## Features

- Clean Architecture with layers: Domain, Application, Infrastructure, Presentation
- TypeScript
- Dependency Injection
- Sequelize ORM with PostgreSQL
- Unit tests with Jest
- Docker containerization
- CRUD operations for Users

## Architecture

- **Domain**: Entities and business rules
- **Application**: Use cases and application logic
- **Infrastructure**: External dependencies (Database, APIs)
- **Presentation**: Controllers and DTOs

## Prerequisites

- Node.js 18+
- PostgreSQL
- Docker (optional)

## Setup

1. Clone the repository
2. Navigate to server directory: `cd server`
3. Install dependencies: `npm install`

## Database Setup

1. Create a PostgreSQL database
2. Update `.env` file with your database credentials:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=mercado_trueque
```

3. The application will automatically create tables on startup (synchronize: true)

## Running the Application

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

### With Docker

```bash
docker build -t mercado-trueque-server .
docker run -p 3000:3000 --env-file .env mercado-trueque-server
```

## API Endpoints

- `POST /users` - Create user
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## Testing

Run unit tests:

```bash
npm run test
```

## Project Structure

```
src/
├── domain/
│   ├── entities/
│   └── repositories/
├── application/
│   └── use-cases/
├── infrastructure/
│   ├── database/
│   ├── models/
│   └── repositories/
├── presentation/
│   ├── controllers/
│   └── dtos/
```

## SOLID Principles

- **Single Responsibility**: Each class has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes are substitutable for their base types
- **Interface Segregation**: Clients depend only on methods they use
- **Dependency Inversion**: Depend on abstractions, not concretions
