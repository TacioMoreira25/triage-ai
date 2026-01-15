import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Download silencioso de recursos NLTK
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('punkt_tab')

def clean_text(text):
    """Remove stopwords e tokeniza para otimizar contexto da IA."""
    if not text:
        return ""

    tokens = word_tokenize(text.lower(), language='portuguese')
    stop_words = set(stopwords.words('portuguese'))

    return " ".join([word for word in tokens if word.isalnum() and word not in stop_words])
