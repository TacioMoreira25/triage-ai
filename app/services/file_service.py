import PyPDF2

def extract_content(file, filename):
    try:
        if filename.endswith('.pdf'):
            text = ""
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            return text

        elif filename.endswith('.txt'):
            return file.read().decode('utf-8')

        return None # Formato não suportado
    except Exception as e:
        raise Exception(f"Erro ao ler arquivo: {str(e)}")
