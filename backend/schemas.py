from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# Auth Schemas
class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Profile Schemas
class ProfileBase(BaseModel):
    name: str
    bio: Optional[str] = None
    typewriter_roles: Optional[List[str]] = None
    resume_path: Optional[str] = None
    profile_photo_path: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    address: Optional[str] = None

class ProfileCreate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: int
    class Config:
        from_attributes = True

# Skill Schemas
class SkillBase(BaseModel):
    name: str
    sort_order: int = 0

class SkillCreate(SkillBase):
    category_id: int

class SkillResponse(SkillBase):
    id: int
    category_id: int
    class Config:
        from_attributes = True

class SkillCategoryBase(BaseModel):
    name: str
    sort_order: int = 0

class SkillCategoryCreate(SkillCategoryBase):
    pass

class SkillCategoryResponse(SkillCategoryBase):
    id: int
    skills: List[SkillResponse] = []
    class Config:
        from_attributes = True

# Experience Schemas
class ExperienceBase(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    points: Optional[List[str]] = None
    sort_order: int = 0

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceResponse(ExperienceBase):
    id: int
    class Config:
        from_attributes = True

# Project Schemas
class ProjectBase(BaseModel):
    title: str
    url: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    thumbnail_path: Optional[str] = None
    is_featured: bool = False
    sort_order: int = 0

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    class Config:
        from_attributes = True

# Education Schemas
class EducationBase(BaseModel):
    institution: str
    degree: str
    location: Optional[str] = None
    date_range: Optional[str] = None

class EducationCreate(EducationBase):
    pass

class EducationResponse(EducationBase):
    id: int
    class Config:
        from_attributes = True

# Message Schemas
class MessageBase(BaseModel):
    name: str
    email: EmailStr
    message: str

class MessageCreate(MessageBase):
    pass

class MessageResponse(MessageBase):
    id: int
    is_read: bool
    created_at: datetime
    class Config:
        from_attributes = True

# SiteSettings Schemas
class SiteSettingsBase(BaseModel):
    dark_mode_default: bool = True
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    ga_key: Optional[str] = None

class SiteSettingsCreate(SiteSettingsBase):
    pass

class SiteSettingsResponse(SiteSettingsBase):
    id: int
    class Config:
        from_attributes = True
