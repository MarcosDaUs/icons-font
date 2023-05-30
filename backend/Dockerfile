FROM node:18.16-alpine AS node

FROM node AS builder

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

FROM node AS final

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

RUN apk --no-cache -U upgrade

RUN mkdir -p /home/node/app/dist && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm i --only=production --omit=dev

COPY --chown=node:node --from=builder /app/dist ./dist

USER node

CMD [ "node", "./dist/index.js" ]