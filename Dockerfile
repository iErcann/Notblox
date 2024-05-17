FROM node:20 as build

WORKDIR /app

COPY . .

WORKDIR /app/back

RUN rm -rf package-lock.json
RUN npm install
RUN npm run build

# FROM node:20-alpine 
FROM node:20 

WORKDIR /app/back

# https://github.com/uNetworking/uWebSockets.js/discussions/346#discussioncomment-1137301
# RUN apk add --no-cache libc6-compat git

COPY --from=build /app/back/package.json .

RUN npm install --omit=dev

COPY --from=build /app/back/dist /app/back/dist
COPY --from=build /app/front/public/assets /app/front/public/assets

ENV NODE_ENV=production

CMD ["node", "dist/back/src/index.js"]
