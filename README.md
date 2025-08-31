# ME-API Playground

A RESTful API service for managing personal profiles, skills, projects, and work experience. Built with Node.js, Express, and MongoDB.
**[Live Hosted Project URL →](https://me-api-playground-o9hp.onrender.com)**

## 🏗️ Architecture

### Tech Stack
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas
- **Authentication**: Basic Auth (optional, configurable)
- **Rate Limiting**: Express Rate Limit middleware
- **Frontend**: Static HTML/CSS/JS served by Express
- **Testing**: Jest + Supertest

### Project Structure
```
me-api-playground/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth & rate limiting
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   └── server.js        # Main server file
│   ├── scripts/             # Database seeding
│   └── __tests__/           # Test files
├── frontend/                 # Static frontend files
└── package.json
```

### API Endpoints
- `GET /health` - Health check
- `GET /api/profile` - Retrieve profile
- `POST /api/profile` - Create profile (requires auth)
- `PUT /api/profile` - Update profile (requires auth)
- `GET /api/skills/top?limit=5` - Get top skills
- `GET /api/projects?skill=node.js&page=1&limit=10` - Filter projects by skill
- `GET /api/search?q=query` - Search across all profile data

## 🚀 Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or cloud)
- npm or yarn

### Local Development

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd me-api-playground
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/me_api_playground
   CORS_ORIGIN=*
   RATE_LIMIT_PER_MIN=60
   # Optional: Basic Auth for write operations
   BASIC_USER=admin
   BASIC_PASS=password
   ```

3. **Database Setup**
   ```bash
   # Start MongoDB (if running locally)
   mongod
   
   # Seed the database with sample data
   npm run seed
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Server will start at `http://localhost:4000`

### Production Deployment

1. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=4000
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
   CORS_ORIGIN=https://yourdomain.com
   RATE_LIMIT_PER_MIN=30
   BASIC_USER=your_username
   BASIC_PASS=your_secure_password
   ```

2. **Build and Deploy**
   ```bash
   npm start
   ```

## 📊 Data Schema

### Profile Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  headline: String,
  summary: String,
  skills: [{
    name: String (required),
    level: Number (1-10, default: 5)
  }],
  projects: [{
    title: String (required),
    description: String,
    links: [String],
    skills: [String]
  }],
  work: [{
    role: String,
    org: String,
    start: String,
    end: String,
    summary: String
  }],
  education: [{
    school: String,
    degree: String,
    start: String,
    end: String
  }],
  links: {
    github: String,
    linkedin: String,
    portfolio: String,
    website: String
  },
  timestamps: true
}
```

## 🔧 API Usage Examples

### cURL Commands

1. **Get Profile**
   ```bash
   curl -X GET http://localhost:4000/api/profile
   ```

2. **Create Profile (with auth)**
   ```bash
   curl -X POST http://localhost:4000/api/profile \
     -H "Content-Type: application/json" \
     -u "admin:password" \
     -d '{
       "name": "John Doe",
       "email": "john@example.com",
       "headline": "Full Stack Developer"
     }'
   ```

3. **Update Profile (with auth)**
   ```bash
   curl -X PUT http://localhost:4000/api/profile \
     -H "Content-Type: application/json" \
     -u "admin:password" \
     -d '{
       "headline": "Senior Full Stack Developer"
     }'
   ```

4. **Get Top Skills**
   ```bash
   curl -X GET "http://localhost:4000/api/skills/top?limit=3"
   ```

5. **Filter Projects by Skill**
   ```bash
   curl -X GET "http://localhost:4000/api/projects?skill=node.js&page=1&limit=5"
   ```

6. **Search Across Profile**
   ```bash
   curl -X GET "http://localhost:4000/api/search?q=javascript"
   ```

### Postman Collection

Import the included `Me-API.postman_collection.json` file into Postman. The collection includes:

- Pre-configured requests for all endpoints
- Environment variables for easy switching between local/prod
- Example queries and parameters
- Authentication headers setup

**Postman Environment Variables:**
- `base`: `http://localhost:4000` (local) or your production URL

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 📝 Known Limitations 

- **Single Profile** — App is designed to store *your own* candidate profile (not multi-tenant).
- **Simple Search** — `/api/search` does basic text matching only (no fuzzy/stemming).
- **Unpaginated Skills** — `/api/skills/top` returns top N; full skills pagination isn’t implemented.


## 🔒 Security Features

- Rate limiting (configurable per minute)
- CORS configuration
- Basic authentication for write operations
- Input validation and sanitization
- MongoDB injection protection via Mongoose

## 🚀 Performance Considerations

- Database indexes on frequently queried fields
- Rate limiting to prevent abuse
- Efficient MongoDB queries with lean operations
- Static file serving for frontend

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Jest Testing Framework](https://jestjs.io/)

---

## 📄 Resume

**[View My Resume →](https://drive.google.com/file/d/1DV_2985hOk1_wP75H8sm4lzpOCswLInN/view?usp=drive_link)**

