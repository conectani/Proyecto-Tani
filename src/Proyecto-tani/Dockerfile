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
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Azure App Service enruta el tráfico del sitio a UN solo puerto del contenedor.
# Se expone únicamente el 80 para que la detección automática no sea ambigua
# (nginx igualmente escucha en 80 y 8080 según nginx.conf).
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
