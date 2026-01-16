# TriageAI

Solução full-stack para automação de triagem de emails corporativos. Utiliza NLP e LLMs para classificar mensagens e sugerir respostas, otimizando o fluxo operacional.

**Demo Online:** [https://triage-ai-pxyg.onrender.com](https://triage-ai-pxyg.onrender.com)

## Sobre o Projeto

Desenvolvido para o desafio técnico da AutoU, o sistema reduz o tempo de triagem manual categorizando emails em:
- **Produtivo:** Requer ação (ex: reembolso, suporte).
- **Improdutivo:** Informativo/Social (ex: agradecimentos).

## Arquitetura Técnica

Projeto estruturado em **Clean Architecture** e **Separation of Concerns**:

- **Backend (Flask):** Padrão *Application Factory* e *Service Layer* para isolar regras de negócio.
- **IA/NLP:** Pré-processamento com NLTK (limpeza de tokens) e inferência via Groq API (Llama-3-70b) para alta performance.
- **Frontend:** Server-Side Rendering com Jinja2, estilizado com TailwindCSS e interações via Vanilla JS.

## Stack

- **Core:** Python 3.12+, Flask
- **IA:** Llama 3 via Groq API
- **NLP/Utils:** NLTK, PyPDF2
- **Frontend:** HTML5, TailwindCSS, JavaScript

## Instalação e Execução Local

### 1. Clonar repositório
```bash
git clone [https://github.com/TacioMoreira25/triage-ai.git](https://github.com/TacioMoreira25/triage-ai.git)
cd triage-ai

```

### 2. Ambiente Virtual

```bash
# Linux/Mac
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate

```

### 3. Dependências

```bash
pip install -r requirements.txt

```

### 4. Configuração da API (Groq)

Para obter sua chave gratuita:

1. Acesse [console.groq.com/keys](https://console.groq.com/keys).
2. Faça login e clique em **"Create API Key"**.
3. Copie a chave gerada (começa com `gsk_`).

Crie um arquivo `.env` na raiz do projeto e cole a chave:

```env
GROQ_API_KEY=gsk_sua_chave_aqui_...
FLASK_ENV=development

```

### 5. Executar

```bash
python3 run.py

```

Acesse localmente em: `http://127.0.0.1:5000`

## Funcionalidades

1. **Processamento Híbrido:** Upload de arquivos (.pdf, .txt) e entrada de texto.
2. **Upload Simulado:** Botão de demonstração para testes rápidos sem arquivos locais.
3. **Prevenção de Conflitos:** Validação inteligente entre inputs de texto e arquivo.
4. **Dashboard Técnico:** Métricas em tempo real de latência e consumo de tokens.

## Estrutura

```text
/
├── app/
│   ├── routes/       # Blueprints (Rotas)
│   ├── services/     # Lógica de IA e Arquivos
│   ├── static/       # CSS, JS e Assets
│   ├── templates/    # HTML (Jinja2)
│   └── utils/        # NLP Cleaning
├── config.py         # Configurações
└── run.py            # Entry point

```
