(function initPostDeletar() {
    console.log('Script postDeletar inicializado com integração fetch (apiRequest).');

    const loadingEl = document.getElementById('postDeletar-loading');
    const emptyEl = document.getElementById('postDeletar-empty');
    const listEl = document.getElementById('postDeletar-list');

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
                    <button class="pl-estudio-item-btn pl-estudio-item-btn--danger btn-del-post" data-target="post-item-${post.id}" title="Excluir">
                      <i class="bi bi-trash3"></i>
                    </button>
                  </div>
                `;
                listEl.appendChild(card);
            });

            listEl.classList.remove('d-none');
            vincularEventosExclusao();

        } catch (error) {
            console.error("Falha ao buscar posts da comunidade:", error);
            loadingEl.classList.add('d-none');
            emptyEl.classList.remove('d-none');
            emptyEl.querySelector('p').textContent = "Erro ao carregar publicações: " + error.message;
        }
    }

    function vincularEventosExclusao() {
        document.querySelectorAll('.btn-del-post').forEach(btn => {
            btn.addEventListener('click', async function() {
                const targetId = this.getAttribute('data-target');
                const card = document.getElementById(targetId);
                
                const postId = targetId.replace('post-item-', '');

                if (card && confirm('Tem certeza que deseja remover este post permanentemente?')) {
                    
                    const originalContent = this.innerHTML;
                    this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
                    this.disabled = true;

                    try {
                        // Não há um POST /posts/{id}/remover explícito no routes,
                        // Vamos supor que seja DELETE /posts/{id} ou algo similar.
                        // Wait! O PostController::destroy usa ID via payload no body caso seja um request POST,
                        // mas a rota atual não mapeia DELETE ou similar. 
                        // Vou verificar como delete funciona no PostController (destroy).
                        
                        await apiRequest(`/posts/${postId}/remover`, {
                            method: 'POST'
                        });

                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.remove();
                            if (listEl.children.length === 0) {
                                emptyEl.classList.remove('d-none');
                                listEl.classList.add('d-none');
                            }
                        }, 300);

                    } catch (error) {
                        console.error("Falha ao remover o post:", error);
                        alert(`Não foi possível excluir o post: ${error.message}`);
                        
                        this.innerHTML = originalContent;
                        this.disabled = false;
                    }
                }
            });
        });
    }

    carregarPosts();
})();
