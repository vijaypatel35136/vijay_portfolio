import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./portfolio.db"
    JWT_SECRET: str = "super_secret_jwt_key_change_me_in_production_1234567890"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120
    ADMIN_EMAIL: str = "admin@portfolio.com"
    ADMIN_PASSWORD: str = "admin_secure_pass123"
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
