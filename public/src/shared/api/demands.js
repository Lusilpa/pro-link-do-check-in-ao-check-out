// Serviço de API: Demandas
// Gestão de Oportunidades
// Concentra toda a lógica de comunicação com o back-end para entidades do tipo 'Demanda'. Depende de _http.js para transporte.

// Dados Sintéticos
// Fallback local (Mock)
// Utilizado temporariamente enquanto a API real não está integrada. Garante que a UI possa ser desenvolvida e testada.
const DEMANDS_MOCK = [
    {
        id: 1, company: 'Tapajós Engenharia e Construções', time: '5 min',
        title: 'Elaboração e Emissão de ART para Projeto Estrutural de Galpão Logístico',
        subtitle: 'Engenharia Civil • Demanda Qualificada Indústria 5.0',
        description: 'Precisamos de profissional habilitado junto ao CREA-AM para elaboração de projeto estrutural detalhado e emissão de ART correspondente para execução de galpão logístico na zona industrial de Manaus.',
        area: 'Engenharia Civil', tipo: 'projeto', modalidade: 'presencial',
        cidade: 'Manaus, AM', prazo: 'curto', status: 'aberta', interessados: 12
    },
    {
        id: 2, company: 'Amazônia Soluções Ambientais', time: '2h',
        title: 'Estudo de Impacto Ambiental (EIA/RIMA) para Implantação de Planta Solar',
        subtitle: 'Engenharia Ambiental • Licenciamento IPAAM',
        description: 'Consultoria técnica especializada para elaboração de EIA/RIMA visando implantação de parque de energia solar em área de transição no Amazonas.',
        area: 'Agronomia', tipo: 'consultoria', modalidade: 'hibrido',
        cidade: 'Itacoatiara, AM', prazo: 'medio', status: 'aberta', interessados: 27
    },
    {
        id: 3, company: 'Manaus Geotecnia & Sondagens', time: '1d',
        title: 'Laudo Técnico de Investigação Geológica e Teste de Permeabilidade do Solo',
        subtitle: 'Geologia e Minas • Fundações',
        description: 'Execução de ensaios SPT e emissão de laudo geológico para sondagem de solo em terreno urbano de grande porte na zona leste da cidade.',
        area: 'Geologia e Minas', tipo: 'pericia', modalidade: 'presencial',
        cidade: 'Manaus, AM', prazo: 'curto', status: 'em_andamento', interessados: 8
    },
    {
        id: 4, company: 'Equatorial Topografia e Agrimensura', time: '3d',
        title: 'Georreferenciamento de Imóvel Rural com Certificação INCRA',
        subtitle: 'Engenharia Florestal / Agrimensura',
        description: 'Serviço de georreferenciamento de perímetro rural localizado no interior do Estado, incluindo montagem de processo completo para SIGEF/INCRA.',
        area: 'Engenharia Florestal', tipo: 'art', modalidade: 'presencial',
        cidade: 'Parintins, AM', prazo: 'longo', status: 'aberta', interessados: 5
    },
    {
        id: 5, company: 'UFAM — Universidade Federal do Amazonas', time: '1d',
        title: 'Estágio em Engenharia Elétrica — Laboratório de Sistemas Embarcados',
        subtitle: 'Engenharia Elétrica • Estágio Supervisionado',
        description: 'Vaga de estágio remunerado para estudante de Engenharia Elétrica com conhecimento em microcontroladores (Arduino/ESP32) e sistemas de automação.',
        area: 'Engenharia Elétrica', tipo: 'estagio', modalidade: 'presencial',
        cidade: 'Manaus, AM', prazo: 'longo', status: 'aberta', interessados: 41
    },
    {
        id: 6, company: 'CREA-AM — Conselho Regional', time: '5d',
        title: 'Mentoria para Jovens Profissionais — Ciclo 2026 de Engenharia de Produção',
        subtitle: 'Engenharia de Produção • Programa de Desenvolvimento',
        description: 'Profissional sênior da área de Engenharia de Produção para orientar grupo de 8 estagiários recém-formados em boas práticas e ética profissional.',
        area: 'Engenharia de Produção', tipo: 'mentoria', modalidade: 'remoto',
        cidade: 'Manaus, AM', prazo: 'medio', status: 'aberta', interessados: 19
    },
    {
        id: 7, company: 'Instituto de Tecnologia da Amazônia', time: '1sem',
        title: 'Pesquisador Associado — Projeto de Retrofit de Edificações Históricas',
        subtitle: 'Arquitetura e Urbanismo • Patrimônio Histórico',
        description: 'Participação em projeto de pesquisa aplicada sobre técnicas de retrofit e requalificação energética de edificações tombadas no centro histórico de Manaus.',
        area: 'Arquitetura', tipo: 'pesquisa', modalidade: 'hibrido',
        cidade: 'Manaus, AM', prazo: 'longo', status: 'aberta', interessados: 14
    }
];

// Buscar Demandas
// Lista todas as oportunidades
// Utiliza a API base para consultar o endpoint '/demands' com filtros dinâmicos via URLSearchParams. Retorna o mock em caso de falha de conexão.
async function fetchAllDemands(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const endpoint = `/demands${params ? `?${params}` : ''}`;
    try {
        return await apiRequest(endpoint);
    } catch (error) {
        console.warn('[Pro-Link API] Demandas indisponíveis. Usando dados sintéticos.');
        return DEMANDS_MOCK;
    }
}

// Detalhes da Demanda
// Busca demanda por ID
// Tenta buscar os dados detalhados de uma demanda específica. Se falhar, procura dentro da base de mock sintético.
async function fetchDemandById(id) {
    try {
        return await apiRequest(`/demands/${id}`);
    } catch (error) {
        console.warn(`[Pro-Link API] Demanda #${id} não encontrada. Usando fallback.`);
        return DEMANDS_MOCK.find(d => d.id === Number(id)) || null;
    }
}

// Expressar Interesse
// Registro de candidatura
// Envia um POST sinalizando o interesse do usuário na demanda especificada.
async function expressInterestInDemand(demandId) {
    return apiRequest(`/demands/${demandId}/interest`, { method: 'POST' });
}

// Criar Demanda
// Abertura de nova oportunidade
// Utilizado pelas empresas no painel para registrar uma nova vaga ou serviço no back-end.
async function createDemand(demandData) {
    return apiRequest('/demands', {
        method: 'POST',
        body: JSON.stringify(demandData)
    });
}

// Atualizar Demanda
// Edição de oportunidade
// Substitui os dados da demanda (PUT) com as informações fornecidas no objeto updates.
async function updateDemand(id, updates) {
    return apiRequest(`/demands/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
    });
}

// Excluir Demanda
// Remoção de oportunidade
// Envia requisição DELETE para remover a demanda de forma permanente do banco de dados.
async function deleteDemand(id) {
    return apiRequest(`/demands/${id}`, { method: 'DELETE' });
}