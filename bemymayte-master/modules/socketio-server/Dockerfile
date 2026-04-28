FROM node:20-slim

WORKDIR /app/bemymate-search

COPY package.json package-lock.json ./

RUN npm ci --no-audit --no-fund

COPY ./ ./

CMD ["npm", "run", "serve"]
