// Serviço de API: Talentos
// Listagem de Profissionais
// Fornece a camada de integração para buscar profissionais e estudantes universitários cadastrados na base do Pro-Link.

// Dados Sintéticos
// Fallback local (Mock)
// Utilizado para renderizar a interface de talentos enquanto o back-end está desconectado.
const TALENTOS_MOCK = [
    {
        id: 1,
        nome: 'Luan da Silva Palma',
        titulo: 'Estudante de Engenharia de Software',
        resumo: 'Focado no desenvolvimento de sistemas web (React, TypeScript) e back-end (Java/Spring, Python/FastAPI), com interesse em Inteligência Artificial.',
        is_student: true,
        area: 'Engenharia de Software',
        instituicao: 'IFAM - CMZL',
        nivel_semestre: '4º Período',
        localizacao: 'Manaus, AM',
        habilidades: ['Python', 'React', 'Java', 'NLP']
    },
    {
        id: 2,
        nome: 'Hanna Reis',
        titulo: 'Engenheira Civil Sênior',
        resumo: 'Especialista em cálculo estrutural e laudos técnicos de grandes obras de infraestrutura no Polo Industrial de Manaus.',
        is_student: false,
        registro_crea: 'Ativo',
        area: 'Engenharia Civil',
        instituicao: 'Tapajós Engenharia',
        nivel_semestre: 'Sênior',
        localizacao: 'Manaus, AM',
        habilidades: ['AutoCAD', 'Eberick', 'Fundações']
    }
];

// Buscar Talentos
// Lista Profissionais
// Executa o fetch com query string dinâmica de filtros, permitindo pesquisa por área, modalidade, nome, etc. Retorna o mock em caso de falha.
async function fetchTalentos(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const endpoint = `/profissionais${params ? `?${params}` : ''}`;

    try {
        return await apiRequest(endpoint);
    } catch (error) {
        console.warn('[Pro-Link API] Talentos indisponíveis. Usando dados sintéticos.');
        return TALENTOS_MOCK;
    }
}

// Detalhes do Talento
// Buscar Perfil por ID
// Retorna o cadastro completo de um profissional específico, incluindo resumo e habilidades. Recorre ao mock se não encontrar na API.
async function fetchTalentoById(id) {
    try {
        return await apiRequest(`/profissionais/${id}`);
    } catch (error) {
        console.warn(`[Pro-Link API] Talento #${id} não encontrado. Usando fallback.`);
        return TALENTOS_MOCK.find(t => t.id === Number(id)) || null;
    }
}

// Salvar Talento
// Adição a Favoritos
// Efetua uma chamada POST para salvar/favoritar o talento no perfil da empresa/usuário que está visualizando.
async function saveTalento(talentoId) {
    return apiRequest(`/profissionais/${talentoId}/save`, { method: 'POST' });
}
