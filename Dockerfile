# Estágio 1: Build da aplicação Angular
FROM node:20-alpine AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Faz o build da aplicação para produção
RUN npm run build --configuration=production

# Estágio 2: Servir a aplicação com o Nginx
FROM nginx:alpine

# Copia a configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos compilados do Angular (build:application gera na pasta browser)
COPY --from=build /app/dist/smart_order_management_web/browser /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
