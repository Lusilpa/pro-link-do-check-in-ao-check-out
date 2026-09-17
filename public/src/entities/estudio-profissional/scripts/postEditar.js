(function initPostEditar() {
    console.log('Script postEditar inicializado com integração fetch (apiRequest).');

    const loadingEl = document.getElementById('postEditar-loading');
    const emptyEl = document.getElementById('postEditar-empty');
    const listEl = document.getElementById('postEditar-list');

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

            if (posts.length === 0) {
                emptyEl.classList.remove('d-none');
                return;
            }

            posts.forEach(post => {
                const card = document.createElement('div');
                card.className = 'pl-estudio-item-card';
                card.id = `post-item-${post.id}`;

                card.innerHTML = `
                  <div class="pl-estudio-item-info">
                    <h5>${post.titulo || 'Post Sem Título'}</h5>
                    <p>Publicado em: ${post.data_postagem ? new Date(post.data_postagem).toLocaleDateString() : '—'} • ${post.status_post || 'Público'}</p>
                  </div>
                  <div class="pl-estudio-item-actions">
                    <button class="pl-estudio-item-btn btn-editar-post" data-target="${post.id}" title="Editar">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <!-- Podemos ter exclusão aqui tb se quiser -->
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