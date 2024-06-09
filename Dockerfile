# Build stage
FROM node:20 as build

WORKDIR /app

COPY . .

WORKDIR /app/back

RUN rm -rf package-lock.json
RUN npm install
RUN npm run build

# Production stage
FROM node:20 

WORKDIR /app/back

COPY --from=build /app/back/package.json .

RUN npm install --omit=dev

COPY --from=build /app/back/dist /app/back/dist
COPY --from=build /app/front/public/assets /app/front/public/assets
COPY --from=build /app/back/.env . 

CMD ["node", "dist/back/src/index.js"]