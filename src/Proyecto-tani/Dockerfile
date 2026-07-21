# --- ETAPA 1: CONSTRUCCIÓN (BUILDER) ---
FROM node:22.14.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN ./node_modules/.bin/expo export --platform web --clear
RUN node scripts/fix-web-scripts.js

# --- ETAPA 2: PRODUCCIÓN (RUNNER) ---
FROM nginx:1.25.4-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Un SOLO puerto expuesto: con dos EXPOSE la deteccion de puerto de Azure App
# Service se vuelve ambigua y produce 503 (nginx igual escucha 80 y 8080).
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
