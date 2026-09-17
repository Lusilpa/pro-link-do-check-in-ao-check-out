(function initPostCriar() {
    console.log('Script postCriar inicializado com integração fetch (apiRequest).');

    // IDs conforme postCriar.html: post-titulo, post-conteudo (textarea), post-midia,
    // btn-publicar-post - nao "post-texto"/"btn-postar-feed" (esses nao existem na
    // pagina, entao o listener abaixo nunca era anexado e o botao nao fazia nada).
    const btnPostar = document.getElementById('btn-publicar-post');
    const mediaInput = document.getElementById('post-midia');
    const mediaPreview = document.getElementById('post-midia-preview');

    // Mostra o nome do arquivo escolhido (mesmo padrao de card-envio.js em cartas
    // virtuais), com opcao de remover antes de publicar. Usa createElement/textContent
    // (nao innerHTML) porque o nome do arquivo vem do input do usuario.
    function renderMediaPreview() {
        if (!mediaPreview) return;
        mediaPreview.innerHTML = '';

        if (!mediaInput || mediaInput.files.length === 0) return;

        const file = mediaInput.files[0];
        const icon = file.type === 'application/pdf' ? 'bi-file-earmark-pdf' : 'bi-file-earmark-image';

        const item = document.createElement('div');
        item.className = 'pl-post-midia-item';

        const label = document.createElement('span');
        const iconEl = document.createElement('i');
        iconEl.className = `bi ${icon}`;
        label.appendChild(iconEl);
        label.appendChild(document.createTextNode(' ' + file.name));

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.setAttribute('aria-label', 'Remover arquivo');
        removeBtn.innerHTML = '<i class="bi bi-trash3-fill"></i>';
        removeBtn.addEventListener('click', () => {
            mediaInput.value = '';
            renderMediaPreview();
        });

        item.appendChild(label);
        item.appendChild(removeBtn);
        mediaPreview.appendChild(item);
    }

    if (mediaInput) {
        mediaInput.addEventListener('change', renderMediaPreview);
    }

    if (btnPostar) {
        btnPostar.addEventListener('click', async () => {
            if (btnPostar.disabled) return;

            const tituloInput = document.getElementById('post-titulo');
            const textInput = document.getElementById('post-conteudo');

            if (!textInput || textInput.value.trim() === '') {
                alert("Escreva algo antes de postar.");
                return;
            }

            const formData = new FormData();
            if (tituloInput && tituloInput.value.trim() !== '') {
                formData.append('titulo', tituloInput.value.trim());
            }
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
