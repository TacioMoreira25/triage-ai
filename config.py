import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    # Configurações centrais e credenciais
    GROQ_API_KEY = os.getenv('GROQ_API_KEY')
    AI_BASE_URL = "https://api.groq.com/openai/v1"
    AI_MODEL = "llama-3.3-70b-versatile"

    if not GROQ_API_KEY:
        print("⚠️ AVISO: Chave da API não encontrada.")
