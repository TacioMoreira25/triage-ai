// Controle do Modal
function closeModal() {
    const modal = document.getElementById('customAlert');
    if (modal) modal.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {

    // Elementos UI
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const emailForm = document.getElementById('emailForm');
    const emailContent = document.getElementById('emailContent');
    const btnRandomExample = document.getElementById('btnRandomExample');
    const btnRandomFile = document.getElementById('btnRandomFile');

    // Mocks de Dados
    const textExamples = [
        "Assunto: URGENTE - Erro 500 na API de Pagamentos\n\nPrezados,\nDetectamos instabilidade crítica. Logs indicam timeout.\nSolicito atuação de SRE.",
        "Assunto: Reembolso\n\nOlá,\nSolicito reembolso do Uber (R$ 45,00).",
        "Assunto: Boas Festas!\n\nOi equipe,\nFeliz Natal a todos!"
    ];

    const demoFiles = [
        "1_produtivo_infra_critica.pdf", "1_produtivo_infra_critica.txt",
        "2_produtivo_reembolso.pdf", "2_produtivo_reembolso.txt",
        "4_improdutivo_natal.pdf"
    ];

    // Funcionalidade: Texto Aleatório
    if (btnRandomExample) {
        btnRandomExample.addEventListener('click', () => {
            emailContent.style.opacity = '0.5';
            emailContent.value = textExamples[Math.floor(Math.random() * textExamples.length)];

            if (fileInput) resetFileInput(); // Limpa arquivo para evitar conflito

            setTimeout(() => {
                emailContent.style.opacity = '1';
                emailContent.focus();
            }, 200);
        });
    }

    // Funcionalidade: Upload Simulado
    if (btnRandomFile) {
        btnRandomFile.addEventListener('click', async () => {
            const randomFileName = demoFiles[Math.floor(Math.random() * demoFiles.length)];
            fileNameDisplay.textContent = `Baixando ${randomFileName}...`;

            try {
                const response = await fetch(`/static/samples/${randomFileName}`);
                if (!response.ok) throw new Error("Arquivo não encontrado.");

                const blob = await response.blob();
                const mimeType = randomFileName.endsWith('.txt') ? "text/plain" : "application/pdf";

                // Injeta arquivo no input programaticamente
                const file = new File([blob], randomFileName, { type: mimeType });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;

                fileInput.dispatchEvent(new Event('change'));
                emailContent.value = ""; // Limpa texto para evitar conflito

            } catch (error) {
                console.error(error);
                fileNameDisplay.textContent = "Erro ao carregar demo";
            }
        });
    }

    // UX: Display nome do arquivo
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                fileNameDisplay.textContent = this.files[0].name;
                fileNameDisplay.classList.add('text-blue-600', 'font-bold');
            } else {
                resetFileInput();
            }
        });
    }

    // Submit do Formulário
    if (emailForm) {
        emailForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const text = emailContent.value.trim();
            const file = fileInput.files[0];

            // Validação de Conflito (Texto + Arquivo)
            if (text && file) {
                const modal = document.getElementById('customAlert');
                if(modal) modal.classList.remove('hidden');
                return;
            }

            if(!text && !file) return alert("Por favor, insira um conteúdo.");

            // UI Loading
            const loading = document.getElementById('loading');
            const resultArea = document.getElementById('resultArea');
            loading.classList.remove('hidden');
            resultArea.classList.add('hidden');

            const formData = new FormData();
            if (file) formData.append('file', file);
            else formData.append('text', text);

            try {
                const response = await fetch('/analyze', { method: 'POST', body: formData });
                const data = await response.json();

                if (response.ok) {
                    updateDashboard(data);
                } else {
                    alert("Erro API: " + (data.error || "Desconhecido"));
                }
            } catch (error) {
                console.error(error);
                alert("Erro de conexão.");
            } finally {
                loading.classList.add('hidden');
            }
        });
    }

    function updateDashboard(data) {
        document.getElementById('statTime').textContent = data.stats.time;
        document.getElementById('statTokens').textContent = data.stats.tokens;

        const badge = document.getElementById('categoryBadge');
        const isProductive = data.category === "Produtivo";

        badge.className = isProductive
            ? "px-4 py-1.5 rounded-full text-sm font-bold shadow-sm bg-green-100 text-green-700 ring-1 ring-green-600/20"
            : "px-4 py-1.5 rounded-full text-sm font-bold shadow-sm bg-slate-100 text-slate-600 ring-1 ring-slate-600/20";

        badge.textContent = data.category;
        document.getElementById('replyText').textContent = data.reply;
        document.getElementById('resultArea').classList.remove('hidden');
    }

    function resetFileInput() {
        if(fileInput) fileInput.value = '';
        if(fileNameDisplay) {
            fileNameDisplay.textContent = '.PDF ou .TXT';
            fileNameDisplay.classList.remove('text-blue-600', 'font-bold');
        }
    }
});
