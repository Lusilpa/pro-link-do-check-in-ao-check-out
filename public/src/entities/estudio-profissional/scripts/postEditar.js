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

            const posts = response.data || [];

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
                const postId = this.getAttribute('data-target');
                sessionStorage.setItem('editarPostId', postId);
                window.location.hash = '#post-criar'; // AJUSTAR: coloque aqui o hash real que abre a tela de criar post
            });
        });
    }


    carregarPosts();
})();