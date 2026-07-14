from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="Vijay Bhesaniya")
    taglines = Column(JSON, nullable=False)  # List of strings, e.g. ["Shopify Liquid Developer", "Python Developer"]
    intro_text = Column(Text, nullable=False)
    about_text = Column(Text, nullable=False)
    location = Column(String, nullable=False)
    experience_years = Column(String, nullable=False)
    projects_delivered = Column(Integer, default=0)
    education_summary = Column(String, nullable=False)
    profile_photo_url = Column(String, nullable=True)
    resume_pdf_url = Column(String, nullable=True)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    linkedin_url = Column(String, nullable=False)
    github_url = Column(String, nullable=False)

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False)  # e.g., "Shopify & eCommerce"
    name = Column(String, nullable=False)
    sort_order = Column(Integer, default=0)

class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    location = Column(String, nullable=False)
    start_date = Column(String, nullable=False)
    end_date = Column(String, nullable=False)  # "Present" or date string
    bullets = Column(JSON, nullable=False)  # List of strings
    sort_order = Column(Integer, default=0)

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    url = Column(String, nullable=True)
    description = Column(Text, nullable=False)
    tech_stack = Column(JSON, nullable=False)  # List of strings
    thumbnail_url = Column(String, nullable=True)
    is_featured = Column(Boolean, default=False)
    category = Column(String, nullable=False)  # "shopify", "wordpress", "python"
    sort_order = Column(Integer, default=0)

class Education(Base):
    __tablename__ = "education"

    id = Column(Integer, primary_key=True, index=True)
    institution = Column(String, nullable=False)
    degree = Column(String, nullable=False)
    location = Column(String, nullable=False)
    date_range = Column(String, nullable=False)
    sort_order = Column(Integer, default=0)

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Setting(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    default_theme = Column(String, default="dark")
    seo_title = Column(String, nullable=False)
    seo_description = Column(Text, nullable=False)
    seo_og_image = Column(String, nullable=True)
    analytics_key = Column(String, nullable=True)
