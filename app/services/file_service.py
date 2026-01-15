import PyPDF2

def extract_content(file, filename):
    """Extrai texto de PDF ou TXT."""
    try:
        if filename.endswith('.pdf'):
            text = ""
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += (page.extract_text() or "") + "\n"
            return text

        elif filename.endswith('.txt'):
            return file.read().decode('utf-8')

        return None
    except Exception as e:
        raise Exception(f"Erro na leitura do arquivo: {str(e)}")
