(function initPortfolioValidar() {
    console.log('Script portfolioValidar inicializado com integração fetch (apiRequest).');

    const form = document.getElementById('form-validacao-crea');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const creaInput = document.getElementById('val-crea');
            const certInput = document.getElementById('val-certificado');
            const submitBtn = form.querySelector('button[type="submit"]');

            if (!creaInput.value) {
                alert("O número do CREA/CAU é obrigatório.");
                return;
            }

            if (!certInput.files || certInput.files.length === 0) {
                alert("É obrigatório anexar o certificado ou declaração.");
                return;
            }

            const formData = new FormData();
            formData.append('registro_conselho', creaInput.value);
            formData.append('documento_comprovatorio', certInput.files[0]);

            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
            submitBtn.disabled = true;

            try {
                // Passar headers: {} permite que o multipart/form-data do FormData sobrescreva o application/json padrão
                // OBS: O ID do profissional deve vir do auth context. Usando '1' como fallback temporário.
                const profId = localStorage.getItem('usuarioId') || '1';
                await apiRequest(`/profissionais/${profId}/validar`, {
                    method: 'POST',
                    headers: {},
                    body: formData
                });

                // Sucesso
                submitBtn.innerHTML = '<i class="bi bi-check-circle"></i> Solicitação Enviada!';
                submitBtn.style.color = '#00d278';
                submitBtn.style.borderColor = '#00d278';

                setTimeout(() => {
                    alert('Os seus documentos foram enviados para análise. Acompanhe o status no seu perfil.');
                    // Limpar formulário se necessário, ou redirecionar
                    form.reset();
                    submitBtn.innerHTML = originalBtnHtml;
                    submitBtn.style.color = '';
                    submitBtn.style.borderColor = '';
                    submitBtn.disabled = false;
                }, 2000);

            } catch (error) {
                console.error("Falha ao enviar solicitação de verificação:", error);
                alert(`Erro ao enviar documentos: ${error.message}`);
                
                submitBtn.innerHTML = originalBtnHtml;
                submitBtn.disabled = false;
            }
        });
    }
})();
