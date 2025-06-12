# Etapa 1: Build
FROM node:18 AS builder
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY ./src ./src
COPY ./public ./public
COPY index.html ./

# 🔍 ADICIONA ISSO PRA VER OS ARQUIVOS
RUN ls -la

RUN npm install
RUN npm run build

# Etapa 2: Servir com Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
