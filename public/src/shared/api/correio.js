// Serviço de API: Cartas Virtuais
// Correspondência enviada pelo usuário autenticado
// A "Caixa de Correio" da SPA lista as cartas virtuais que o usuário criou (endpoint
// GET /cartas-virtuais) - é uma caixa de "enviados", não uma inbox de duas vias: o
// destinatário de uma carta é um e-mail externo, não necessariamente outro usuário
// da plataforma.

// Dados Sintéticos
// Fallback local (Mock), no mesmo formato retornado pelo backend (camelCase).
const CARTAS_MOCK = [
    {
        id: 1,
        titulo: 'Proposta de Demanda: Automação de RH',
        legenda: 'Olá, vimos o seu portfólio na plataforma Pro-Link e gostaríamos de propor uma parceria.',
        remetenteEmail: 'voce@prolink.com',
        destinatarioEmail: 'rh@tapajos.com',
        nomeArquivo: 'Escopo_Automacao_RH.pdf',
        criadoEm: new Date().toISOString()
    }
];

// Lista as cartas virtuais enviadas pelo usuário autenticado.
async function fetchCartasVirtuais() {
    try {
        const response = await apiRequest('/cartas-virtuais');
        return response.data || [];
    } catch (error) {
        console.warn('[Pro-Link API] Cartas virtuais indisponíveis. Usando dados sintéticos.', error.message);
        return CARTAS_MOCK;
    }
}

// Detalhes de uma carta virtual específica.
async function fetchCartaVirtualById(id) {
    try {
        const response = await apiRequest(`/cartas-virtuais/${id}`);
        return response.data;
    } catch (error) {
        console.warn(`[Pro-Link API] Carta virtual #${id} indisponível.`, error.message);
        return CARTAS_MOCK.find(c => c.id === Number(id)) || null;
    }
}

// Cria uma nova carta virtual. formData deve conter titulo, legenda, destinatario_email
// e, opcionalmente, arquivo (File) e id_demanda.
async function createCartaVirtual(formData) {
    return apiRequest('/cartas-virtuais', { method: 'POST', body: formData });
}

// Remove uma carta virtual (rota e POST, nao DELETE, para funcionar sem CORS extra).
async function deleteCartaVirtual(id) {
    return apiRequest(`/cartas-virtuais/${id}/remover`, { method: 'POST' });
}
