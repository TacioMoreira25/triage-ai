import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'uma-chave-secreta-padrao')
    GROQ_API_KEY = os.getenv('GROQ_API_KEY')
    AI_BASE_URL = "https://api.groq.com/openai/v1"
    AI_MODEL = "llama-3.3-70b-versatile"
