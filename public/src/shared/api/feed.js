// Serviço de API: Feed
// Listagem e Interações de Posts
// Substitui a comunicação antiga via jQuery AJAX para fetch() padrão. Centraliza as chamadas relacionadas à timeline (posts, likes, comentários).
// Este arquivo SUBSTITUI o bloco de API que estava em:
//   src/entities/feed/scripts/card-feed.js (jQuery $.ajax)
// Agora usa fetch() padrão com autenticação via token.

// Dados Sintéticos
// Fallback local (Mock)
// Já no formato de exibição (mesmo formato retornado por mapPostFromApi), para que o
// card renderize igual esteja o post vindo do backend ou do fallback offline.
const FEED_MOCK = [
    {
        id: 1,
        author_name: 'Hanna Reis',
        author_role: 'Membro Pro-Link',
        time_ago: '5 min atrás',
        title: 'Dicas para emissão de ART em projetos de infraestrutura',
        content: 'Ao elaborar um projeto de grande porte, é essencial garantir que todos os responsáveis técnicos estejam devidamente registrados no CREA-AM...',
        likes_count: 42,
        comments_count: 8,
        liked_by_me: false
    },
    {
        id: 2,
        author_name: 'CREA-AM',
        author_role: 'Membro Pro-Link',
        time_ago: '2h atrás',
        title: 'Novo ciclo de fiscalização de obras iniciado em Manaus',
        content: 'O CREA-AM informa que o novo ciclo de fiscalização de obras públicas e privadas no município de Manaus terá início na próxima segunda-feira...',
        likes_count: 128,
        comments_count: 17,
        liked_by_me: false
    }
];

// Rótulos legíveis para o enum `tipo_conta` (usuarios.tipo_conta) retornado pelo backend.
const TIPO_CONTA_LABELS = {
    COMUM: 'Membro Pro-Link',
    ESTUDANTE: 'Estudante',
    PROFISSIONAL: 'Profissional',
    EMPRESA: 'Empresa'
};

// Formata uma data "YYYY-MM-DD HH:MM:SS" (vinda do backend) como "há X min/h/dias".
function formatTimeAgo(dataPostagem) {
    if (!dataPostagem) return '';

    const postDate = new Date(dataPostagem.replace(' ', 'T'));
    const diffMs = Date.now() - postDate.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return 'agora mesmo';
    if (diffMin < 60) return `${diffMin} min atrás`;

    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h atrás`;

    const diffDias = Math.floor(diffH / 24);
    return `${diffDias}d atrás`;
}

// Converte o Post retornado pelo backend (PostRepository::all, campos em camelCase/PT)
// para o formato de exibição usado pelo card do feed.
function mapPostFromApi(post) {
    return {
        id: post.id,
        author_name: post.autorNome || 'Usuário Pro-Link',
        author_role: TIPO_CONTA_LABELS[post.autorTipoConta] || 'Membro Pro-Link',
        time_ago: formatTimeAgo(post.dataDePostagem),
        title: post.titulo,
        content: post.conteudo,
        likes_count: post.curtidas ?? 0,
        comments_count: post.comentarios ?? 0,
        liked_by_me: !!post.curtidoPorMim,
        // URL absoluta (backend) da midia anexada ao post, se houver - ver
        // PostRepository::hydrate() / imagem_caminho.
        image_url: post.imagemUrl || null
    };
}

// Buscar Feed
// Listagem cronológica de publicações
// Utiliza a API base para buscar os posts, aceitando filtros dinâmicos de paginação ou limites. Retorna dados simulados em caso de falha.
async function fetchFeedPosts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/feed${query ? `?${query}` : ''}`;
    try {
        const response = await apiRequest(endpoint);
        return (response.data || []).map(mapPostFromApi);
    } catch (error) {
        console.warn('[Pro-Link API] Feed indisponível. Usando dados sintéticos.', error.message);
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