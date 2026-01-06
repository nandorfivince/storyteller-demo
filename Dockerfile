# Stage 1: Build frontend (SDK + Playground)
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/playground/package.json ./apps/playground/
COPY packages/web-sdk/package.json ./packages/web-sdk/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY apps/playground ./apps/playground
COPY packages/web-sdk ./packages/web-sdk

# Build SDK first, then playground
RUN pnpm --filter @ministories/web-sdk build
RUN pnpm --filter playground build

# Stage 2: Python API + Static serving
FROM python:3.11-slim

WORKDIR /app

# Install Python dependencies
COPY apps/api/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy API source
COPY apps/api ./

# Copy built frontend from Stage 1
COPY --from=frontend-builder /app/apps/playground/dist ./static

# Create data directory for SQLite
RUN mkdir -p /app/data

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV DATABASE_URL=sqlite:///./data/ministories.db

# Expose port
EXPOSE 8000

# Start FastAPI with static file serving
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
