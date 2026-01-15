import time
import json
from openai import OpenAI
from config import Config
from app.utils.text_cleaner import clean_text

client = OpenAI(
    base_url=Config.AI_BASE_URL,
    api_key=Config.GROQ_API_KEY
)

def classify_and_reply(original_text):
    start_time = time.time() # Inicia cronômetro

    processed_text = clean_text(original_text)

    system_prompt = """
    Você é um classificador de emails.
    Retorne JSON estrito: {"category": "Produtivo" ou "Improdutivo", "reply": "sugestão..."}
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

        content = response.choices[0].message.content
        clean_content = content.replace("```json", "").replace("```", "").strip()

        # Para cronômetro
        end_time = time.time()
        duration = round(end_time - start_time, 2)

        result_json = json.loads(clean_content)

        # Apenas dados reais agora
        result_json['stats'] = {
            'time': f"{duration}s",
            'tokens': response.usage.total_tokens
        }

        return json.dumps(result_json)

    except Exception as e:
        return f'{{"error": "Falha na IA: {str(e)}"}}'
