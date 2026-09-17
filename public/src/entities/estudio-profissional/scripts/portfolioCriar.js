(function initPortfolioCriar() {
    console.log('Script portfolioCriar inicializado com integração fetch (apiRequest).');

    const btnSalvar = document.getElementById('btn-salvar-portfolio');
    const galeriaInput = document.getElementById('port-galeria');
    const galeriaPreview = document.getElementById('port-galeria-preview');

    // #port-galeria aceita varios arquivos (multiple) e reabrir o seletor SUBSTITUI a
    // seleção anterior no input nativo - por isso mantemos nossa própria lista e
    // reescrevemos input.files via DataTransfer a cada mudança, pra poder acumular
    // escolhas de aberturas diferentes do seletor e remover uma imagem por vez.
    let arquivosGaleria = [];

    function sincronizarInputGaleria() {
        if (!galeriaInput) return;
        const dt = new DataTransfer();
        arquivosGaleria.forEach(file => dt.items.add(file));
        galeriaInput.files = dt.files;
    }

    function renderGaleriaPreview() {
        if (!galeriaPreview) return;
        galeriaPreview.innerHTML = '';

        arquivosGaleria.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'pl-galeria-item';

            const label = document.createElement('span');
            const icon = document.createElement('i');
            icon.className = 'bi bi-file-earmark-image';
            label.appendChild(icon);
            label.appendChild(document.createTextNode(' ' + file.name));

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.setAttribute('aria-label', 'Remover imagem');
            removeBtn.innerHTML = '<i class="bi bi-trash3-fill"></i>';
            removeBtn.addEventListener('click', () => {
                arquivosGaleria.splice(index, 1);
                sincronizarInputGaleria();
                renderGaleriaPreview();
            });

            item.appendChild(label);
            item.appendChild(removeBtn);
            galeriaPreview.appendChild(item);
        });
    }

    if (galeriaInput) {
        galeriaInput.addEventListener('change', () => {
            arquivosGaleria = arquivosGaleria.concat(Array.from(galeriaInput.files));
            sincronizarInputGaleria();
            renderGaleriaPreview();
        });
    }

    if (btnSalvar) {
        btnSalvar.addEventListener('click', async () => {
            if (btnSalvar.disabled) return;

            const titulo = document.getElementById('port-titulo')?.value;
            const descricao = document.getElementById('port-descricao')?.value;
            const ano = document.getElementById('port-ano')?.value;
            const categoria = document.getElementById('port-categoria')?.value;

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
                // "imagens[]" (com colchetes): sem isso, o PHP so enxerga o ULTIMO
                // arquivo enviado sob o mesmo nome de campo (ver Request::files()).
                for (let i = 0; i < galeriaInput.files.length; i++) {
                    formData.append('imagens[]', galeriaInput.files[i]);
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
