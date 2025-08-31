
# Me‑API Playground (Track A) — Node.js + MongoDB + HTML/CSS

A minimal full‑stack app that stores *your own profile* and exposes a small API with a very basic frontend for queries.

## Stack
- **Backend**: Node.js (Express) + Mongoose
- **DB**: MongoDB
- **Frontend**: Plain HTML/CSS/JS (no build tools)
- **Hosting**: Any Node host (Render/Fly/Heroku) + Mongo Atlas. CORS is enabled by default.

## Quick start (local)

```bash
# 1) Install dependencies
npm install

# 2) Configure env
cp .env.example .env
# (if needed, edit .env to point at your MongoDB)

# 3) Seed data (uses backend/scripts/seed.js)
npm run seed

# 4) Run server
npm run dev
# Visit http://localhost:4000 (frontend) and http://localhost:4000/health
```

## API

- `GET /health` → liveness probe (200)
- `GET /api/profile` → returns your profile (single document)
- `POST /api/profile` → create profile (idempotent). *Basic Auth* required if BASIC_USER/BASIC_PASS set.
- `PUT /api/profile` → update profile. *Basic Auth* required if BASIC_USER/BASIC_PASS set.
- `GET /api/skills/top?limit=5` → top N skills by level
- `GET /api/projects?skill=python` → filter projects having that skill
- `GET /api/search?q=...` → search across name, headline, summary, skills, project titles/descriptions

### Data model

See `backend/src/models/Profile.js` and `backend/scripts/seed.json`. One profile document holds:
- `name`, `email`, `education` (array), `skills[]` ({ name, level[1‑10] }),
- `projects[]` ({ title, description, links[], skills[] }),
- `work[]` ({ role, org, start, end, summary }),
- `links` ({ github, linkedin, portfolio, website })

Indexes are defined for `skills.name`, `projects.title`, and `projects.skills` for easy querying.

## Frontend

The frontend is a single static page in `/frontend/index.html` that calls the hosted API with CORS. It lets you:
- Search by skill
- List projects
- View your profile

## Deployment Notes

- Set `MONGODB_URI` and `PORT` in your production environment.
- Serve the static `/frontend` folder behind the same Express app (already configured), or host separately and point it to your API origin.
- Optional: enable Basic Auth for write ops by setting `BASIC_USER`/`BASIC_PASS` envs.

## Known limitations

- Single‑user profile only (by design).
- No pagination on list endpoints except simple limit for skills.
- Simple text search (no Atlas Search).

---

**Resume link placeholder**: Add your resume URL here.


## Optional features included
- **Basic auth** for POST/PUT (set `BASIC_USER`/`BASIC_PASS`).
- **Logging** with `morgan`.
- **Simple rate limit**: 60 req/min/IP on `/api/*` (see `middleware/rateLimiter.js`).
- **Pagination** on `/api/projects` with `page` + `limit` returning `{ total, page, limit, items }`.
- **Tests**: Jest + Supertest (`npm test`).
- **CI**: GitHub Actions workflow `.github/workflows/ci.yml` runs seed + tests with Mongo service.
- **Postman**: `Me-API.postman_collection.json` with ready-made requests.

## How to run locally (detailed)

1. **Install**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # edit .env if your MongoDB URI/port differs
   ```

3. **Start MongoDB**
   - If you have Docker:
     ```bash
     docker run -d --name mongo -p 27017:27017 mongo:6
     ```
   - Or run your local Mongo service.

4. **Seed your data**
   ```bash
   npm run seed
   ```

5. **Run the app**
   ```bash
   npm run dev   # hot reload with nodemon
   # or
   npm start     # plain node
   ```
   - Visit **http://localhost:4000** for the UI
   - Check **http://localhost:4000/health** for 200 OK

6. **Test the API**
   - With cURL:
     ```bash
     curl -s http://localhost:4000/health
     curl -s http://localhost:4000/api/profile
     curl -s "http://localhost:4000/api/projects?skill=node.js&limit=1&page=1"
     curl -s "http://localhost:4000/api/search?q=mongo"
     curl -s http://localhost:4000/api/skills/top?limit=3
     ```
   - With Postman: import `Me-API.postman_collection.json` and set `base = http://localhost:4000`.

7. **Run tests**
   ```bash
   npm test
   ```

## Pagination examples
- `/api/projects?limit=2&page=1`
- `/api/projects?skill=css&limit=5&page=2`

## Write operations (optional Basic Auth)
If `BASIC_USER`/`BASIC_PASS` are set, send credentials on `POST /api/profile` and `PUT /api/profile`:
```bash
curl -u "$BASIC_USER:$BASIC_PASS" -H "Content-Type: application/json" -d '{"headline":"Updated"}'   -X PUT http://localhost:4000/api/profile
```
