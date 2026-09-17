var API_URL = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : 'http://localhost:8080';

async function alterarSenhaUsuarioAPI(dados) {
    try {
        const response = await fetch(`${API_URL}/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(dados)
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