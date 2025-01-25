# Build stage
FROM node:22-alpine as build

WORKDIR /app

COPY . .

WORKDIR /app/back

RUN npm install
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app/back

# uWebSockets.js https://github.com/uNetworking/uWebSockets.js/discussions/158
RUN apk add --no-cache libc6-compat git
COPY --from=build /app/back/package.json .

RUN ln -s "/lib/libc.musl-$(uname -m).so.1" "/lib/ld-linux-$(uname -m).so.1"
RUN npm install --omit=dev

COPY --from=build /app/back/src/scripts /app/back/src/scripts
COPY --from=build /app/back/dist /app/back/dist
COPY --from=build /app/back/.env . 

CMD ["node", "dist/back/src/sandbox.js"]