from flask import Flask
from flask_cors import CORS
from config import Config

def create_app():
    """Application Factory: Inicializa Flask, Configs e Rotas."""
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    from app.routes.main import main_bp
    app.register_blueprint(main_bp)

    return app
