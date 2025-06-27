# Deployment Guide for Render

## Prerequisites
- MongoDB Atlas account (for database)
- Render account

## Environment Variables for Backend

Set these environment variables in your Render backend service:

```
NODE_ENV=production
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-super-secret-jwt-key
PORT=10000
```

## Environment Variables for Frontend

Set these environment variables in your Render frontend service:

```
VITE_API_URL=https://your-backend-service-name.onrender.com
```

## Deployment Steps

### Option 1: Using render.yaml (Recommended)
1. Push your code to GitHub
2. Connect your repository to Render
3. Render will automatically detect the `render.yaml` file and create both services

### Option 2: Manual Setup

#### Backend Service
1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Set the following:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: Leave empty (root of repo)

#### Frontend Service
1. Create a new Static Site in Render
2. Connect your GitHub repository
3. Set the following:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

## Common Issues and Solutions

### "Vite not found" Error
- This happens when Render tries to build the frontend from the wrong directory
- Solution: Make sure the build command is run from the root directory, not the server directory

### "Package.json not found" Error
- This happens when Render can't find the package.json file
- Solution: The server now has its own package.json file in the server directory

### CORS Issues
- Make sure your backend CORS configuration includes your frontend domain
- Update the CORS origin in `server/index.js` with your actual frontend URL

## File Structure
```
project/
├── package.json          # Frontend dependencies
├── server/
│   ├── package.json      # Backend dependencies (NEW)
│   └── index.js          # Server entry point
├── src/                  # Frontend source code
└── render.yaml           # Render configuration (NEW)
``` 