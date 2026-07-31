# ==================================================
# ETAPA 1: Compilar la aplicación Vue
# ==================================================

FROM node:24-alpine AS build

WORKDIR /app

# Copiamos primero los archivos de dependencias
# para aprovechar la caché de Docker.
COPY package*.json ./

# Instalamos las dependencias.
# npm install es más tolerante si no existe package-lock.json.
RUN npm install

# Copiamos el resto del proyecto.
COPY . .

# Generamos la versión de producción.
# Esto crea la carpeta /app/dist.
RUN npm run build-only


# ==================================================
# ETAPA 2: Servir la aplicación compilada
# ==================================================

FROM nginx:alpine

# Eliminamos la página predeterminada de Nginx.
RUN rm -rf /usr/share/nginx/html/*

# Copiamos únicamente los archivos compilados.
COPY --from=build /app/dist /usr/share/nginx/html

# Copiamos la configuración personalizada de Nginx.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx escucha internamente en el puerto 80.
EXPOSE 80

# Mantenemos Nginx ejecutándose en primer plano.
CMD ["nginx", "-g", "daemon off;"]