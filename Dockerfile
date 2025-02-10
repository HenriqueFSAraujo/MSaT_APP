# Use uma imagem Node.js como base
FROM node:18-alpine as build

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de configuração do projeto
COPY package.json package-lock.json ./

# Instale as dependências
RUN npm ci

# Copie o resto dos arquivos do projeto
COPY . .

# Construa o projeto

RUN npm run build

# Use uma imagem nginx leve para servir o aplicativo
FROM nginx:alpine

# Copie os arquivos de build para o diretório de conteúdo do nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copie o arquivo de configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

# Inicia o nginx
CMD ["nginx", "-g", "daemon off;"]
