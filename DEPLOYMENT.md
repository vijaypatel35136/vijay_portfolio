# GitHub Deployment Setup Guide

This guide will help you set up automatic deployment for your portfolio website using GitHub Actions.

## Architecture

This is a **frontend-only** application with:
- **Frontend**: React + Vite (deployed to Vercel)
- **Database**: PostgreSQL (Neon/Supabase)
- **No backend server** - frontend connects directly to PostgreSQL

## Prerequisites
- GitHub account
- Vercel account (for frontend deployment)
- Neon or Supabase account (for PostgreSQL database)

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `vijay-portfolio` (or your preferred name)
3. Make it **Public** or **Private** (your choice)
4. Don't initialize with README, .gitignore, or license
5. Click "Create repository"

## Step 2: Push Code to GitHub

Run these commands in your terminal:

```bash
cd "e:/vijay portfolio"
git remote add origin https://github.com/YOUR_USERNAME/vijay-portfolio.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Setup PostgreSQL Database (Neon)

1. Go to https://neon.tech and sign up/login
2. Click "Create a project"
3. Choose a name (e.g., `portfolio-db`)
4. Select a region closest to your users
5. Click "Create Project"
6. Copy the **Connection String** from the dashboard
   - Format: `postgresql://user:password@host:port/database`

## Step 4: Setup Vercel (Frontend Deployment)

1. Go to https://vercel.com and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click "Deploy"

### Get Vercel Credentials for GitHub Actions:

1. Go to https://vercel.com/account/tokens
2. Create a new token named "GitHub Actions"
3. Copy the token

4. Go to your Vercel project dashboard
5. Go to Settings → General
6. Copy the **Project ID**

7. Go to https://vercel.com/account/settings
8. Copy the **Organization ID** (or Team ID)

## Step 5: Setup GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

### Required Secrets:
- `VERCEL_TOKEN`: Your Vercel token from Step 4
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID
- `VITE_DATABASE_URL`: Your Neon PostgreSQL connection string from Step 3

## Step 6: Test Automatic Deployment

1. Make a small change to your code (e.g., update README)
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test deployment"
   git push
   ```
3. Go to GitHub repository → Actions tab
4. Watch the workflow run automatically
5. Your frontend will deploy to Vercel

## Alternative: Use GitHub Pages for Frontend (Free)

If you prefer not to use Vercel, you can use GitHub Pages:

1. Update `.github/workflows/deploy-frontend.yml` with this content:

```yaml
name: Deploy Frontend to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Build frontend
        working-directory: ./frontend
        run: npm run build
        env:
          VITE_DATABASE_URL: ${{ secrets.VITE_DATABASE_URL }}

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
```

2. Go to GitHub repository → Settings → Pages
3. Source: GitHub Actions
4. Save

## Local Development Setup

1. Copy `frontend/.env.example` to `frontend/.env`
2. Add your Neon database URL:
   ```
   VITE_DATABASE_URL=postgresql://user:password@host:port/database
   ```
3. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Run development server:
   ```bash
   npm run dev
   ```

## Important Notes

- **Security**: Never commit `.env` files or sensitive data
- **Database**: PostgreSQL is managed by Neon/Supabase - no local database needed
- **Contact Form**: Messages are saved directly to PostgreSQL from the frontend
- **Static Content**: Portfolio data (skills, experience, projects) is hardcoded in the component

## Troubleshooting

If deployment fails:
1. Check GitHub Actions logs
2. Verify all secrets are correctly set
3. Ensure build commands work locally
4. Check Vercel dashboard for deployment logs
5. Verify Neon database connection string is correct
