# Vijay Bhesaniya - Portfolio Website + Admin Panel

A modern, full-stack portfolio website built with Vite, React, TypeScript, and PostgreSQL.

## 🚀 Features

### Public Portfolio
- Modern dark-mode-first design with teal-on-navy color scheme
- Animated hero section with typewriter effect
- Sticky right-side scroll-dot navigation
- Sections: Hero, About, Skills, Experience, Projects, Education, Contact
- Fully responsive design for all devices
- **Dynamic contact form with success/error messages**
- **All data fetched from PostgreSQL database**

### Admin Panel (/admin)
- Secure JWT-based authentication
- Dashboard with stats overview
- **Full CRUD operations for all sections:**
  - Profile Manager
  - Skills Manager
  - Experience Manager
  - Projects Manager
  - Education Manager
  - **Messages Manager** (view contact form submissions)
- **Real-time updates** - changes reflect immediately on frontend
- **PostgreSQL database** - all data stored persistently

## 🛠 Tech Stack

- **Frontend**: Vite + React + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **File Storage**: Local /uploads folder

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 12+ installed and running

### Setup Steps

1. **Install dependencies:**
```bash
npm install
```

2. **Configure PostgreSQL:**

Create a PostgreSQL database:
```sql
CREATE DATABASE vijay_portfolio;
```

3. **Configure environment variables:**

Copy `.env.example` to `.env` and update:
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vijay_portfolio
DB_USER=postgres
DB_PASSWORD=your_password_here

# Server
PORT=3001
JWT_SECRET=your-secret-key-here
```

4. **Initialize database:**
```bash
npm run db:migrate
```

This will:
- Create all necessary tables
- Seed with default admin user
- Populate with sample portfolio data

5. **Start development servers:**
```bash
npm run dev
```

This starts:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 🔐 Default Admin Credentials

- **Email:** admin@vijay.dev
- **Password:** admin123

⚠️ **IMPORTANT:** Change these credentials after first login!

## 📁 Project Structure

```
vijay-portfolio/
├── client/                     # Vite + React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── admin/          # Admin panel components
│   │   │   └── ContactForm.tsx # Dynamic contact form
│   │   ├── pages/              # Page components
│   │   │   ├── Home.tsx        # Main portfolio (dynamic data)
│   │   │   ├── AdminLogin.tsx  # Admin login
│   │   │   └── AdminDashboard.tsx # Admin dashboard
│   │   └── main.tsx
│   └── index.html
├── server/                     # Express backend
│   ├── routes/                 # API routes (all CRUD operations)
│   │   ├── auth.ts
│   │   ├── profile.ts
│   │   ├── skills.ts
│   │   ├── experience.ts
│   │   ├── projects.ts
│   │   ├── education.ts
│   │   ├── contact.ts          # Contact form API
│   │   └── admin.ts
│   ├── middleware/             # Auth middleware
│   ├── db/                     # Database connection
│   └── index.ts
├── scripts/                    # Database migration
└── uploads/                    # File uploads
```

## 🎨 Features in Detail

### Frontend
- **Dynamic Content**: All sections pull data from PostgreSQL
- **Contact Form**: 
  - Form validation
  - Success/error message display
  - Messages saved to database
  - Accessible in admin panel
- **Real-time Updates**: Changes in admin reflect immediately

### Admin Panel
- **Dashboard**: View stats (projects, messages, experience)
- **Profile Manager**: Edit name, taglines, bio, contact info
- **Skills Manager**: Add/edit/delete skills by category
- **Experience Manager**: Full CRUD for work history
- **Projects Manager**: Manage portfolio projects
- **Education Manager**: Edit educational background
- **Messages Manager**: 
  - View all contact form submissions
  - Mark as read/unread
  - Delete messages
  - Reply via email
  - Unread message counter

### Database (PostgreSQL)
- All data persisted in PostgreSQL
- Tables: admin, profile, skills, experience, projects, education, messages
- Full CRUD operations via REST API
- Secure authentication with JWT

## 🔧 Available Scripts

```bash
npm run dev              # Start both client and server
npm run dev:client       # Start frontend only (port 5173)
npm run dev:server       # Start backend only (port 3001)
npm run build            # Build for production
npm run db:migrate       # Create database tables and seed data
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

### Public Endpoints
- `GET /api/profile` - Get profile data
- `GET /api/skills` - Get all skills
- `GET /api/experience` - Get experience history
- `GET /api/projects` - Get all projects
- `GET /api/education` - Get education history
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Require JWT)
- `PUT /api/profile` - Update profile
- `POST/PUT/DELETE /api/skills/:id` - Manage skills
- `POST/PUT/DELETE /api/experience/:id` - Manage experience
- `POST/PUT/DELETE /api/projects/:id` - Manage projects
- `POST/PUT/DELETE /api/education/:id` - Manage education
- `GET /api/contact` - Get all messages
- `PUT /api/contact/:id/read` - Mark message as read
- `DELETE /api/contact/:id` - Delete message
- `GET /api/admin/stats` - Get dashboard statistics

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the 'dist' folder
```

### Backend (Render/Railway/Fly.io)
- Set environment variables
- Connect PostgreSQL database
- Deploy server folder

## 📤 GitHub Setup & Deployment

### Step 1: Initialize Git Repository
```bash
cd "c:\Vijay\Project\vijay portfolio"
git init
```
*(Note: Repository already initialized and pushed to GitHub)*

### Step 2: Create .gitignore
The `.gitignore` file is already configured to exclude:
- `node_modules/` (dependencies)
- `.env` (environment variables)
- `dist/` (build output)
- `uploads/` (uploaded files)
- Editor files (`.vscode`, `.idea`)

### Step 3: Add Files to Git
```bash
git add .
git commit -m "Initial commit: Portfolio website with admin panel"
```

### Step 4: Create GitHub Repository
1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon → "New repository"
3. Repository name: `vijay-portfolio` (or your preferred name)
4. Make it **Public** (for portfolio visibility)
5. Don't initialize with README (you already have one)
6. Click "Create repository"

### Step 5: Push to GitHub
```bash
# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/vijaypatel35136/vijay_portfolio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 6: Clone from GitHub (for others to run)
```bash
# Clone the repository
git clone https://github.com/vijaypatel35136/vijay_portfolio.git
cd vijay_portfolio

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

### Step 7: GitHub Pages Deployment (Frontend Only)

#### Option A: Using GitHub Pages (Free)
1. Go to your GitHub repository
2. Click "Settings" → "Pages"
3. Source: Deploy from a branch
4. Branch: `main` → `/ (root)` or `/dist` folder
5. Click "Save"

For GitHub Pages with Vite, you may need to update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/vijay-portfolio/', // Your repository name
  // ... rest of config
})
```

#### Option B: Using Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Your site will be live at `https://your-project.vercel.app`

#### Option C: Using Netlify
1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to Netlify
3. Or connect Netlify to your GitHub repository

### Step 8: Backend Deployment (Render/Railway)

#### Using Render (Free tier available)
1. Create account at [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm run dev:server`
   - Environment Variables: Add all from your `.env` file
5. Deploy

#### Using Railway (Free tier available)
1. Create account at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add PostgreSQL database
5. Configure environment variables
6. Deploy

### Step 9: Environment Variables for Production

When deploying to production, set these environment variables:

```bash
# Database (use your cloud provider's connection string)
DATABASE_URL=postgresql://user:password@host:port/database

# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key

# Server Port
PORT=3001

# Node Environment
NODE_ENV=production
```

### Step 10: Update Frontend API URL

For production deployment, update the API base URL in your frontend:

**Option 1: Use relative paths (works with same domain)**
```typescript
// In your API calls, use relative paths
fetch('/api/profile') // Works if frontend and backend on same domain
```

**Option 2: Use environment variable**
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
fetch(`${API_URL}/api/profile`)
```

Add to `.env`:
```bash
VITE_API_URL=https://your-backend-url.com
```

### GitHub Repository URL Example

After following these steps, your repository will be available at:
```
https://github.com/vijaypatel35136/vijay_portfolio
```

Others can clone and run it with:
```bash
git clone https://github.com/vijaypatel35136/vijay_portfolio.git
cd vijay_portfolio
npm install
npm run dev
```

### GitHub Pages URL

After enabling GitHub Pages with the automated workflow, your site will be available at:
```
https://vijaypatel35136.github.io/vijay_portfolio/
```

## 🎯 How It Works

1. **Contact Form Flow:**
   - User fills form on frontend
   - Form data sent to `/api/contact` (POST)
   - Saved to PostgreSQL `messages` table
   - Success message shown to user
   - Admin can view in Messages Manager

2. **Admin Panel Flow:**
   - Login with credentials
   - JWT token stored in localStorage
   - All API requests include JWT in Authorization header
   - CRUD operations update PostgreSQL
   - Frontend fetches updated data and re-renders

3. **Frontend Data Flow:**
   - On page load, fetch all data from API
   - Data stored in React state
   - Components render dynamically
   - Loading states shown during fetch

---

**Built with ❤️ by Vijay Bhesaniya**

Portfolio: https://vijaybhesaniya.github.io/portfolio/
LinkedIn: https://linkedin.com/in/bhesaniya-vijay-355b7020b