# --- ETAPA 1: CONSTRUCCIÓN (BUILDER) ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Exporta la compilación estática web de Expo
RUN npx expo export --platform web

# Corrige el tag de script en los archivos HTML para soportar import.meta (ES Modules)
RUN node scripts/fix-web-scripts.js

# --- ETAPA 2: PRODUCCIÓN (RUNNER) ---
FROM nginx:1.25-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
