# ==========================================
# Stage 1: Build Frontend (React/TypeScript)
# ==========================================
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Copy source code and build
COPY . .
RUN pnpm run build

# ==========================================
# Stage 2: Setup Backend (Python + Julia)
# ==========================================
FROM python:3.11-slim AS backend-runner

# Install system dependencies for Julia and Python
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Julia
ENV JULIA_VERSION=1.9.3
RUN mkdir /opt/julia && \
    curl -L https://julialang-s3.julialang.org/bin/linux/x64/1.9/julia-${JULIA_VERSION}-linux-x86_64.tar.gz | tar zx -C /opt/julia --strip-components=1
ENV PATH=$PATH:/opt/julia/bin

# Setup Working Directory
WORKDIR /app

# Install Python Dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Backend Code
COPY python-backend/ ./python-backend/
COPY julia-backend/ ./julia-backend/
COPY services/ ./services/
COPY security-infrastructure/ ./security-infrastructure/

# Copy Built Frontend from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./static

# Environment Variables
ENV PYTHONPATH=/app
ENV PORT=8000

# Expose Port
EXPOSE 8000

# Start Command (Run FastAPI)
CMD ["uvicorn", "python-backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
