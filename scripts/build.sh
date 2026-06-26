#!/bin/bash
# build.sh — Builds all NestJS microservices using their respective .env.local files.

export NODE_ENV="production"

# ─── Guard: Docker must be running ───────────────────────────────────────────
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# ─── Build all services ───────────────────────────────────────────────────────
echo "Building all NestJS microservices..."
npm run nest:build:all
