import time
import json
import logging
from openai import OpenAI
from config import Config
from app.utils.text_cleaner import clean_text

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.ERROR)

client = OpenAI(
    base_url=Config.AI_BASE_URL,
    api_key=Config.GROQ_API_KEY
)

def classify_and_reply(original_text):
    """Envia texto para LLM (Groq) e retorna JSON estruturado com métricas."""
    start_time = time.time()

    # NLP Cleaning
    processed_text = clean_text(original_text)

    system_prompt = """
    Atue como classificador de emails (TriageAI).
    Retorne APENAS JSON: {"category": "Produtivo"|"Improdutivo", "reply": "sugestão..."}
    """

    try:
        response = client.chat.completions.create(
            model=Config.AI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Texto: {original_text}\nContexto: {processed_text}"}
            ],
            temperature=0.1
        )

        # Limpeza da resposta (remove markdown se houver)
        content = response.choices[0].message.content
        clean_content = content.replace("```json", "").replace("```", "").strip()

        # Métricas de performance
        duration = round(time.time() - start_time, 2)

        result_json = json.loads(clean_content)
        result_json['stats'] = {
            'time': f"{duration}s",
            'tokens': response.usage.total_tokens
        }

        return json.dumps(result_json)

    except Exception as e:
        logger.error(f"Groq API Error: {str(e)}", exc_info=True)
        
        error_str = str(e)
        if "429" in error_str:
            reply_msg = "Limite de requisições atingido. A Groq (Free Tier) permite 30 requisições por minuto. Aguarde um instante e tente novamente."
        else:
            reply_msg = "Ocorreu um erro ao comunicar com a IA. Os detalhes técnicos foram gravados no log do servidor."
            
        return json.dumps({
            "category": "Erro Interno",
            "reply": reply_msg,
            "stats": {"time": "0s", "tokens": 0}
        })
