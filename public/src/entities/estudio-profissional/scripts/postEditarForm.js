(function initPostEditarForm() {
    const btnSalvar = document.getElementById('btn-salvar-post');
    const titleInput = document.getElementById('post-titulo');
    const textInput = document.getElementById('post-conteudo');
    const mediaInput = document.getElementById('post-midia');

    const postId = getIdFromHash();

    if (!postId) {
        alert('Post não encontrado.');
        window.location.hash = '#criacao';
        return;
    }

    function getIdFromHash() {
        const queryString = window.location.hash.split('?')[1] || '';
        return new URLSearchParams(queryString).get('id');
    }

    async function preencherFormulario() {
        try {
            const json = await apiRequest(`/post/${postId}`, { method: 'GET' });
            const post = json.data; // confirma se o GET de post único também vem envolvido em { data }
            titleInput.value = post.titulo;
            textInput.value = post.conteudo;
        } catch (error) {
            console.error('Erro ao carregar post:', error);
            alert('Não foi possível carregar os dados do post.');
        }
    }

    btnSalvar.addEventListener('click', async () => {
        if (btnSalvar.disabled) return;

        if (textInput.value.trim() === '') {
            alert('Escreva algo antes de salvar.');
            return;
        }

        const formData = new FormData();
        formData.append('conteudo', textInput.value.trim());
        formData.append('titulo', titleInput.value.trim());

        if (mediaInput.files.length > 0) {
            formData.append('midia', mediaInput.files[0]);
        }

        const originalHtml = btnSalvar.innerHTML;
        btnSalvar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';
        btnSalvar.disabled = true;

        try {
            await apiRequest(`/post/edit/${postId}`, {
                method: 'POST',
                headers: {},
                body: formData
            });

            btnSalvar.innerHTML = '<i class="bi bi-check-circle"></i> Salvo!';
            btnSalvar.style.color = '#00d278';
            btnSalvar.style.borderColor = '#00d278';

            setTimeout(() => {
                window.location.hash = '#criacao';
            }, 1500);

        } catch (error) {
            console.error('Falha ao salvar post:', error);
            alert(`Não foi possível salvar: ${error.message}`);

            btnSalvar.innerHTML = originalHtml;
            btnSalvar.disabled = false;
        }
    });

    preencherFormulario();
})();