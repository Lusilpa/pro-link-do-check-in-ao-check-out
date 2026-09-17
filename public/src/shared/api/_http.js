// Cliente HTTP Base
// Camada de Transporte
// Responsabilidade única: executar fetch com configuração padrão da plataforma. Todos os arquivos de shared/api devem usar este cliente ao invés de fetch() diretamente.

// API_BASE_URL ja e declarado por auth.js, carregado antes deste arquivo em index.html.
// Nao redeclarar aqui: como os scripts de shared/api compartilham o escopo global (nao sao
// modules), um segundo "const API_BASE_URL" lança "Identifier has already been declared" e
// impede todo o resto deste arquivo (incluindo apiRequest) de ser definido.

// Cabeçalhos Base
// O backend usa sessão nativa (cookies), então não usamos mais JWT no cabeçalho Authorization.
function getBaseHeaders() {
    return {
        'Content-Type': 'application/json'
    };
}

// Token CSRF
// Obtencao sob demanda (cacheado em memoria)
// O backend exige o campo "_csrf" em todo POST/PUT/PATCH/DELETE (CsrfMiddleware). Como o
// cliente e uma SPA e nao renderiza os formularios via View do PHP, buscamos o token
// vigente da sessao pelo endpoint GET /csrf-token antes de cada requisicao que altera estado.
let _cachedCsrfToken = null;

async function getCsrfToken() {
    if (_cachedCsrfToken) return _cachedCsrfToken;

    const response = await fetch(`${API_BASE_URL}/csrf-token`, { credentials: 'include' });
    const data = await response.json();
    _cachedCsrfToken = data.csrf_token;
    return _cachedCsrfToken;
}

// Requisição de API
// Wrapper central do fetch
// Monta a URL completa e lança erro se a resposta não for HTTP 2xx ou se houver falha de rede.
// IMPORTANTE: Inclui cookies para a sessão funcionar com o backend MVC PHP. Para metodos que
// alteram estado, anexa automaticamente o token CSRF ao corpo JSON.
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const method = (options.method || 'GET').toUpperCase();
    const isFormData = options.body instanceof FormData;
    const config = {
        // FormData (upload de arquivo) precisa que o proprio browser defina o
        // Content-Type com o boundary do multipart - forcar 'application/json' aqui
        // quebra o upload silenciosamente.
        headers: isFormData ? {} : getBaseHeaders(),
        credentials: 'include', // Exigido para enviar e receber cookies de sessão do backend
        ...options,
    };

    if (!['GET', 'HEAD'].includes(method)) {
        const _csrf = await getCsrfToken();
        if (isFormData) {
            config.body.append('_csrf', _csrf);
        } else {
            let bodyObj = {};
            if (typeof config.body === 'string') {
                try { bodyObj = JSON.parse(config.body); } catch { bodyObj = {}; }
            }
            config.body = JSON.stringify({ ...bodyObj, _csrf });
        }
    }

    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = data?.message || `Erro ${response.status}: ${response.statusText}`;
        throw new Error(message);
    }

    return data;
}
