FROM node:24-alpine

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

RUN npm install

# Copiamos el resto del código
COPY . .

EXPOSE 5173

# IMPORTANTE: Vite necesita el flag --host para ser accesible desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host"]