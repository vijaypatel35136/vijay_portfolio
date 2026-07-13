from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Admin(Base):
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class Profile(Base):
    __tablename__ = "profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    bio = Column(Text, nullable=True)
    typewriter_roles = Column(JSON, nullable=True)  # List of strings
    resume_path = Column(String, nullable=True)
    profile_photo_path = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    github = Column(String, nullable=True)
    linkedin = Column(String, nullable=True)
    address = Column(String, nullable=True)

class SkillCategory(Base):
    __tablename__ = "skill_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    sort_order = Column(Integer, default=0)
    
    skills = relationship("Skill", back_populates="category", cascade="all, delete-orphan")

class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("skill_categories.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    sort_order = Column(Integer, default=0)
    
    category = relationship("SkillCategory", back_populates="skills")

class Experience(Base):
    __tablename__ = "experiences"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    location = Column(String, nullable=True)
    start_date = Column(String, nullable=False)
    end_date = Column(String, nullable=True)  # "Present" or date string
    points = Column(JSON, nullable=True)  # List of bullet points
    sort_order = Column(Integer, default=0)

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    url = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    tags = Column(JSON, nullable=True)  # List of tags e.g., ["Shopify", "React"]
    thumbnail_path = Column(String, nullable=True)
    is_featured = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)

class Education(Base):
    __tablename__ = "education"
    
    id = Column(Integer, primary_key=True, index=True)
    institution = Column(String, nullable=False)
    degree = Column(String, nullable=False)
    location = Column(String, nullable=True)
    date_range = Column(String, nullable=True)

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class SiteSettings(Base):
    __tablename__ = "site_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    dark_mode_default = Column(Boolean, default=True)
    seo_title = Column(String, nullable=True)
    seo_description = Column(Text, nullable=True)
    ga_key = Column(String, nullable=True)
