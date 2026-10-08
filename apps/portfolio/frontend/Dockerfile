FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
ARG PUBLIC_VERSION=dev
ENV PUBLIC_VERSION=${PUBLIC_VERSION}
RUN npm run build

FROM nginx:1.27-alpine AS runtime
RUN addgroup -g 101 -S nginx-app && \
    adduser -u 101 -S -G nginx-app nginx-app && \
    rm /etc/nginx/conf.d/default.conf
COPY --from=build --chown=nginx-app:nginx-app /app/dist /usr/share/nginx/html
COPY --chown=nginx-app:nginx-app nginx.conf /etc/nginx/conf.d/default.conf
USER nginx-app
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://127.0.0.1:8080/ || exit 1
