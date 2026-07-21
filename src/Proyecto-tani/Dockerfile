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

EXPOSE 80
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
