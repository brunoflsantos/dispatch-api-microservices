# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm start                        # Start Docker infra + all services with hot-reload (interactive)
npm run docker:infra             # Start only infra containers (postgres, redis, rabbitmq, loki, grafana, stripe-mock)
npm run nest:start:<service>     # Start a single service with hot-reload and debugger
                                 # services: api-gateway, catalog, identity, orders, notifications, payments
```

### Build
```bash
npm run build                    # Build all services (sets NODE_ENV=production)
npm run nest:build:<service>     # Build a single service
```

### Testing
```bash
npm run test:unit                # Unit tests (*.spec.ts)
npm run test:int                 # Integration tests (*.int-spec.ts) — uses Testcontainers, runs serially
npm run test:e2e                 # E2E tests (*.e2e-spec.ts) — runs serially
npm run test:cov                 # All tests with coverage
```

### Linting
```bash
npm run lint                     # ESLint with auto-fix
```

### Other
```bash
npm run docker:logs              # Follow infra container logs
npm run docker:status            # Check container status
npm run reset                    # Reset environment (see scripts/reset.sh)
```

Each service requires a `.env.local` file at `apps/<service>/.env.local`. On first run, `start-local.sh` copies `.env.example.local` automatically.

Debug ports: api-gateway=9229, catalog=9230, identity=9231, orders=9232, notifications=9233, payments=9234.

## Architecture

### Services
- **api-gateway** (port 3000): The only public-facing HTTP service. Handles REST requests, authentication, and forwards everything to internal services via RabbitMQ RPC. Exposes Swagger at `/api/docs`.
- **catalog**: Product management, inventory, and stock reservation/confirmation/undo.
- **identity**: User management, JWT issuance (access + refresh tokens), authentication.
- **orders**: Order lifecycle with state machine transitions (PENDING → PAID → SHIPPED → etc.).
- **payments**: Stripe payment processing, webhooks.
- **notifications**: Event-driven; listens for order/payment events to send notifications.

### Inter-Service Communication

All inter-service communication goes through RabbitMQ via `@nestjs/microservices`:

- **RPC (request-response)**: Uses `ClientProxy.send()` + `@MessagePattern()`. Each service has a dedicated RPC queue (e.g., `catalog-rpc-queue`).
- **Events (fire-and-forget)**: Uses `ClientProxy.emit()` + `@EventPattern()`. Services publish to a shared event bus queue.

**The transport layer is typed.** Every RPC call has a corresponding `*RpcInput` class in `libs/common/modules/transport/dto/`. These classes carry the message pattern string as a static property and type the payload + response:

```typescript
// Sending from api-gateway:
const input = new PublicFindAllProductsRpcInput({ query });
this.catalogClient.send(PublicFindAllProductsRpcInput.pattern, input.payload)

// Receiving in catalog service:
@MessagePattern(CatalogTransportPatterns.PUBLIC_FIND_ALL_PRODUCTS)
async findAll(payload: ...) { ... }
```

Pattern strings follow the convention `<service>.<action>` (e.g., `catalog.public-find-all-products`).

### Shared Libraries

**`libs/common/`** — Cross-cutting infrastructure. Path alias: `@/shared/*`
- `guards/` — `JwtAuthGuard`, `JwtRefreshGuard`, `RolesGuard`
- `decorators/` — `@Public()`, `@Roles()`, `@CurrentUser()`, `@CorrelationId()`
- `filters/` — `AllExceptionsFilter`, `RpcExceptionConverterFilter`
- `interceptors/` — logging, response transformation
- `modules/transport/` — typed RPC input classes for all services
- `modules/cache/` — Redis cache wrapper with TTL constants
- `modules/idempotency/` — prevents duplicate mutations via Redis keys
- `providers/jwt/` — JWT strategy and token blacklisting via Redis

**`libs/contracts/`** — Shared data shapes between services (interfaces, base DTOs, base entities, repositories, services). Import directly: `libs/contracts/...`

### Path Aliases (tsconfig.json)
```
@/shared/*   → libs/common/*
@/modules/*  → libs/common/modules/*
@/config/*   → libs/common/config/*
libs/*        → ./libs/*
```

### Authentication Flow
- `JwtAuthGuard` is applied globally in api-gateway; mark public endpoints with `@Public()`.
- Access tokens are validated against a Redis blacklist (token revocation on logout/refresh).
- User identity is available via `@CurrentUser()` decorator in controllers.
- `@Roles(UserRole.ADMIN)` combined with `RolesGuard` restricts admin routes.

### Key Patterns
- **Outbox pattern**: Orders/payments use an outbox table + scheduled job for reliable event publishing to RabbitMQ.
- **Idempotency**: Mutation endpoints accept an `idempotency-key` header; the `IdempotencyService` returns cached responses for duplicate requests.
- **Distributed locks**: `Redlock` (via Redis) prevents race conditions in stock reservation.
- **Correlation IDs**: Every request gets a correlation ID via `CorrelationIdMiddleware`; propagated through RPC calls for distributed tracing to Loki/Grafana.

### Environment & Infrastructure
- Each microservice has its own PostgreSQL database (isolated schemas, separate TypeORM configs at `apps/<service>/src/config/orm.<service>.config.ts`).
- Redis is shared across services for caching, idempotency, and token blacklisting.
- RabbitMQ is the message broker; connection config is in each service's environment.
- Stripe Mock runs locally for payment testing at `http://localhost:12111`.
