# --- ETAPA 1: CONSTRUCCIÓN (BUILDER) ---
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx expo export --platform web --clear
RUN node scripts/fix-web-scripts.js

# --- ETAPA 2: PRODUCCIÓN (RUNNER) ---
FROM nginx:alpine AS runner
# Copiamos la compilación a la raíz de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Duplicamos la estructura a /tani/ para garantizar compatibilidad dual total
RUN mkdir -p /usr/share/nginx/html/tani && cp -r /usr/share/nginx/html/* /usr/share/nginx/html/tani/ || true

EXPOSE 80
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
