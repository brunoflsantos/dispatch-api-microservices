#!/bin/bash
# prebuild.sh — Prepares the environment for building NestJS microservices.

SERVICES=("api-gateway" "catalog" "identity" "orders" "notifications" "payments")

# ─── Ensure .env.local files exist ───────────────────────────────────────────
for svc in "${SERVICES[@]}"; do
    env_file="apps/${svc}/.env.local"
    if [ ! -f "$env_file" ]; then
        echo "  [INFO] ${env_file} not found — copying from example..."
        cp "apps/${svc}/.env.example.local" "$env_file"
    fi
done

# ─── Ensure .env.production files exist ───────────────────────────────────────────
for svc in "${SERVICES[@]}"; do
    env_file="apps/${svc}/.env.production"
    if [ ! -f "$env_file" ]; then
        echo "  [INFO] ${env_file} not found — copying from example..."
        cp "apps/${svc}/.env.example.production" "$env_file"
    fi
done
