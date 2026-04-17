# Nuxt 3 Minimal Starter

Look at the [nuxt 3 documentation](https://v3.nuxtjs.org) to learn more.

## Setup

Install dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

Configure environment variables:

```bash
# Main Nuxt app
cp .env.example .env
# Socket.IO search server
cp modules/socketio-server/.env.example modules/socketio-server/.env
```

Fill in real values (FACEIT OAuth credentials, FACEIT Data API key, MongoDB URL). Both services fail fast at startup if required variables are missing.

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Checkout the [deployment documentation](https://v3.nuxtjs.org/guide/deploy/presets) for more information.
