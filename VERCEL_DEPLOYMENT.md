# Vercel Deployment Guide

This guide explains how to deploy your portfolio to Vercel with proper API configuration.

## Prerequisites

- Backend deployed to a hosting service (Render, Railway, etc.)
- Backend API URL available (e.g., https://your-backend.onrender.com)

## Vercel Environment Variables

When deploying to Vercel, you need to set the following environment variable:

### `VITE_API_URL` (Required)

This is the URL of your deployed backend API.

**Example:**
```
VITE_API_URL=https://your-backend.onrender.com
```

**How to set:**
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add a new variable:
   - Name: `VITE_API_URL`
   - Value: Your backend API URL (e.g., https://your-backend.onrender.com)
   - Environments: Production, Preview, Development

## Backend CORS Configuration

Your backend must be configured to accept requests from your Vercel domain.

### Backend Environment Variables

Set these in your backend hosting service:

- `FRONTEND_URL`: Your Vercel domain (e.g., https://your-portfolio.vercel.app)
- `NODE_ENV`: `production`

### Example Backend CORS Setup

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}))
```

## Deployment Steps

### 1. Deploy Backend First

1. Deploy your backend to Render, Railway, or similar service
2. Note the backend API URL (e.g., https://your-backend.onrender.com)
3. Set `FRONTEND_URL` environment variable to your Vercel domain

### 2. Deploy Frontend to Vercel

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Set `VITE_API_URL` environment variable to your backend URL
4. Deploy

### 3. Test the Deployment

1. Visit your Vercel URL
2. Try accessing the admin panel
3. Test login with your admin credentials
4. Verify all API calls work correctly

## Troubleshooting

### Network Error on Admin Login

**Problem**: "Network error. Please try again." when trying to login

**Solutions**:
1. Check that `VITE_API_URL` is set correctly in Vercel
2. Verify backend is running and accessible
3. Check backend CORS configuration
4. Ensure `FRONTEND_URL` is set in backend environment variables
5. Check browser console for specific error messages

### CORS Errors

**Problem**: CORS policy errors in browser console

**Solutions**:
1. Verify backend CORS allows your Vercel domain
2. Check that `FRONTEND_URL` matches your Vercel domain exactly
3. Ensure backend is configured with `credentials: true` if using cookies

### API Calls Failing

**Problem**: API calls returning 404 or 500 errors

**Solutions**:
1. Verify `VITE_API_URL` includes the full backend URL
2. Check backend logs for errors
3. Ensure all API routes are correctly configured
4. Test backend API directly using curl or Postman

## Environment Variables Summary

### Frontend (Vercel)
- `VITE_API_URL`: Backend API URL (required)

### Backend (Render/Railway)
- `FRONTEND_URL`: Vercel domain (required for CORS)
- `NODE_ENV`: `production`
- `PORT`: Provided by hosting service
- `JWT_SECRET`: Your JWT secret
- Database configuration variables
- Admin credentials

## Example Configuration

### Vercel Environment Variables
```
VITE_API_URL=https://vijay-portfolio-backend.onrender.com
```

### Backend Environment Variables (Render)
```
FRONTEND_URL=https://vijay-portfolio.vercel.app
NODE_ENV=production
JWT_SECRET=your-secure-jwt-secret
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=vijay_portfolio
DB_USER=postgres
DB_PASSWORD=your-db-password
ADMIN_EMAIL=admin@vijay.dev
ADMIN_PASSWORD=your-secure-password
```

## Local Development

For local development, you don't need to set `VITE_API_URL`. The app will use relative paths which work with the Vite proxy configuration in `vite.config.ts`.

If you want to test with a remote backend locally, create a `.env` file in the `client` directory:

```
VITE_API_URL=https://your-backend.onrender.com
```
