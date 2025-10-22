# Usa Node.js como base
FROM node:22-alpine

# Crea una carpeta en el contenedor
WORKDIR /app

# Copia los archivos necesarios
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código
COPY . .

# Genera Prisma y compila Next.js
RUN npx prisma generate
RUN npm run build

# Expón el puerto de Next.js
EXPOSE 3000

# Comando para arrancar la app
CMD ["npm", "start"]
