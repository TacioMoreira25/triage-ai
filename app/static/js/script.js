/**
 * Função global para fechar o modal de alerta personalziado.
 * É chamada pelo botão "Entendi" no HTML.
 */
function closeModal() {
    const modal = document.getElementById('customAlert');
    if (modal) {
        modal.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {

    // Elementos do DOM
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const emailForm = document.getElementById('emailForm');
    const emailContent = document.getElementById('emailContent');

    // Botões de Demonstração
    const btnRandomExample = document.getElementById('btnRandomExample');
    const btnRandomFile = document.getElementById('btnRandomFile');

    // --- DADOS PARA DEMONSTRAÇÃO ---

    // 1. Exemplos de Texto Direto
    const textExamples = [
        "Assunto: URGENTE - Erro 500 na API de Pagamentos\n\nPrezados,\nDetectamos uma instabilidade crítica no endpoint de checkout (/api/v1/checkout). Os logs indicam timeout no banco de dados.\nPrecisamos de atuação imediata da equipe de SRE.\n\nAguardo retorno urgente.",
        "Assunto: Solicitação de Reembolso\n\nOlá equipe financeira,\nGostaria de solicitar o reembolso das despesas referentes à visita ao cliente TechSolutions no dia 12/01.\nO valor total é de R$ 145,90.\n\nAtenciosamente,\nAna Silva",
        "Assunto: Boas Festas!\n\nOi pessoal!\nPassando apenas para desejar um Feliz Natal e um próspero Ano Novo para todos da equipe AutoU!\nAproveitem o descanso.\n\nUm abraço,\nCarlos."
    ];

    // 2. Arquivos Demo (PDF e TXT)
    // Devem existir fisicamente na pasta app/static/samples/
    const demoFiles = [
        "1_produtivo_infra_critica.pdf",
        "1_produtivo_infra_critica.txt",
        "2_produtivo_reembolso.pdf",
        "2_produtivo_reembolso.txt",
        "3_produtivo_senha_bloqueada.pdf",
        "3_produtivo_senha_bloqueada.txt",
        "4_improdutivo_natal.pdf",
        "4_improdutivo_natal.txt",
        "5_improdutivo_agradecimento.pdf",
        "5_improdutivo_agradecimento.txt"
    ];

    // --- FUNCIONALIDADE 1: TEXTO ALEATÓRIO ---
    if (btnRandomExample) {
        btnRandomExample.addEventListener('click', () => {
            // Efeito visual rápido
            emailContent.style.opacity = '0.5';

            // Sorteia e preenche
            const randomText = textExamples[Math.floor(Math.random() * textExamples.length)];
            emailContent.value = randomText;

            // Limpa o input de arquivo (se houver) para evitar conflito
            if (fileInput) {
                fileInput.value = '';
                fileNameDisplay.textContent = 'PDF ou TXT';
                fileNameDisplay.classList.remove('text-blue-600', 'font-bold');
            }

            setTimeout(() => {
                emailContent.style.opacity = '1';
                emailContent.focus();
            }, 200);
        });
    }

    // --- FUNCIONALIDADE 2: UPLOAD SIMULADO (PDF/TXT) ---
    if (btnRandomFile) {
        btnRandomFile.addEventListener('click', async () => {
            // Sorteia um arquivo da lista
            const randomFileName = demoFiles[Math.floor(Math.random() * demoFiles.length)];

            fileNameDisplay.textContent = `Baixando ${randomFileName}...`;

            try {
                // Busca o arquivo na pasta static/samples
                const response = await fetch(`/static/samples/${randomFileName}`);
                if (!response.ok) throw new Error("Arquivo demo não encontrado no servidor.");

                const blob = await response.blob();

                // Define o tipo MIME correto (Importante para o backend aceitar)
                const mimeType = randomFileName.endsWith('.txt') ? "text/plain" : "application/pdf";

                // Cria o arquivo virtual
                const file = new File([blob], randomFileName, { type: mimeType });

                // Injeta o arquivo no input HTML usando DataTransfer
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;

                // Dispara o evento 'change' visualmente
                const event = new Event('change');
                fileInput.dispatchEvent(event);

                // Limpa o campo de texto para evitar conflito
                emailContent.value = "";

            } catch (error) {
                console.error(error);
                fileNameDisplay.textContent = "Erro ao carregar exemplo";
                alert("Erro: Certifique-se de que os arquivos PDF/TXT estão na pasta app/static/samples/");
            }
        });
    }

    // --- UX: MOSTRAR NOME DO ARQUIVO SELECIONADO ---
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                fileNameDisplay.textContent = this.files[0].name;
                fileNameDisplay.classList.add('text-blue-600', 'font-bold');
            } else {
                fileNameDisplay.textContent = 'PDF ou TXT';
                fileNameDisplay.classList.remove('text-blue-600', 'font-bold');
            }
        });
    }

    // --- ENVIO DO FORMULÁRIO (SUBMIT) ---
    if (emailForm) {
        emailForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const text = emailContent.value.trim();
            const file = fileInput.files[0];

            // 1. CHECAGEM DE CONFLITO (Texto + Arquivo)
            if (text && file) {
                // Abre o Modal Personalizado (Substituindo o alert antigo)
                const modal = document.getElementById('customAlert');
                if(modal) modal.classList.remove('hidden');
                return; // Para a execução
            }

            // 2. CHECAGEM DE VAZIO
            if(!text && !file) {
                return alert("Por favor, clique nos botões de exemplo ou digite/envie algo!");
            }

            // Prepara UI para Loading
            const loading = document.getElementById('loading');
            const resultArea = document.getElementById('resultArea');

            loading.classList.remove('hidden');
            resultArea.classList.add('hidden');

            // Monta o FormData
            const formData = new FormData();
            if (file) {
                formData.append('file', file);
            } else {
                formData.append('text', text);
            }

            try {
                // Requisição ao Backend
                const response = await fetch('/analyze', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    // A. Atualiza Estatísticas (Dashboard)
                    document.getElementById('statTime').textContent = data.stats.time;
                    document.getElementById('statTokens').textContent = data.stats.tokens;

                    // B. Atualiza Badge de Categoria (Cores)
                    const badge = document.getElementById('categoryBadge');

                    if (data.category === "Produtivo") {
                        badge.className = "px-4 py-1 rounded-full text-sm font-bold shadow-sm bg-green-100 text-green-700 border border-green-200";
                    } else {
                        badge.className = "px-4 py-1 rounded-full text-sm font-bold shadow-sm bg-gray-100 text-gray-600 border border-gray-200";
                    }
                    badge.textContent = data.category;

                    // C. Exibe a Resposta da IA
                    document.getElementById('replyText').textContent = data.reply;

                    // Mostra a área de resultados
                    resultArea.classList.remove('hidden');
                } else {
                    // Erro retornado pela API
                    alert("Erro no processamento: " + (data.error || "Erro desconhecido"));
                }

            } catch (error) {
                console.error(error);
                alert("Erro de conexão com o servidor. Verifique se o backend está rodando.");
            } finally {
                // Esconde o loading independente do resultado
                loading.classList.add('hidden');
            }
        });
    }
});
