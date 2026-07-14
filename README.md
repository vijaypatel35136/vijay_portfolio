# Vijay Bhesaniya — Personal Portfolio & Admin Panel CMS

A modern, high-converting, and dynamic personal portfolio website for a **Shopify Liquid & Python Developer**, complete with a secure administrative dashboard for full-stack content management (experience, projects, skills, messages) without editing code.

---

## 🚀 Tech Stack

- **Frontend:** React (Vite) + TypeScript + Tailwind CSS v4 + Framer Motion (Scroll animations & micro-interactions)
- **Backend:** Python (FastAPI) + SQLite (for local development)
- **ORM:** SQLAlchemy + Pydantic validation
- **Authentication:** JWT (JSON Web Tokens) with direct `bcrypt` password hashing
- **Icons:** Lucide React

---

## 🛠️ Project Structure

```text
vijay-portfolio/
├── backend/            # FastAPI app, SQLAlchemy models, SQLite database, uploads
│   ├── app/            # Source code (routes, database models, seed scripts)
│   ├── uploads/        # Static uploads folder (stores resumes, images)
│   └── requirements.txt
├── frontend/           # React TypeScript Vite application
│   ├── src/            # Components, pages, custom API utilities, contexts
│   └── package.json
└── README.md           # This setup manual
```

---

## 🔧 Installation & Setup

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)

---

### 2. Backend Setup
Navigate to the `backend/` directory, create a virtual environment, install requirements, and pre-seed the database:

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Activate virtual environment (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the database seeding script (pre-seeds all projects, history, and admin credentials)
python -m app.seed
```

**Run the Backend server:**
```bash
# Start FastAPI backend (listens on port 8000)
uvicorn app.main:app --reload
```

*The API is now running locally at: `http://localhost:8000`*
*API Documentation (Swagger UI) is available at: `http://localhost:8000/docs`*

---

### 3. Frontend Setup
Open a new terminal window, navigate to the `frontend/` directory, install packages, and launch Vite:

```bash
# Navigate to frontend
cd frontend

# Install Node dependencies
npm install

# Launch Vite development server
npm run dev
```

*The frontend application is now running at: `http://localhost:5173`*
*Vite is configured to automatically proxy API and file upload routes to the FastAPI port (`http://localhost:8000`), preventing CORS issues.*

---

## 🔑 Administrative Credentials (Seeded)

The database seeding script preloads a default administrator account. You can use these credentials to access the Admin Panel:

- **Admin URL:** `http://localhost:5173/admin` (or click "Admin Console" in the footer)
- **Default Email:** `admin@portfolio.com`
- **Default Password:** `admin_secure_pass123`

> [!WARNING]
> Please change these credentials or configure the environment variables in `backend/.env` before deploying to staging/production.

---

## 🎨 Creative & Design Details

- **Responsive Staggered Timeline:** Professional timeline records fade/slide in sequentially from alternate sides (for desktop) and stack neatly on mobile viewports.
- **3D Hover-Tilt Project Cards:** Translates cursor coordinates relative to the card dimensions, animating the card with a smooth 3D perspective rotation on hover.
- **Tagline Typewriter Effect:** Cycles through developer specialties dynamically on the hero section.
- **Glassmorphism Theme Elements:** Ambient colored glowing backdrops and subtle blurs matching deep navy (`#1F3864`) and accent teal (`#0E7C7B`) palette targets.
