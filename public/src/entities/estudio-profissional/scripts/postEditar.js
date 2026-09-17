(function initPostEditar() {
    console.log('Script postEditar inicializado com integração fetch (apiRequest).');

    const loadingEl = document.getElementById('postEditar-loading');
    const emptyEl = document.getElementById('postEditar-empty');
    const listEl = document.getElementById('postEditar-list');

    const viewList = document.getElementById('postEditar-view-list');
    const viewForm = document.getElementById('postEditar-view-form');

    const tituloInput = document.getElementById('postEditar-titulo');
    const conteudoInput = document.getElementById('postEditar-conteudo');
    const mediaInput = document.getElementById('postEditar-midia');
    const mediaPreview = document.getElementById('postEditar-midia-preview');
    const mediaAtualEl = document.getElementById('postEditar-midia-atual');
    const btnSalvar = document.getElementById('btn-post-editar-salvar');
    const btnCancelar = document.getElementById('btn-post-editar-cancelar');

    // Posts já buscados na lista - reaproveitado para preencher o formulário sem
    // precisar de uma segunda chamada à API (o back já devolve titulo/conteudo/imagemUrl).
    let postsCache = [];
    let postEmEdicao = null;
    // true quando o usuário pediu para remover a mídia atual sem escolher uma nova.
    let removerMidiaAtual = false;

    async function carregarPosts() {
        if (!loadingEl || !emptyEl || !listEl) return;

        loadingEl.classList.remove('d-none');
        emptyEl.classList.add('d-none');
        listEl.classList.add('d-none');
        listEl.innerHTML = '';

        try {
            const user = typeof getAuthUser === 'function' ? getAuthUser() : null;
            if (!user) {
                loadingEl.classList.add('d-none');
                return;
            }

            const response = await apiRequest(`/posts?usuario_id=${user.id}`, { method: 'GET' });

            loadingEl.classList.add('d-none');

            postsCache = response.data || [];

            if (postsCache.length === 0) {
                emptyEl.classList.remove('d-none');
                return;
            }

            postsCache.forEach(post => {
                const card = document.createElement('div');
                card.className = 'pl-estudio-item-card';
                card.id = `post-item-${post.id}`;

                card.innerHTML = `
                  <div class="pl-estudio-item-info">
                    <h5>${post.titulo || 'Post Sem Título'}</h5>
                    <p>Publicado em: ${post.dataDePostagem ? new Date(post.dataDePostagem).toLocaleDateString() : '—'} • ${post.status || 'Público'}</p>
                  </div>
                  <div class="pl-estudio-item-actions">
                    <button class="pl-estudio-item-btn btn-editar-post" data-target="${post.id}" title="Editar">
                      <i class="bi bi-pencil"></i>
                    </button>
                  </div>
                `;
                listEl.appendChild(card);
            });

            listEl.classList.remove('d-none');
            vincularEventosEdicao();

        } catch (error) {
            console.error("Falha ao buscar posts da comunidade:", error);
            loadingEl.classList.add('d-none');
            emptyEl.classList.remove('d-none');
            emptyEl.querySelector('p').textContent = "Erro ao carregar publicações: " + error.message;
        }
    }

    function vincularEventosEdicao() {
        document.querySelectorAll('.btn-editar-post').forEach(btn => {
            btn.addEventListener('click', function () {
                const postId = Number(this.getAttribute('data-target'));
                const post = postsCache.find(p => p.id === postId);
                if (post) abrirFormularioEdicao(post);
            });
        });
    }

    // --------------------------------------------------------------
    // Alternância entre a lista e o formulário de edição
    // --------------------------------------------------------------
    function abrirFormularioEdicao(post) {
        postEmEdicao = post;
        removerMidiaAtual = false;

        tituloInput.value = post.titulo || '';
        conteudoInput.value = post.conteudo || '';
        if (mediaInput) mediaInput.value = '';
        renderMediaPreview();
        renderMidiaAtual();

        viewList.classList.add('d-none');
        viewForm.classList.remove('d-none');
    }

    function voltarParaLista() {
        postEmEdicao = null;
        viewForm.classList.add('d-none');
        viewList.classList.remove('d-none');
    }

    if (btnCancelar) {
        btnCancelar.addEventListener('click', voltarParaLista);
    }

    // --------------------------------------------------------------
    // Mídia já salva no post (some se o usuário remover ou trocar por outra)
    // --------------------------------------------------------------
    function renderMidiaAtual() {
        if (!mediaAtualEl) return;
        mediaAtualEl.innerHTML = '';

        if (!postEmEdicao || !postEmEdicao.imagemUrl || removerMidiaAtual) return;

        const isPdf = /\.pdf(\?|$)/i.test(postEmEdicao.imagemUrl);

        const item = document.createElement('div');
        item.className = 'pl-post-midia-atual';

        if (isPdf) {
            const icon = document.createElement('i');
            icon.className = 'bi bi-file-earmark-pdf';
            icon.style.fontSize = '1.4rem';
            icon.style.color = 'var(--prolink-blue)';
            item.appendChild(icon);
        } else {
            const img = document.createElement('img');
            img.src = postEmEdicao.imagemUrl;
            img.alt = 'Mídia atual do post';
            item.appendChild(img);
        }

        const label = document.createElement('span');
        label.textContent = 'Mídia atual do post';
        item.appendChild(label);

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.textContent = 'Remover';
        removeBtn.addEventListener('click', () => {
            removerMidiaAtual = true;
            renderMidiaAtual();
        });
        item.appendChild(removeBtn);

        mediaAtualEl.appendChild(item);
    }

    // --------------------------------------------------------------
    // Preview do novo arquivo escolhido (mesmo padrão de postCriar.js)
    // --------------------------------------------------------------
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
            renderMidiaAtual();
        });

        item.appendChild(label);
        item.appendChild(removeBtn);
        mediaPreview.appendChild(item);

        // Escolher um novo arquivo substitui a mídia atual - some o bloco "mídia atual".
        if (mediaAtualEl) mediaAtualEl.innerHTML = '';
    }

    if (mediaInput) {
        mediaInput.addEventListener('change', renderMediaPreview);
    }

    // --------------------------------------------------------------
    // Salvar alterações (POST /posts/edit)
    // --------------------------------------------------------------
    if (btnSalvar) {
        btnSalvar.addEventListener('click', async () => {
            if (btnSalvar.disabled || !postEmEdicao) return;

            if (!conteudoInput || conteudoInput.value.trim() === '') {
                alert('Escreva algo antes de salvar.');
                return;
            }

            const formData = new FormData();
            formData.append('id', postEmEdicao.id);
            if (tituloInput && tituloInput.value.trim() !== '') {
                formData.append('titulo', tituloInput.value.trim());
            }
            formData.append('conteudo', conteudoInput.value.trim());

            if (mediaInput && mediaInput.files.length > 0) {
                formData.append('midia', mediaInput.files[0]);
            } else if (removerMidiaAtual) {
                formData.append('remover_midia', '1');
            }

            const originalHtml = btnSalvar.innerHTML;
            btnSalvar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';
            btnSalvar.disabled = true;

            try {
                await apiRequest('/posts/edit', {
                    method: 'POST',
                    headers: {},
                    body: formData
                });

                if (window.prolinkToast) window.prolinkToast('Post atualizado com sucesso!');
                voltarParaLista();
                carregarPosts();
            } catch (error) {
                console.error('Falha ao atualizar post:', error);
                alert(`Não foi possível salvar as alterações: ${error.message}`);
            } finally {
                btnSalvar.innerHTML = originalHtml;
                btnSalvar.disabled = false;
            }
        });
    }

    carregarPosts();
})();
