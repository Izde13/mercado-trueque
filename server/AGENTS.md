# Repository Guidelines

## Project Structure & Module Organization

- `src/` implements the NestJS service using a layered DDD layout: `domain/` holds core models, `application/` orchestrates use cases, `infrastructure/` wires Sequelize and config, and `presentation/` exposes controllers.
- `test/` contains Jest E2E specs (`app.e2e-spec.ts`) and config (`jest-e2e.json`). Unit specs live beside production files as `*.spec.ts`.
- Root config files manage tooling: `.env` for local secrets, `sequelize-auto.config.js` for schema sync, and `Dockerfile` for containerized deployments.

## Build, Test, and Development Commands

- `pnpm install` installs dependencies; prefer pnpm because the repo tracks `pnpm-lock.yaml`.
- `pnpm start:dev` runs Nest in watch mode; use `pnpm start:debug` for inspector support.
- `pnpm build` compiles TypeScript to `dist/`; `pnpm start:prod` serves the compiled bundle.
- `pnpm lint` applies ESLint + Prettier fixes; `pnpm format` rewrites sources with Prettier.

## Coding Style & Naming Conventions

- Follow Prettier defaults (2-space indent, single quotes, trailing commas). All files use LF endings.
- Stick to TypeScript idioms: PascalCase classes/modules, camelCase functions and variables, SCREAMING_SNAKE_CASE constants.
- Keep NestJS providers lean; share DTOs through `application/` and map persistence concerns in `infrastructure/`.

## Testing Guidelines

- Unit specs should mirror file names (`foo.service.spec.ts`) under `src/`; arrange E2E flows in `test/`.
- Run `pnpm test` for the suite, `pnpm test:watch` while iterating, `pnpm test:e2e` for HTTP flows, and `pnpm test:cov` to verify coverage.
- Target high coverage on use-case services and guard logic; add factories/mocks under `test/` when scenarios repeat.

## Commit & Pull Request Guidelines

- Recent history uses Conventional Commits (`feat`, `chore`, optional scopes like `feat(tables)`). Match that style and favor grouped, atomic commits.
- PRs should include a clear summary, linked issues or task IDs, test evidence (`pnpm test` output or screenshots for HTTP responses), and notes on migrations or env changes.

## Security & Configuration Tips

- Never commit `.env`; document required keys in PRs and share secrets via the vault.
- Regenerate Sequelize models with `pnpm sequelize-auto` (see `sequelize-auto.config.js`) and review diffs before pushing.
- Docker builds read env vars at runtime; validate `Dockerfile` updates with `docker build .` before release branches.
