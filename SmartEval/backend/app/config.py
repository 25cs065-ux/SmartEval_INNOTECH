from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "SmartEval API"
    DATABASE_URL: str = "sqlite+aiosqlite:///./smarteval.db"
    GEMINI_API_KEY: str = ""

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
