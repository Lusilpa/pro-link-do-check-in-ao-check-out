// Função que transforma os dados do MariaDB no HTML do Card
function renderFeedCard(postData) {
    return `
    <div class="pl-feed-card" data-post-id="${postData.id}">
        <div class="pl-feed-header">
            <div class="pl-user-info">
                <div class="pl-avatar-teal">
                    <i class="bi bi-person-fill"></i>
                </div>
                <div class="pl-user-meta">
                    <h6 class="pl-user-name">${postData.author_name}</h6>
                    <span class="pl-user-role">${postData.author_role} • ${postData.time_ago}</span>
                </div>
            </div>
            <button class="pl-btn-options">
                <i class="bi bi-three-dots-vertical"></i>
            </button>
        </div>

        <div class="pl-feed-body">
            <h4 class="pl-feed-title">${postData.title}</h4>
            <p class="pl-feed-text">${postData.content}</p>
        </div>

        <div class="pl-feed-footer">
            <div class="pl-action-stat">
                <i class="bi bi-heart"></i> <span>${postData.likes_count}</span>
            </div>
            <div class="pl-action-stat">
                <i class="bi bi-chat-text"></i> <span>${postData.comments_count}</span>
            </div>
            <div class="pl-action-stat">
                <i class="bi bi-bar-chart-fill"></i> <span>${postData.views_count}</span>
            </div>
        </div>
    </div>
    `;
}

// Função para buscar os dados na API e montar o feed
function loadFeedFromMariaDB() {
    const $feedContainer = $('#feed-posts-container'); // Container onde os posts vão aparecer
    
    // Exibe um carregamento enquanto busca os dados
    $feedContainer.html('<div class="text-center text-white"><div class="spinner-border text-info" role="status"></div><p class="mt-2">Carregando feed...</p></div>');

    // Chamada AJAX para a sua API que consulta o MariaDB
    $.ajax({
        url: 'http://localhost:8000/api/posts', // Exemplo de rota da sua API (FastAPI, Spring, etc.)
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            $feedContainer.empty(); // Limpa o loading
            
            // Verifica se tem posts
            if (response.length === 0) {
                $feedContainer.html('<p class="text-muted-custom text-center">Nenhuma publicação encontrada.</p>');
                return;
            }

            // Itera sobre cada linha retornada do MariaDB e joga na tela
            response.forEach(function(post) {
                $feedContainer.append(renderFeedCard(post));
            });
        },
        error: function(err) {
            console.error("Erro ao buscar dados da API:", err);
            $feedContainer.html('<div class="alert alert-danger">Erro ao carregar o feed. Tente novamente mais tarde.</div>');
        }
    });
}