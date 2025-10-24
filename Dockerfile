# Etapa de build
FROM node:22-alpine AS builder

# 2. Crear directorio de trabajo
WORKDIR /app

# 3. Copiar package.json y lock
COPY package*.json ./

# 4. Instalar dependencias
RUN npm install

# 5. Copiar todo el código
COPY . .

# 6. Generar cliente de Prisma
RUN npx prisma generate

# 7. Build del proyecto Next.js
RUN npm run build

# Etapa de producción
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app ./

# 8. Exponer el puerto
EXPOSE 3000

# 9. Comando de inicio
CMD ["npm", "start"]