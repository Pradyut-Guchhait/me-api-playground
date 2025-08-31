
# Me-API Playground — Node.js + MongoDB + HTML/CSS

This build serves **frontend + backend together** and shows **plain text** in the UI (no raw JSON). It includes optional features: basic auth for write ops, rate limiting, pagination, tests, and CI.

See `.env.example` for configuration. Run with:
```bash
npm install
cp .env.example .env
npm run seed
npm run dev
```

Deploy easily to Render with `MONGODB_URI` set to your Atlas string.
