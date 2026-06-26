#!/bin/bash
# start-local.sh — Starts infrastructure via Docker Compose and all NestJS
# microservices as local processes (with hot-reload and debugger).
#
# To run a single service in isolation (in its own terminal tab):
#   npm run nest:<service>   e.g. npm run nest:catalog

export NODE_ENV="local"

SERVICES=("api-gateway" "catalog" "identity" "orders" "notifications" "payments")
INFRA_SERVICES="postgres redis rabbitmq loki grafana promtail stripe-mock"

# ─── Guard: Docker must be running ───────────────────────────────────────────
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# ─── Infrastructure ──────────────────────────────────────────────────────────
all_running=true
for svc in $INFRA_SERVICES; do
    if ! docker compose ps --services --filter "status=running" 2>/dev/null | grep -q "^${svc}$"; then
        all_running=false
        break
    fi
done

if [ "$all_running" = false ]; then
    echo "Starting infrastructure services..."
    # shellcheck disable=SC2086
    docker compose up -d $INFRA_SERVICES

    echo "Waiting for services to be ready..."

    until docker compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do
        echo "  Waiting for PostgreSQL..."; sleep 3
    done

    until docker compose exec -T redis redis-cli ping > /dev/null 2>&1; do
        echo "  Waiting for Redis..."; sleep 2
    done

    until docker compose exec -T rabbitmq rabbitmq-diagnostics ping > /dev/null 2>&1; do
        echo "  Waiting for RabbitMQ..."; sleep 3
    done

    echo "Infrastructure is ready."
else
    echo "Infrastructure services are already running."
fi

# ─── Info ─────────────────────────────────────────────────────────────────────
echo ""
echo "Local Dev Environment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  API Gateway : http://localhost:3000"
echo "  Swagger     : http://localhost:3000/api/docs"
echo "  RabbitMQ UI : http://localhost:15672  (guest / guest)"
echo "  Grafana     : http://localhost:3001"
echo "  Stripe Mock : http://localhost:12111"
echo "  Debug ports : api-gateway=9229  catalog=9230  identity=9231"
echo "                orders=9232       notifications=9233  payments=9234"
echo ""
echo "Tips:"
echo "  - Run a single service in its own terminal: npm run nest:<service>"
echo "  - Set LOG_LEVEL=debug in each apps/<service>/.env.local for verbose logging"
echo "  - npm run docker:logs   — follow infrastructure logs"
echo "  - npm run docker:status — check container status"
echo ""

read -p "Start all NestJS services now? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
fi

# ─── Ensure .env.local files exist ───────────────────────────────────────────
for svc in "${SERVICES[@]}"; do
    env_file="apps/${svc}/.env.local"
    if [ ! -f "$env_file" ]; then
        echo "  [INFO] ${env_file} not found — copying from example..."
        cp "apps/${svc}/.env.example.local" "$env_file"
    fi
done

# ─── Start all microservices (concurrently, with colored prefixed output) ────
echo "Starting NestJS services..."
echo ""

npm run nest:start:all