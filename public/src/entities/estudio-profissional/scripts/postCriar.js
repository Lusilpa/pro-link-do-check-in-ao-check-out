(function initPostCriar() {
    console.log('Script postCriar inicializado com integração fetch (apiRequest).');

    const btnPostar = document.getElementById('btn-postar-feed');

    if (btnPostar) {
        btnPostar.addEventListener('click', async () => {
            if (btnPostar.disabled) return;

            const textInput = document.getElementById('post-texto');
            const mediaInput = document.getElementById('post-midia');

            if (!textInput || textInput.value.trim() === '') {
                alert("Escreva algo antes de postar.");
                return;
            }

            const formData = new FormData();
            formData.append('conteudo', textInput.value.trim());
            
            if (mediaInput && mediaInput.files.length > 0) {
                formData.append('midia', mediaInput.files[0]);
            }

            const originalHtml = btnPostar.innerHTML;
            btnPostar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Publicando...';
            btnPostar.disabled = true;

            try {
                // Passar headers: {} permite que o multipart/form-data do FormData sobrescreva o application/json padrão
                await apiRequest('/posts', {
                    method: 'POST',
                    headers: {},
                    body: formData
                });

                // Sucesso
                btnPostar.innerHTML = '<i class="bi bi-check-circle"></i> Publicado!';
                btnPostar.style.color = '#00d278';
                btnPostar.style.borderColor = '#00d278';

                setTimeout(() => {
                    window.location.hash = '#criacao';
                }, 1500);

            } catch (error) {
                console.error("Falha ao criar post:", error);
                alert(`Não foi possível realizar a publicação: ${error.message}`);
                
                btnPostar.innerHTML = originalHtml;
                btnPostar.disabled = false;
            }
        });
    }
})();
