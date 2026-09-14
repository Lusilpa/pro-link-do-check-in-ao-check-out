// Serviço de API: Talentos
// Listagem de Profissionais
// Fornece a camada de integração para buscar profissionais e estudantes universitários cadastrados na base do Pro-Link.

// Dados Sintéticos
// Fallback local (Mock)
// AVISO: os campos `titulo`, `localizacao`, `is_student`, `area`, `instituicao` e `nivel_semestre`
// NÃO existem como colunas diretas nas tabelas do banco.
// Serão retornados pelo backend como campos calculados/derivados via JOIN.
// `habilidades` foi reestruturado para [{nome, nivel}] conforme `profissional_competencias`.
const TALENTOS_MOCK = [
    {
        id: 1,
        nome: 'Luan da Silva Palma',
        // titulo: derivado de `curso` (universitarios) pelo backend
        resumo_profissional: 'Focado no desenvolvimento de sistemas web (React, TypeScript) e back-end (Java/Spring, Python/FastAPI), com interesse em Inteligência Artificial.',
        // is_student: calculado (EXISTS em `universitarios`) pelo backend
        categoria_profissional: 'Engenharia de Software',
        // instituicao: virá via JOIN com `universidades.nome`
        semestre_atual: 4,
        // localizacao: campo não existe no banco — aguardando decisão de schema
        competencias: [
            { nome: 'Python', nivel: 'AVANCADO' },
            { nome: 'React',  nivel: 'AVANCADO' },
            { nome: 'Java',   nivel: 'INTERMEDIARIO' },
            { nome: 'NLP',    nivel: 'BASICO' }
        ]
    },
    {
        id: 2,
        nome: 'Hanna Reis',
        // titulo: derivado de `categoria_profissional` pelo backend
        resumo_profissional: 'Especialista em cálculo estrutural e laudos técnicos de grandes obras de infraestrutura no Polo Industrial de Manaus.',
        // is_student: false (calculado pelo backend)
        numero_registro_confea_crea: 'Ativo',
        categoria_profissional: 'Engenharia Civil',
        // instituicao: organização via `experiencias.organizacao_cliente`
        // localizacao: campo não existe no banco — aguardando decisão de schema
        competencias: [
            { nome: 'AutoCAD',    nivel: 'AVANCADO' },
            { nome: 'Eberick',    nivel: 'AVANCADO' },
            { nome: 'Fundações',  nivel: 'INTERMEDIARIO' }
        ]
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
