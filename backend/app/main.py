import os
import shutil
import uuid
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from app.config import settings
from app.database import engine, Base, get_db
from app import models, schemas, auth, crud

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Vijay Bhesaniya Portfolio API")

# Configure CORS
origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads folder exists and mount it
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# --- Authentication Route ---
@app.post("/api/auth/login", response_model=schemas.Token)
def login(login_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_data.email).first()
    if not user or not auth.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


# --- Profile Routes ---
@app.get("/api/profile", response_model=schemas.ProfileResponse)
def get_profile(db: Session = Depends(get_db)):
    profile = crud.get_profile(db)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@app.put("/api/profile", response_model=schemas.ProfileResponse)
def update_profile(
    profile_update: schemas.ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.update_profile(db, profile_update)


# --- Skills Routes ---
@app.get("/api/skills", response_model=List[schemas.SkillResponse])
def get_skills(db: Session = Depends(get_db)):
    return crud.get_skills(db)

@app.post("/api/skills", response_model=schemas.SkillResponse)
def create_skill(
    skill: schemas.SkillCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.create_skill(db, skill)

@app.put("/api/skills/{id}", response_model=schemas.SkillResponse)
def update_skill(
    id: int,
    skill: schemas.SkillUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_skill = crud.update_skill(db, id, skill)
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return db_skill

@app.delete("/api/skills/{id}")
def delete_skill(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    success = crud.delete_skill(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Skill not found")
    return {"detail": "Skill deleted successfully"}


# --- Experience Routes ---
@app.get("/api/experience", response_model=List[schemas.ExperienceResponse])
def get_experience(db: Session = Depends(get_db)):
    return crud.get_experiences(db)

@app.post("/api/experience", response_model=schemas.ExperienceResponse)
def create_experience(
    exp: schemas.ExperienceCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.create_experience(db, exp)

@app.put("/api/experience/{id}", response_model=schemas.ExperienceResponse)
def update_experience(
    id: int,
    exp: schemas.ExperienceUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_exp = crud.update_experience(db, id, exp)
    if not db_exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    return db_exp

@app.delete("/api/experience/{id}")
def delete_experience(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    success = crud.delete_experience(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Experience not found")
    return {"detail": "Experience deleted successfully"}


# --- Projects Routes ---
@app.get("/api/projects", response_model=List[schemas.ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    return crud.get_projects(db)

@app.post("/api/projects", response_model=schemas.ProjectResponse)
def create_project(
    proj: schemas.ProjectCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.create_project(db, proj)

@app.put("/api/projects/{id}", response_model=schemas.ProjectResponse)
def update_project(
    id: int,
    proj: schemas.ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_proj = crud.update_project(db, id, proj)
    if not db_proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_proj

@app.delete("/api/projects/{id}")
def delete_project(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    success = crud.delete_project(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"detail": "Project deleted successfully"}

@app.post("/api/projects/bulk-import", response_model=List[schemas.ProjectResponse])
def bulk_import_projects(
    import_data: schemas.ProjectBulkImport,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    results = []
    try:
        for proj in import_data.projects:
            results.append(crud.create_project(db, proj))
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to import projects: {str(e)}")


# --- Education Routes ---
@app.get("/api/education", response_model=List[schemas.EducationResponse])
def get_education(db: Session = Depends(get_db)):
    return crud.get_educations(db)

@app.post("/api/education", response_model=schemas.EducationResponse)
def create_education(
    edu: schemas.EducationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.create_education(db, edu)

@app.put("/api/education/{id}", response_model=schemas.EducationResponse)
def update_education(
    id: int,
    edu: schemas.EducationUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_edu = crud.update_education(db, id, edu)
    if not db_edu:
        raise HTTPException(status_code=404, detail="Education not found")
    return db_edu

@app.delete("/api/education/{id}")
def delete_education(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    success = crud.delete_education(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Education not found")
    return {"detail": "Education deleted successfully"}


# --- Contact Messages Routes ---
@app.post("/api/contact", response_model=schemas.MessageResponse)
def create_contact_message(msg: schemas.MessageCreate, db: Session = Depends(get_db)):
    return crud.create_message(db, msg)

@app.get("/api/messages", response_model=List[schemas.MessageResponse])
def get_messages(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.get_messages(db)

@app.put("/api/messages/{id}/read", response_model=schemas.MessageResponse)
def mark_message_read(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_msg = crud.mark_message_read(db, id, is_read=True)
    if not db_msg:
        raise HTTPException(status_code=404, detail="Message not found")
    return db_msg

@app.delete("/api/messages/{id}")
def delete_message(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    success = crud.delete_message(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"detail": "Message deleted successfully"}


# --- Settings Routes ---
@app.get("/api/settings", response_model=schemas.SettingResponse)
def get_settings(db: Session = Depends(get_db)):
    settings_obj = crud.get_settings(db)
    if not settings_obj:
        raise HTTPException(status_code=404, detail="Settings not found")
    return settings_obj

@app.put("/api/settings", response_model=schemas.SettingResponse)
def update_settings(
    settings_update: schemas.SettingUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.update_settings(db, settings_update)


# --- File Upload Route ---
@app.post("/api/upload")
def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    try:
        # Save file to uploads folder with unique UUID name
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4().hex}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Return local path to access it
        return {"url": f"/uploads/{unique_filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")
