from sqlalchemy.orm import Session
from app import models, schemas

# --- Profile CRUD ---
def get_profile(db: Session):
    return db.query(models.Profile).first()

def update_profile(db: Session, profile_update: schemas.ProfileUpdate):
    db_profile = db.query(models.Profile).first()
    if not db_profile:
        db_profile = models.Profile(**profile_update.model_dump())
        db.add(db_profile)
    else:
        for key, value in profile_update.model_dump().items():
            setattr(db_profile, key, value)
    db.commit()
    db.refresh(db_profile)
    return db_profile

# --- Skills CRUD ---
def get_skills(db: Session):
    return db.query(models.Skill).order_by(models.Skill.sort_order.asc(), models.Skill.id.asc()).all()

def create_skill(db: Session, skill: schemas.SkillCreate):
    db_skill = models.Skill(**skill.model_dump())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

def update_skill(db: Session, skill_id: int, skill: schemas.SkillUpdate):
    db_skill = db.query(models.Skill).filter(models.Skill.id == skill_id).first()
    if db_skill:
        for key, value in skill.model_dump().items():
            setattr(db_skill, key, value)
        db.commit()
        db.refresh(db_skill)
    return db_skill

def delete_skill(db: Session, skill_id: int):
    db_skill = db.query(models.Skill).filter(models.Skill.id == skill_id).first()
    if db_skill:
        db.delete(db_skill)
        db.commit()
        return True
    return False

# --- Experiences CRUD ---
def get_experiences(db: Session):
    return db.query(models.Experience).order_by(models.Experience.sort_order.asc(), models.Experience.id.desc()).all()

def create_experience(db: Session, exp: schemas.ExperienceCreate):
    db_exp = models.Experience(**exp.model_dump())
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return db_exp

def update_experience(db: Session, exp_id: int, exp: schemas.ExperienceUpdate):
    db_exp = db.query(models.Experience).filter(models.Experience.id == exp_id).first()
    if db_exp:
        for key, value in exp.model_dump().items():
            setattr(db_exp, key, value)
        db.commit()
        db.refresh(db_exp)
    return db_exp

def delete_experience(db: Session, exp_id: int):
    db_exp = db.query(models.Experience).filter(models.Experience.id == exp_id).first()
    if db_exp:
        db.delete(db_exp)
        db.commit()
        return True
    return False

# --- Projects CRUD ---
def get_projects(db: Session):
    return db.query(models.Project).order_by(models.Project.sort_order.asc(), models.Project.id.desc()).all()

def create_project(db: Session, proj: schemas.ProjectCreate):
    db_proj = models.Project(**proj.model_dump())
    db.add(db_proj)
    db.commit()
    db.refresh(db_proj)
    return db_proj

def update_project(db: Session, proj_id: int, proj: schemas.ProjectUpdate):
    db_proj = db.query(models.Project).filter(models.Project.id == proj_id).first()
    if db_proj:
        for key, value in proj.model_dump().items():
            setattr(db_proj, key, value)
        db.commit()
        db.refresh(db_proj)
    return db_proj

def delete_project(db: Session, proj_id: int):
    db_proj = db.query(models.Project).filter(models.Project.id == proj_id).first()
    if db_proj:
        db.delete(db_proj)
        db.commit()
        return True
    return False

# --- Education CRUD ---
def get_educations(db: Session):
    return db.query(models.Education).order_by(models.Education.sort_order.asc()).all()

def create_education(db: Session, edu: schemas.EducationCreate):
    db_edu = models.Education(**edu.model_dump())
    db.add(db_edu)
    db.commit()
    db.refresh(db_edu)
    return db_edu

def update_education(db: Session, edu_id: int, edu: schemas.EducationUpdate):
    db_edu = db.query(models.Education).filter(models.Education.id == edu_id).first()
    if db_edu:
        for key, value in edu.model_dump().items():
            setattr(db_edu, key, value)
        db.commit()
        db.refresh(db_edu)
    return db_edu

def delete_education(db: Session, edu_id: int):
    db_edu = db.query(models.Education).filter(models.Education.id == edu_id).first()
    if db_edu:
        db.delete(db_edu)
        db.commit()
        return True
    return False

# --- Messages CRUD ---
def get_messages(db: Session):
    return db.query(models.Message).order_by(models.Message.created_at.desc()).all()

def create_message(db: Session, msg: schemas.MessageCreate):
    db_msg = models.Message(**msg.model_dump())
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    return db_msg

def mark_message_read(db: Session, msg_id: int, is_read: bool = True):
    db_msg = db.query(models.Message).filter(models.Message.id == msg_id).first()
    if db_msg:
        db_msg.is_read = is_read
        db.commit()
        db.refresh(db_msg)
    return db_msg

def delete_message(db: Session, msg_id: int):
    db_msg = db.query(models.Message).filter(models.Message.id == msg_id).first()
    if db_msg:
        db.delete(db_msg)
        db.commit()
        return True
    return False

# --- Settings CRUD ---
def get_settings(db: Session):
    return db.query(models.Setting).first()

def update_settings(db: Session, settings_update: schemas.SettingUpdate):
    db_settings = db.query(models.Setting).first()
    if not db_settings:
        db_settings = models.Setting(**settings_update.model_dump())
        db.add(db_settings)
    else:
        for key, value in settings_update.model_dump().items():
            setattr(db_settings, key, value)
    db.commit()
    db.refresh(db_settings)
    return db_settings
