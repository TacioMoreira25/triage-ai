from flask import Blueprint, render_template, request, jsonify
from app.services.ai_service import classify_and_reply
from app.services.file_service import extract_content
import json

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def home():
    return render_template('index.html')

@main_bp.route('/analyze', methods=['POST'])
def analyze():
    """Endpoint principal: Gerencia entrada (Arquivo ou Texto) e chama IA."""
    email_content = ""

    try:
        # Prioridade 1: Upload de Arquivo
        if 'file' in request.files:
            file = request.files['file']
            if file.filename != '':
                email_content = extract_content(file, file.filename)

        # Prioridade 2: Texto via Formulário
        elif request.form.get('text'):
            email_content = request.form.get('text')

        # Prioridade 3: JSON
        elif request.is_json:
            data = request.get_json()
            email_content = data.get('text', '')

        if not email_content:
            return jsonify({"error": "Conteúdo inválido ou vazio."}), 400

        # Processamento
        ai_response_str = classify_and_reply(email_content)
        return jsonify(json.loads(ai_response_str))

    except Exception as e:
        return jsonify({"error": str(e)}), 500
