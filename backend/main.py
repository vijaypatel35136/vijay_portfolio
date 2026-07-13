import os
import shutil
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

import models
import schemas
import auth
from database import engine, get_db

# Create uploads directory if it doesn't exist
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Vijay Bhesaniya Portfolio API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded static files
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# --- AUTHENTICATION ---
@app.post("/api/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.Admin).filter(models.Admin.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# --- PROFILE MODULE ---
@app.get("/api/profile", response_model=schemas.ProfileResponse)
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(models.Profile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@app.put("/api/profile", response_model=schemas.ProfileResponse)
def update_profile(
    profile_data: schemas.ProfileCreate,
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    profile = db.query(models.Profile).first()
    if not profile:
        profile = models.Profile(**profile_data.dict())
        db.add(profile)
    else:
        for key, value in profile_data.dict().items():
            setattr(profile, key, value)
    db.commit()
    db.refresh(profile)
    return profile

# File uploads for profile
@app.post("/api/profile/upload-photo")
def upload_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    profile = db.query(models.Profile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile must exist to upload photo")
    
    file_ext = os.path.splitext(file.filename)[1]
    filename = f"avatar{file_ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    profile.profile_photo_path = f"/uploads/{filename}"
    db.commit()
    return {"path": profile.profile_photo_path}

@app.post("/api/profile/upload-resume")
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    profile = db.query(models.Profile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile must exist to upload resume")
    
    filename = "resume.pdf"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    profile.resume_path = f"/uploads/{filename}"
    db.commit()
    return {"path": profile.resume_path}

# --- SKILLS MODULE ---
@app.get("/api/skills", response_model=List[schemas.SkillCategoryResponse])
def get_skills(db: Session = Depends(get_db)):
    return db.query(models.SkillCategory).order_by(models.SkillCategory.sort_order).all()

@app.post("/api/skills/categories", response_model=schemas.SkillCategoryResponse)
def create_skill_category(
    cat: schemas.SkillCategoryCreate,
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    db_cat = models.SkillCategory(**cat.dict())
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat

@app.put("/api/skills/categories/{cat_id}", response_model=schemas.SkillCategoryResponse)
def update_skill_category(
    cat_id: int,
    cat: schemas.SkillCategoryCreate,
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    db_cat = db.query(models.SkillCategory).filter(models.SkillCategory.id == cat_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    for key, value in cat.dict().items():
        setattr(db_cat, key, value)
    db.commit()
    db.refresh(db_cat)
    return db_cat

@app.delete("/api/skills/categories/{cat_id}")
def delete_skill_category(
    cat_id: int,
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    db_cat = db.query(models.SkillCategory).filter(models.SkillCategory.id == cat_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(db_cat)
    db.commit()
    return {"detail": "Category deleted"}

@app.post("/api/skills", response_model=schemas.SkillResponse)
def create_skill(
    skill: schemas.SkillCreate,
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    db_skill = models.Skill(**skill.dict())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@app.put("/api/skills/{skill_id}", response_model=schemas.SkillResponse)
def update_skill(
    skill_id: int,
    skill: schemas.SkillCreate,
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    db_skill = db.query(models.Skill).filter(models.Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    for key, value in skill.dict().items():
        setattr(db_skill, key, value)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@app.delete("/api/skills/{skill_id}")
def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    db_skill = db.query(models.Skill).filter(models.Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(db_skill)
    db.commit()
    return {"detail": "Skill deleted"}

# --- EXPERIENCE MODULE ---
@app.get("/api/experience", response_model=List[schemas.ExperienceResponse])
def get_experience(db: Session = Depends(get_db)):
    return db.query(models.Experience).order_by(models.Experience.sort_order).all()

@app.post("/api/experience", response_model=schemas.ExperienceResponse)
def create_experience(
    exp: schemas.ExperienceCreate,
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    db_exp = models.Experience(**exp.dict())
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return db_exp

@app.put("/api/experience/{exp_id}", response_model=schemas.ExperienceResponse)
def update_experience(
    exp_id: int,
    exp: schemas.ExperienceCreate,
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    db_exp = db.query(models.Experience).filter(models.Experience.id == exp_id).first()
    if not db_exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    for key, value in exp.dict().items():
        setattr(db_exp, key, value)
    db.commit()
    db.refresh(db_exp)
    return db_exp

@app.delete("/api/experience/{exp_id}")
def delete_experience(
    exp_id: int,
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    db_exp = db.query(models.Experience).filter(models.Experience.id == exp_id).first()
    if not db_exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    db.delete(db_exp)
    db.commit()
    return {"detail": "Experience deleted"}

# --- PROJECTS MODULE ---
@app.get("/api/projects", response_model=List[schemas.ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).order_by(models.Project.sort_order).all()

@app.post("/api/projects", response_model=schemas.ProjectResponse)
def create_project(
    project: schemas.ProjectCreate,
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    db_project = models.Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.put("/api/projects/{proj_id}", response_model=schemas.ProjectResponse)
def update_project(
    proj_id: int,
    project: schemas.ProjectCreate,
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    db_project = db.query(models.Project).filter(models.Project.id == proj_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in project.dict().items():
        setattr(db_project, key, value)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.delete("/api/projects/{proj_id}")
def delete_project(
    proj_id: int,
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    db_project = db.query(models.Project).filter(models.Project.id == proj_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(db_project)
    db.commit()
    return {"detail": "Project deleted"}

@app.post("/api/projects/{proj_id}/upload-thumbnail")
def upload_project_thumbnail(
    proj_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    db_project = db.query(models.Project).filter(models.Project.id == proj_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    file_ext = os.path.splitext(file.filename)[1]
    filename = f"project_{proj_id}{file_ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    db_project.thumbnail_path = f"/uploads/{filename}"
    db.commit()
    return {"path": db_project.thumbnail_path}

# --- EDUCATION MODULE ---
@app.get("/api/education", response_model=List[schemas.EducationResponse])
def get_education(db: Session = Depends(get_db)):
    return db.query(models.Education).all()

@app.post("/api/education", response_model=schemas.EducationResponse)
def create_education(
    edu: schemas.EducationCreate,
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    db_edu = models.Education(**edu.dict())
    db.add(db_edu)
    db.commit()
    db.refresh(db_edu)
    return db_edu

@app.put("/api/education/{edu_id}", response_model=schemas.EducationResponse)
def update_education(
    edu_id: int,
    edu: schemas.EducationCreate,
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    db_edu = db.query(models.Education).filter(models.Education.id == edu_id).first()
    if not db_edu:
        raise HTTPException(status_code=404, detail="Education entry not found")
    for key, value in edu.dict().items():
        setattr(db_edu, key, value)
    db.commit()
    db.refresh(db_edu)
    return db_edu

@app.delete("/api/education/{edu_id}")
def delete_education(
    edu_id: int,
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    db_edu = db.query(models.Education).filter(models.Education.id == edu_id).first()
    if not db_edu:
        raise HTTPException(status_code=404, detail="Education entry not found")
    db.delete(db_edu)
    db.commit()
    return {"detail": "Education entry deleted"}

# --- CONTACT FORM / MESSAGES ---
@app.post("/api/contact", response_model=schemas.MessageResponse)
def create_message(msg: schemas.MessageCreate, db: Session = Depends(get_db)):
    db_msg = models.Message(**msg.dict())
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    return db_msg

@app.get("/api/messages", response_model=List[schemas.MessageResponse])
def get_messages(
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    return db.query(models.Message).order_by(models.Message.created_at.desc()).all()

@app.put("/api/messages/{msg_id}/read", response_model=schemas.MessageResponse)
def mark_message_read(
    msg_id: int,
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    db_msg = db.query(models.Message).filter(models.Message.id == msg_id).first()
    if not db_msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db_msg.is_read = True
    db.commit()
    db.refresh(db_msg)
    return db_msg

@app.delete("/api/messages/{msg_id}")
def delete_message(
    msg_id: int,
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    db_msg = db.query(models.Message).filter(models.Message.id == msg_id).first()
    if not db_msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(db_msg)
    db.commit()
    return {"detail": "Message deleted"}

# --- SITE SETTINGS ---
@app.get("/api/settings", response_model=schemas.SiteSettingsResponse)
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(models.SiteSettings).first()
    if not settings:
        settings = models.SiteSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@app.put("/api/settings", response_model=schemas.SiteSettingsResponse)
def update_settings(
    settings_data: schemas.SiteSettingsCreate,
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    settings = db.query(models.SiteSettings).first()
    if not settings:
        settings = models.SiteSettings(**settings_data.dict())
        db.add(settings)
    else:
        for key, value in settings_data.dict().items():
            setattr(settings, key, value)
    db.commit()
    db.refresh(settings)
    return settings

# --- DASHBOARD SUMMARY ---
@app.get("/api/dashboard-summary")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: models.Admin = Depends(auth.get_current_user)
):
    total_projects = db.query(models.Project).count()
    total_messages = db.query(models.Message).count()
    unread_messages = db.query(models.Message).filter(models.Message.is_read == False).count()
    total_exp = db.query(models.Experience).count()
    
    return {
        "total_projects": total_projects,
        "total_messages": total_messages,
        "unread_messages": unread_messages,
        "total_experience": total_exp,
        "site_views": 1047  # Mock analytics placeholder
    }
