from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    OPENAI_API_KEY: str
    MODEL_NAME: str = "gpt-4"
    MAX_TOKENS: int = 2000
    TEMPERATURE: float = 0.7

    class Config:
        env_file = ".env"


settings = Settings()
