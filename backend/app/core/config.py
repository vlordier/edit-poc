from pydantic import ConfigDict
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    OPENAI_API_KEY: str
    MODEL_NAME: str = "gpt-4"
    MAX_TOKENS: int = 2000
    TEMPERATURE: float = 0.7
    NEXT_PUBLIC_API_URL: str

    model_config = ConfigDict(env_file=".env")


settings = Settings()
