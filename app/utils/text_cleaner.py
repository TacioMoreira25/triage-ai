import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Configuração silenciosa do NLTK
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('punkt_tab')

def clean_text(text):
    if not text:
        return ""

    # Tokenização e remoção de stopwords
    tokens = word_tokenize(text.lower(), language='portuguese')
    stop_words = set(stopwords.words('portuguese'))

    # Reconstrói o texto apenas com palavras relevantes
    filtered_tokens = [word for word in tokens if word.isalnum() and word not in stop_words]
    return " ".join(filtered_tokens)
