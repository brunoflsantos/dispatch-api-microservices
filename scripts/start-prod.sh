#!/bin/bash
# start-prod.sh — Builds Docker images and starts the full stack via Docker Compose.

export NODE_ENV="production"

# ─── Guard: Docker must be running ───────────────────────────────────────────
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# ─── Ensure .env.production files exist ──────────────────────────────────────
for svc in api-gateway catalog identity orders notifications payments; do
    env_file="apps/${svc}/.env.production"
    if [ ! -f "$env_file" ]; then
        echo "  [INFO] ${env_file} not found — copying from example..."
        cp "apps/${svc}/.env.example.production" "$env_file"
    fi
done

# ─── Info ─────────────────────────────────────────────────────────────────────
echo ""
echo "Production Environment (Docker Compose)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  API Gateway : http://localhost:3000"
echo "  Swagger     : http://localhost:3000/api/docs"
echo "  RabbitMQ UI : http://localhost:15672  (guest / guest)"
echo "  Grafana     : http://localhost:3001"
echo ""
echo "Tips:"
echo "  - Edit apps/<service>/.env.production to set real secrets before deploying"
echo "  - npm run docker:logs   — follow container logs"
echo "  - npm run docker:status — check service status"
echo "  - npm run docker:down   — stop and remove containers"
echo ""

read -p "Build images and start the full stack? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Building and starting all services..."
    docker compose up -d --build
fi