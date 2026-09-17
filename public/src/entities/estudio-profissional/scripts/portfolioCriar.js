(function initPortfolioCriar() {
    console.log('Script portfolioCriar inicializado com integração fetch (apiRequest).');

    const btnSalvar = document.getElementById('btn-salvar-portfolio');

    if (btnSalvar) {
        btnSalvar.addEventListener('click', async () => {
            if (btnSalvar.disabled) return;

            const titulo = document.getElementById('port-titulo')?.value;
            const descricao = document.getElementById('port-descricao')?.value;
            const ano = document.getElementById('port-ano')?.value;
            const categoria = document.getElementById('port-categoria')?.value;
            const galeriaInput = document.getElementById('port-galeria');

            if (!titulo || !descricao || !ano || !categoria) {
                alert("Por favor, preencha todos os campos obrigatórios.");
                return;
            }

            const formData = new FormData();
            formData.append('titulo', titulo);
            formData.append('descricao', descricao);
            formData.append('ano', ano);
            formData.append('categoria', categoria);

            if (galeriaInput && galeriaInput.files.length > 0) {
                for (let i = 0; i < galeriaInput.files.length; i++) {
                    formData.append('imagens', galeriaInput.files[i]);
                }
            }

            const originalText = btnSalvar.innerHTML;
            btnSalvar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';
            btnSalvar.disabled = true;

            try {
                // Passar headers: {} permite que o multipart/form-data do FormData sobrescreva o application/json padrão
                const data = await apiRequest('/projetos', {
                    method: 'POST',
                    headers: {}, 
                    body: formData
                });

                // Sucesso
                btnSalvar.innerHTML = '<i class="bi bi-check-circle"></i> Projeto Salvo!';
                btnSalvar.style.color = '#00d278';
                btnSalvar.style.borderColor = '#00d278';
                btnSalvar.classList.remove('spinner-border');

                setTimeout(() => {
                    window.location.hash = '#criacao';
                }, 1500);

            } catch (error) {
                console.error("Falha ao salvar projeto de portfólio:", error);
                alert(`Não foi possível salvar o projeto: ${error.message}`);
                
                btnSalvar.innerHTML = originalText;
                btnSalvar.disabled = false;
            }
        });
    }
})();
