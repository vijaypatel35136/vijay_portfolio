from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional

# --- User & Token Schemas ---
class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Profile Schemas ---
class ProfileBase(BaseModel):
    name: str
    taglines: List[str]
    intro_text: str
    about_text: str
    location: str
    experience_years: str
    projects_delivered: int
    education_summary: str
    profile_photo_url: Optional[str] = None
    resume_pdf_url: Optional[str] = None
    email: str
    phone: str
    linkedin_url: str
    github_url: str

class ProfileUpdate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: int

    class Config:
        from_attributes = True

# --- Skill Schemas ---
class SkillBase(BaseModel):
    category: str
    name: str
    sort_order: int = 0

class SkillCreate(SkillBase):
    pass

class SkillUpdate(SkillBase):
    pass

class SkillResponse(SkillBase):
    id: int

    class Config:
        from_attributes = True

# --- Experience Schemas ---
class ExperienceBase(BaseModel):
    title: str
    company: str
    location: str
    start_date: str
    end_date: str
    bullets: List[str]
    sort_order: int = 0

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceUpdate(ExperienceBase):
    pass

class ExperienceResponse(ExperienceBase):
    id: int

    class Config:
        from_attributes = True

# --- Project Schemas ---
class ProjectBase(BaseModel):
    name: str
    url: Optional[str] = None
    description: str
    tech_stack: List[str]
    thumbnail_url: Optional[str] = None
    is_featured: bool = False
    category: str  # "shopify", "wordpress", "python"
    sort_order: int = 0

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int

    class Config:
        from_attributes = True

class ProjectBulkImport(BaseModel):
    projects: List[ProjectCreate]

# --- Education Schemas ---
class EducationBase(BaseModel):
    institution: str
    degree: str
    location: str
    date_range: str
    sort_order: int = 0

class EducationCreate(EducationBase):
    pass

class EducationUpdate(EducationBase):
    pass

class EducationResponse(EducationBase):
    id: int

    class Config:
        from_attributes = True

# --- Message Schemas ---
class MessageCreate(BaseModel):
    name: str
    email: str
    message: str

class MessageResponse(BaseModel):
    id: int
    name: str
    email: str
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Setting Schemas ---
class SettingBase(BaseModel):
    default_theme: str
    seo_title: str
    seo_description: str
    seo_og_image: Optional[str] = None
    analytics_key: Optional[str] = None

class SettingUpdate(SettingBase):
    pass

class SettingResponse(SettingBase):
    id: int

    class Config:
        from_attributes = True
