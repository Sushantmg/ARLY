# Builds the Vite SPA, then ships it inside Caddy (serves /srv, proxy in deploy/Caddyfile).
# Build context: arly-frontend/
FROM node:26-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL} \
    VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}

COPY . .
RUN npm run build

FROM caddy:2-alpine
COPY --from=build /app/dist /srv
EXPOSE 80 443
