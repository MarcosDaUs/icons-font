FROM node:18.16-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG REACT_APP_ICONS_CLOUDFRONT
ENV REACT_APP_ICONS_CLOUDFRONT=$REACT_APP_ICONS_CLOUDFRONT

RUN npm run build

FROM nginx:alpine AS final

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

COPY --from=builder /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]