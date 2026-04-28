FROM node:20-slim

WORKDIR /app/bemymate

COPY package.json package-lock.json ./

RUN npm ci --no-audit --no-fund

COPY ./ ./

# Build-only dummy env so the validate-env Nitro plugin does not abort during prerender.
# These are not baked into the image — they exist only for the duration of `npm run build`.
RUN NUXT_CLIENT_SECRET=build \
    NUXT_API_KEY=build \
    NUXT_DB_URL=mongodb://build:build@build:27017/ \
    NUXT_PUBLIC_CLIENT_ID=build \
    NUXT_PUBLIC_SEARCH_HOST=build \
    npm run build

CMD ["node", ".output/server/index.mjs"]
