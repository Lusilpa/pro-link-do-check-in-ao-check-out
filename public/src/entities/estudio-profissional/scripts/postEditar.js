(function initPostEditar() {
    const container = document.getElementById('postListContainer');

    async function loadPosts() {
        try {
            const posts = await getUserPosts();

            if (!posts.length) {
                container.innerHTML = '<p class="pl-empty-text">Você ainda não tem publicações.</p>';
                return;
            }

            container.innerHTML = posts.map(renderPostCard).join('');
        } catch (err) {
            console.error('Erro ao carregar posts:', err);
            container.innerHTML = '<p class="pl-error-text">Não foi possível carregar suas publicações.</p>';
        }
    }

    function renderPostCard(post) {
        const dataFormatada = formatarData(post.dataDePostagem);

        return `
            <div class="pl-estudio-item-card" data-id="${post.id}">
                <div class="pl-estudio-item-info">
                    <h5>${escapeHtml(post.titulo)}</h5>
                    <p>Publicado em: ${dataFormatada}</p>
                </div>
                <div class="pl-estudio-item-actions">
                    <button class="pl-estudio-item-btn" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                </div>
            </div>
        `;
    }

    function formatarData(dataString) {
        // "2026-09-17 10:47:52" -> troca o espaço por T
        // (Safari não parseia string de data com espaço)
        const data = new Date(dataString.replace(' ', 'T'));
        return data.toLocaleDateString('pt-BR');
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    container.addEventListener('click', function (e) {
        const btn = e.target.closest('.pl-estudio-item-btn[title="Editar"]');
        if (!btn) return;

        const card = btn.closest('.pl-estudio-item-card');
        const postId = card.dataset.id;

        window.location.hash = `#post-editar-form?id=${encodeURIComponent(postId)}`;
    });

    loadPosts();
})();