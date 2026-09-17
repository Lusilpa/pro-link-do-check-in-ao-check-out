// ==========================================
// ENTITY: Card do Feed (Renderização)
// ==========================================
// A lógica de busca de dados (fetchFeedPosts) foi movida para:
//   src/shared/api/feed.js
//
// Este arquivo é responsável SOMENTE por renderizar os cards na UI.
// Substitui o uso de jQuery $.ajax por fetch() centralizado.
// ==========================================

/**
 * Transforma os dados de um post em HTML de card.
 * @param {Object} postData
 * @returns {string} HTML string do card.
 */
function renderFeedCard(postData) {
    return `
    <div class="pl-feed-card" data-post-id="${postData.id}">
        <div class="pl-feed-header">
            <div class="pl-user-info">
                <div class="pl-avatar-teal">
                    <i class="bi bi-person-fill" aria-hidden="true"></i>
                </div>
                <div class="pl-user-meta">
                    <h6 class="pl-user-name">${postData.author_name}</h6>
                    <span class="pl-user-role">${postData.author_role} • ${postData.time_ago}</span>
                </div>
            </div>
            <!-- Botão de opções do post (sem ação implementada ainda)
            <button class="pl-btn-options" aria-label="Opções do post">
                <i class="bi bi-three-dots-vertical" aria-hidden="true"></i>
            </button>
            -->
        </div>

        <div class="pl-feed-body">
            <h4 class="pl-feed-title">${postData.title}</h4>
            <p class="pl-feed-text">${postData.content}</p>
        </div>

        <div class="pl-feed-footer">
            <div class="pl-action-stat">
                <i class="bi bi-heart" aria-hidden="true"></i> <span>${postData.likes_count}</span>
            </div>
            <div class="pl-action-stat">
                <i class="bi bi-chat-text" aria-hidden="true"></i> <span>${postData.comments_count}</span>
            </div>
            <div class="pl-action-stat">
                <i class="bi bi-bar-chart-fill" aria-hidden="true"></i> <span>${postData.views_count}</span>
            </div>
        </div>
    </div>
    `;
}

/**
 * Busca e renderiza os posts do feed no container especificado.
 * Depende de fetchFeedPosts() de shared/api/feed.js.
 */
async function loadFeed() {
    const container = document.getElementById('feed-posts-container');
    if (!container) return;

    container.innerHTML = '<div class="text-center text-white"><div class="spinner-border text-info" role="status" aria-label="Carregando feed…"></div><p class="mt-2">Carregando feed…</p></div>';

    const posts = await fetchFeedPosts();

    if (!posts || posts.length === 0) {
        container.innerHTML = '<p class="text-muted-custom text-center">Nenhuma publicação encontrada.</p>';
        return;
    }

    container.innerHTML = posts.map(renderFeedCard).join('');
}