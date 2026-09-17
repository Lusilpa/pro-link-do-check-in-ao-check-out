var API_URL = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : 'http://localhost:8080';

async function alterarSenhaUsuarioAPI(dados) {
    try {
        // O backend exige o campo "_csrf" em todo POST (CsrfMiddleware). Sem ele, a
        // resposta e 419 em texto puro (nao JSON), e o catch do response.json() abaixo
        // mascarava isso como "Erro ao conversar com o endpoint" mesmo com a senha certa.
        const _csrf = typeof getCsrfToken === 'function'
            ? await getCsrfToken()
            : (await (await fetch(`${API_URL}/csrf-token`, { credentials: 'include' })).json()).csrf_token;

        const response = await fetch(`${API_URL}/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ ...dados, _csrf })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.message || `Erro ao conversar com o endpoint`);
        }

        return { success: true, data };
    } catch (error) {
        console.error(`[API change-password] Erro em :`, error.message);
        return { success: false, message: error.message };
    }
}