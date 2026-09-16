const userSession = JSON.parse(sessionStorage.getItem('prolink_user') || '{}');

const userId = userSession.id;

// Buscar Portfólio do Usuário Logado
// GET /portfolio/me
// Usa a sessão (cookie) pra saber de quem é o portfólio — mesmo
// mecanismo de autenticação usado em loginUser/logoutUser no auth.js.
async function getMyPortfolio() {
    try {
        const response = await fetch(`${API_BASE_URL}/portfolio/me`, {
            method: 'GET',
            credentials: 'include', // Envia o cookie de sessão do PHP
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Não foi possível carregar o seu portfólio.');
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('[Portfolio] Erro ao buscar portfólio próprio:', error.message);
        return { success: false, message: error.message };
    }
}

// Buscar Portfólio Público de Outro Usuário
// GET /portfolio/:id
// Usado quando alguém visualiza o portfólio de outro profissional
// (ex: clicou no perfil dele numa lista ou abriu um link direto).
async function getPortfolioById(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/portfolio/${userId}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Portfólio não encontrado.');
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error(`[Portfolio] Erro ao buscar portfólio do usuário ${userId}:`, error.message);
        return { success: false, message: error.message };
    }
}

// Ponto Único de Entrada
// Decide sozinho qual dos dois buscar
// Se receber um userId, busca o portfólio PÚBLICO daquele usuário;
// se não receber nada, busca o portfólio do usuário LOGADO.
// Isso evita que pages/scripts/portfolio.js precise decidir isso sozinho.
async function fetchPortfolio(userId = null) {
    return userId ? getPortfolioById(userId) : getMyPortfolio(userId);
}