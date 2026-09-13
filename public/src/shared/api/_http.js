// Cliente HTTP Base
// Camada de Transporte
// Responsabilidade única: executar fetch com configuração padrão da plataforma. Todos os arquivos de shared/api devem usar este cliente ao invés de fetch() diretamente.

const API_BASE_URL = 'http://localhost:8080';

// Cabeçalhos Base
// O backend usa sessão nativa (cookies), então não usamos mais JWT no cabeçalho Authorization.
function getBaseHeaders() {
    return {
        'Content-Type': 'application/json'
    };
}

// Requisição de API
// Wrapper central do fetch
// Monta a URL completa e lança erro se a resposta não for HTTP 2xx ou se houver falha de rede.
// IMPORTANTE: Inclui cookies para a sessão funcionar com o backend MVC PHP.
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: getBaseHeaders(),
        credentials: 'include', // Exigido para enviar e receber cookies de sessão do backend
        ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = data?.message || `Erro ${response.status}: ${response.statusText}`;
        throw new Error(message);
    }

    return data;
}
