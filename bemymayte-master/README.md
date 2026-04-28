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

## Docker deployment

The repo ships with `docker-compose.yml` that runs three services: `mongo`, `search` (Socket.IO), `app` (Nuxt). All host ports are bound to `127.0.0.1` so only the local reverse-proxy (e.g. nginx) can reach them.

Two env files are required next to `docker-compose.yml`:

1. `.env` — used by docker compose itself for variable substitution:

   ```env
   DB_USER=bemymate_admin
   DB_PASS=<long-random-password>
   ```

2. `app.env` — passed into the `app` container (Nuxt runtimeConfig). Same shape as `.env.example`:

   ```env
   NUXT_CLIENT_SECRET=<faceit_client_secret>
   NUXT_API_KEY=<faceit_data_api_key>
   NUXT_PUBLIC_CLIENT_ID=<faceit_client_id>
   NUXT_PUBLIC_LANDING_MODE=false
   ```

   `NUXT_DB_URL` and `NUXT_PUBLIC_SEARCH_HOST` are injected by docker-compose, no need to set them in `app.env`.

Bring services up:

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f app
```

Mongo data persists in the `mongo_data` named volume. Logs are bind-mounted to `./logs/` and `./modules/socketio-server/logs/`.

The reverse proxy (nginx on the host) should forward:
- `/` → `http://127.0.0.1:3001` (Nuxt app)
- `/socket.io/` → `http://127.0.0.1:5176` with WebSocket upgrade headers (Socket.IO server)

## Rollback strategy

If a new release breaks production, revert and rebuild only the `app` container:

```bash
cd /opt/bemymate
sudo git log --oneline -3                  # find the last good SHA
sudo git revert <bad-commit-sha> --no-edit # creates a revert commit on main
cd bemymayte-master
sudo docker compose up -d --build app
sudo docker compose logs --tail 30 app     # confirm it's up
curl -sI https://bemymate.ru/              # expect 200 OK
```

Total rollback time: ~2 minutes. Mongo and Socket.IO containers stay up — only the Nuxt `app` is rebuilt.
