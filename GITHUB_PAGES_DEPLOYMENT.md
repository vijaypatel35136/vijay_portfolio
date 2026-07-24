# GitHub Pages Deployment Guide

This guide explains how to deploy your portfolio to GitHub Pages with proper API configuration.

## Prerequisites

- Backend deployed to a hosting service (Render, Railway, etc.)
- Backend API URL available (e.g., https://your-backend.onrender.com)
- GitHub repository with GitHub Pages enabled

## GitHub Pages Setup

### 1. Enable GitHub Pages

- Go to your repository on GitHub
- Navigate to Settings → Pages
- Source: GitHub Actions
- The workflow in `.github/workflows/deploy.yml` will handle deployment

### 2. Set GitHub Secrets

- Go to Settings → Secrets and variables → Actions
- Add a new secret:
  - Name: `VITE_API_URL`
  - Value: Your backend API URL (e.g., https://your-backend.onrender.com)

## Backend Configuration

Your backend must be configured to accept requests from your GitHub Pages domain.

### Backend Environment Variables

Set these in your backend hosting service:

- `FRONTEND_URL`: Your GitHub Pages URL (e.g., https://vijaypatel35136.github.io/vijay_portfolio/)
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
3. Set `FRONTEND_URL` environment variable to your GitHub Pages URL

### 2. Deploy Frontend to GitHub Pages

1. Push your code to GitHub
2. The workflow will automatically build and deploy to GitHub Pages
3. Visit your GitHub Pages URL after deployment completes

### 3. Test the Deployment

1. Visit https://vijaypatel35136.github.io/vijay_portfolio/
2. Try accessing the admin panel
3. Test login with your admin credentials
4. Verify all API calls work correctly

## Configuration Notes

The `vite.config.ts` is already configured with:
- `base: '/vijay_portfolio/'` - matches your GitHub Pages repository name
- Build output to `../dist` - correct for GitHub Pages workflow

## Troubleshooting

### Network Error on Admin Login

**Problem**: "Network error. Please try again." when trying to login

**Solutions**:
1. Check that `VITE_API_URL` is set correctly in GitHub Secrets
2. Verify backend is running and accessible
3. Check backend CORS configuration
4. Ensure `FRONTEND_URL` is set in backend environment variables
5. Check browser console for specific error messages

### CORS Errors

**Problem**: CORS policy errors in browser console

**Solutions**:
1. Verify backend CORS allows your GitHub Pages domain
2. Check that `FRONTEND_URL` matches your GitHub Pages domain exactly
3. Ensure backend is configured with `credentials: true` if using cookies

### API Calls Failing

**Problem**: API calls returning 404 or 500 errors

**Solutions**:
1. Verify `VITE_API_URL` includes the full backend URL
2. Check backend logs for errors
3. Ensure all API routes are correctly configured
4. Test backend API directly using curl or Postman

## Environment Variables Summary

### Frontend (GitHub Pages)
- `VITE_API_URL`: Backend API URL (required) - set in GitHub Secrets

### Backend (Render/Railway)
- `FRONTEND_URL`: GitHub Pages domain (required for CORS)
- `NODE_ENV`: `production`
- `PORT`: Provided by hosting service
- `JWT_SECRET`: Your JWT secret
- Database configuration variables
- Admin credentials

## Example Configuration

### GitHub Secrets
```
VITE_API_URL=https://vijay-portfolio-backend.onrender.com
```

### Backend Environment Variables (Render)
```
FRONTEND_URL=https://vijaypatel35136.github.io/vijay_portfolio/
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
