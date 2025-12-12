# Home Service Backend Server

## Setup Instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)

### 2. Install Dependencies
```bash
cd server
npm install
```

### 3. Configure Environment Variables
Edit the `.env` file in the server folder:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/homeservice

# JWT Secret Key (use a strong random string in production)
JWT_SECRET=your_super_secret_jwt_key_here

# Server Port
PORT=5000

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Google OAuth (optional - get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Start MongoDB
Make sure MongoDB is running locally, or use MongoDB Atlas connection string.

**Local MongoDB:**
```bash
mongod
```

### 5. Run the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |
| PUT | `/api/auth/profile` | Update profile (protected) |
| GET | `/api/auth/google` | Initiate Google OAuth |
| GET | `/api/auth/google/callback` | Google OAuth callback |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

## Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application"
6. Add authorized JavaScript origins: `http://localhost:5173`
7. Add authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
8. Copy Client ID and Client Secret to your `.env` file

## Request Examples

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'
```

### Get Current User
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```




