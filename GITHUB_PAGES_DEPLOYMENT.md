# GitHub Pages Deployment Guide

This guide explains how to deploy your portfolio to GitHub Pages. This is a static site that uses local storage for data management - no backend required.

## Prerequisites

- GitHub repository with GitHub Pages enabled
- Node.js installed locally for development

## GitHub Pages Setup

### 1. Enable GitHub Pages

- Go to your repository on GitHub
- Navigate to Settings → Pages
- Source: GitHub Actions
- The workflow in `.github/workflows/deploy.yml` will handle deployment

### 2. No Secrets Required

Since this is a static site using local storage, no GitHub Secrets or environment variables are needed.

## Deployment Steps

### Deploy to GitHub Pages

1. Push your code to GitHub main branch
2. The workflow will automatically build and deploy to GitHub Pages
3. Visit your GitHub Pages URL after deployment completes: https://vijaypatel35136.github.io/vijay_portfolio/

## Configuration Notes

The `vite.config.ts` is already configured with:
- `base: '/vijay_portfolio/'` - matches your GitHub Pages repository name
- Build output to `../dist` - correct for GitHub Pages workflow

## Data Management

This portfolio uses browser local storage for data persistence:
- Profile information
- Skills
- Experience
- Projects
- Education
- Contact messages

**Important**: Data is stored locally in the user's browser. Each user will see their own data. This is suitable for:
- Personal portfolio display
- Admin panel for local content management
- Contact form submissions (stored locally)

## Admin Panel

Access the admin panel at `/admin` on your deployed site:
- Default credentials: `admin@vijay.dev` / `admin123`
- You can modify these in `client/src/lib/storage.ts`
- Admin panel allows you to manage all portfolio content locally

## Local Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The site will be available at http://localhost:5173/vijay_portfolio/

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Troubleshooting

### Site Not Loading

**Problem**: GitHub Pages shows 404 or blank page

**Solutions**:
1. Check that GitHub Pages is enabled in repository settings
2. Verify the workflow completed successfully in Actions tab
3. Ensure the `base` path in `vite.config.ts` matches your repository name
4. Check that the workflow is configured for correct branch (main)

### Admin Panel Not Working

**Problem**: Cannot login to admin panel

**Solutions**:
1. Verify you're using correct credentials (admin@vijay.dev / admin123)
2. Check browser console for JavaScript errors
3. Ensure local storage is enabled in your browser
4. Try clearing browser cache and local storage

### Data Not Persisting

**Problem**: Changes in admin panel are not saved

**Solutions**:
1. Ensure local storage is enabled in your browser
2. Check browser storage quota is not exceeded
3. Verify no browser extensions are blocking local storage
4. Try using a different browser

### Styling Issues

**Problem**: Site looks different than expected

**Solutions**:
1. Clear browser cache
2. Check that Tailwind CSS is building correctly
3. Verify all CSS files are included in the build
4. Check browser console for CSS-related errors

## Customization

### Change Admin Credentials

Edit `client/src/lib/storage.ts` and modify the `login` function:

```typescript
login: (email: string, password: string): boolean => {
  if (email === 'your-email@example.com' && password === 'your-password') {
    const token = btoa(`${email}:${Date.now()}`)
    authStorage.setToken(token)
    return true
  }
  return false
}
```

### Modify Default Data

Edit the default data objects in `client/src/lib/storage.ts`:
- `defaultProfile` - Profile information
- `defaultSkills` - Skills list
- `defaultExperiences` - Experience entries
- `defaultProjects` - Projects list
- `defaultEducation` - Education entries

## Architecture

This is a **static single-page application** with:
- React + TypeScript for UI
- Vite for build tooling
- Tailwind CSS for styling
- Local Storage for data persistence
- No backend server required
- No database required
- No external API calls

## Limitations

Since this uses local storage:
- Data is not shared between users
- Data is lost when browser cache is cleared
- Not suitable for multi-user admin scenarios
- Contact form submissions are stored locally only
- No email notifications for contact forms

## Advantages

- Simple deployment (static hosting)
- No hosting costs
- Fast performance
- Easy to maintain
- No backend complexity
- Works offline after initial load
