(function initPostCriar() {
    console.log('Script postCriar inicializado com integração fetch (apiRequest).');

    const btnPostar = document.getElementById('btn-publicar-post');
    const titleInput = document.getElementById('post-titulo');
    const textInput = document.getElementById('post-conteudo');
    const mediaInput = document.getElementById('post-midia');

    let postIdEmEdicao = null;

    async function carregarModoEdicao() {
        const idSalvo = sessionStorage.getItem('editarPostId');
        console.log(idSalvo);
        if (!idSalvo) return;

        postIdEmEdicao = idSalvo;
        sessionStorage.removeItem('editarPostId');

        try {
            const post = await getPostById(postIdEmEdicao);

            if (titleInput) titleInput.value = post.titulo || '';
            if (textInput) textInput.value = post.conteudo || '';

            if (btnPostar) {
                btnPostar.innerHTML = '<i class="bi bi-save"></i> Salvar Alterações';
            }

            const tituloPagina = document.querySelector('.pl-estudio-sub-title');
            if (tituloPagina) tituloPagina.textContent = 'Editar Post';

        } catch (error) {
            console.error("Falha ao carregar post para edição:", error);
            alert(`Não foi possível carregar o post para edição: ${error.message}`);
            postIdEmEdicao = null;
        }
    }

    if (btnPostar) {
        btnPostar.addEventListener('click', async () => {
            if (btnPostar.disabled) return;

            if (!textInput || textInput.value.trim() === '') {
                alert("Escreva algo antes de postar.");
                return;
            }

            const originalHtml = btnPostar.innerHTML;
            btnPostar.disabled = true;

            try {
                if (postIdEmEdicao) {
                    btnPostar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';

                    await updatePost(postIdEmEdicao, {
                        titulo: titleInput && titleInput.value.trim() !== '' ? titleInput.value.trim() : null,
                        conteudo: textInput.value.trim()
                    });

                    btnPostar.innerHTML = '<i class="bi bi-check-circle"></i> Salvo!';
                } else {
                    btnPostar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Publicando...';

                    const formData = new FormData();
                    formData.append('conteudo', textInput.value.trim());

                    if (mediaInput && mediaInput.files.length > 0) {
                        formData.append('midia', mediaInput.files[0]);
                    }
                    if (titleInput && titleInput.value.trim() !== '') {
                        formData.append('titulo', titleInput.value.trim());
                    }

                    await apiRequest('/posts', {
                        method: 'POST',
                        headers: {},
                        credentials: 'include',
                        body: formData
                    });

                    btnPostar.innerHTML = '<i class="bi bi-check-circle"></i> Publicado!';
                }

                btnPostar.style.color = '#00d278';
                btnPostar.style.borderColor = '#00d278';

                setTimeout(() => {
                    window.location.hash = '#criacao';
                }, 1500);

            } catch (error) {
                console.error("Falha ao salvar post:", error);
                alert(`Não foi possível salvar: ${error.message}`);

                btnPostar.innerHTML = originalHtml;
                btnPostar.disabled = false;
            }
        });
    }

    carregarModoEdicao();
})();