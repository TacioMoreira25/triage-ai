from app import create_app

app = create_app()

if __name__ == '__main__':
    # Rodar em debug apenas localmente
    app.run(debug=True, port=5000)
