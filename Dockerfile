# Build stage
FROM node:22-slim as build

WORKDIR /app

COPY . .

WORKDIR /app/back

# Install build tools for native dependencies  
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN npm install
RUN npm run build

# Production stage
FROM node:22-slim

WORKDIR /app/back

# Install only runtime dependencies
RUN apt-get update && apt-get install -y git \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/back/package.json .

RUN npm install --omit=dev

COPY --from=build /app/back/src/scripts /app/back/src/scripts
COPY --from=build /app/back/dist /app/back/dist
COPY --from=build /app/back/.env .

CMD ["node", "dist/back/src/sandbox.js"]
