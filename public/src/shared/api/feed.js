// Serviço de API: Feed
// Listagem e Interações de Posts
// Substitui a comunicação antiga via jQuery AJAX para fetch() padrão. Centraliza as chamadas relacionadas à timeline (posts, likes, comentários).
// Este arquivo SUBSTITUI o bloco de API que estava em:
//   src/entities/feed/scripts/card-feed.js (jQuery $.ajax)
// Agora usa fetch() padrão com autenticação via token.

// Dados Sintéticos
// Fallback local (Mock)
// AVISO: `author_name` e `author_role` NÃO existem na tabela `posts`.
// No banco, `posts` tem apenas `id_autor` (FK para `usuarios`).
// Esses campos serão retornados pelo backend via JOIN com `usuarios` e `profissionais`.
// `views_count` também NÃO existe no banco — removido do mock.
const FEED_MOCK = [
    {
        id: 1,
        autor: {
            id: 2,
            nome: 'Hanna Reis',
            cargo: 'Engenheira Civil Sênior'
        },
        time_ago: '5 min atrás',
        titulo: 'Dicas para emissão de ART em projetos de infraestrutura',
        conteudo: 'Ao elaborar um projeto de grande porte, é essencial garantir que todos os responsáveis técnicos estejam devidamente registrados no CREA-AM...',
        likes_count: 42,
        comments_count: 8
    },
    {
        id: 2,
        autor: {
            id: 3,
            nome: 'CREA-AM',
            cargo: 'Conselho Regional'
        },
        time_ago: '2h atrás',
        titulo: 'Novo ciclo de fiscalização de obras iniciado em Manaus',
        conteudo: 'O CREA-AM informa que o novo ciclo de fiscalização de obras públicas e privadas no município de Manaus terá início na próxima segunda-feira...',
        likes_count: 128,
        comments_count: 17
    }
];

// Buscar Feed
// Listagem cronológica de publicações
// Utiliza a API base para buscar os posts, aceitando filtros dinâmicos de paginação ou limites. Retorna dados simulados em caso de falha.
async function fetchFeedPosts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/feed${query ? `?${query}` : ''}`;
    try {
        return await apiRequest(endpoint);
    } catch (error) {
        console.warn('[Pro-Link API] Feed indisponível. Usando dados sintéticos.');
        return FEED_MOCK;
    }
}

// Publicar Post
// Criação de conteúdo
// Envia título e conteúdo da publicação para a API base utilizando método POST.
async function createPost(postData) {
    return apiRequest('/posts', {
        method: 'POST',
        body: JSON.stringify(postData)
    });
}

// Curtir Post
// Interação de Like
// Aciona a rota de curtida referenciando o ID único da publicação.
async function likePost(postId) {
    return apiRequest(`/posts/${postId}/like`, { method: 'POST' });
}

// Comentar Post
// Interação textual no Feed
// Registra um novo comentário enviando a string do conteúdo atrelada ao ID da publicação.
// DB: a coluna se chama `conteudo` (não `content`) na tabela `comentarios`.
async function commentOnPost(postId, content) {
    return apiRequest(`/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ conteudo: content })
    });
}