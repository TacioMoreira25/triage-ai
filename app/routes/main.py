from flask import Blueprint, render_template, request, jsonify
from app.services.ai_service import classify_and_reply
from app.services.file_service import extract_content
import json

# Define o Blueprint
main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def home():
    return render_template('index.html')

@main_bp.route('/analyze', methods=['POST'])
def analyze():
    email_content = ""

    # Lógica de decisão de entrada (Arquivo ou Texto)
    try:
        if 'file' in request.files:
            file = request.files['file']
            if file.filename != '':
                email_content = extract_content(file, file.filename)

        elif request.form.get('text'):
            email_content = request.form.get('text')

        elif request.is_json:
            data = request.get_json()
            email_content = data.get('text', '')

        if not email_content:
            return jsonify({"error": "Conteúdo vazio ou formato inválido"}), 400

        # Chama o serviço de IA
        ai_response_str = classify_and_reply(email_content)

        # Parse final
        return jsonify(json.loads(ai_response_str))

    except Exception as e:
        return jsonify({"error": str(e)}), 500
