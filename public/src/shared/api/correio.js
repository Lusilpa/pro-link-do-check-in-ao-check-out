// Serviço de API: Caixa de Correio
// Mensageria Interna
// Responsável por todas as operações da caixa de entrada, leitura de e-mails, envio com suporte a anexos e ações de mensagens lidas/excluídas.

// Dados Sintéticos
// Fallback local (Mock)
// Utilizado temporariamente para garantir o funcionamento da UI da Caixa de Correio enquanto a API real não está integrada.
const CORREIO_MOCK = [
    {
        id: 1,
        sender: 'Empresa Tapajós',
        senderEmail: 'rh@tapajos.com',
        subject: 'Proposta de Demanda: Automação de RH',
        snippet: 'Olá, vimos o seu perfil e gostaríamos de propor uma parceria para o desenvolvimento de um sistema...',
        body: 'Olá Luan,\n\nVimos o seu portfólio na plataforma Pro-Link e ficamos impressionados com seus projetos.\n\nGostaríamos de propor uma parceria para o desenvolvimento de um sistema multi-agente focado no nosso Departamento Pessoal.\n\nAguardo retorno,\nEquipe Tapajós',
        date: '10:30',
        fullDate: 'Hoje, 10:30 AM',
        unread: true,
        attachments: [{ id: 101, name: 'Escopo_Automacao_RH.pdf', type: 'pdf' }]
    },
    {
        id: 2,
        sender: 'CREA-AM',
        senderEmail: 'comunicacao@crea-am.org.br',
        subject: 'Atualização de Acervo Técnico (ART)',
        snippet: 'Sua solicitação de validação da ART número 12345/2026 foi aprovada com sucesso.',
        body: 'Prezado(a),\n\nSua solicitação de validação da ART número 12345/2026 foi aprovada com sucesso. Acesse o portal para baixar o documento.',
        date: 'Ontem',
        fullDate: 'Ontem, 14:00',
        unread: false,
        attachments: []
    },
    {
        id: 3,
        sender: 'UEE-AM',
        senderEmail: 'eventos@uee-am.org.br',
        subject: 'Pauta para o 2º Encontro Nacional',
        snippet: 'Segue em anexo a pauta e a programação para os painéis de tecnologia. Favor revisar até amanhã.',
        body: 'Caros membros,\n\nSegue em anexo a pauta e a programação para os painéis de tecnologia do 2º Encontro Nacional. Favor revisar e confirmar presença até amanhã.',
        date: '10 Set',
        fullDate: '10 Set, 09:00',
        unread: true,
        attachments: [{ id: 201, name: 'Pauta_2Encontro.pdf', type: 'pdf' }]
    }
];

// Buscar Caixa de Entrada
// Listagem de E-mails
// Consome a rota '/correio/inbox' para trazer todas as mensagens destinadas ao usuário logado. Retorna fallback sintético se falhar.
async function fetchInbox() {
    try {
        return await apiRequest('/correio/inbox');
    } catch (error) {
        console.warn('[Pro-Link API] Caixa de correio indisponível. Usando dados sintéticos.');
        return CORREIO_MOCK;
    }
}

// Detalhes da Mensagem
// Leitura Completa
// Traz o e-mail completo através do ID, incluindo corpo detalhado e metadados de anexos.
async function fetchMailById(id) {
    try {
        return await apiRequest(`/correio/${id}`);
    } catch (error) {
        console.warn(`[Pro-Link API] Mensagem #${id} não encontrada. Usando fallback.`);
        return CORREIO_MOCK.find(m => m.id === Number(id)) || null;
    }
}

// Marcar como Lido
// Atualização de Status
// Faz uma requisição PATCH para sinalizar ao back-end que a mensagem foi aberta. Falhas aqui são silenciosas pois a UI já gerencia o estado.
async function markAsRead(id) {
    try {
        await apiRequest(`/correio/${id}/read`, { method: 'PATCH' });
    } catch (error) {
        // Operação silenciosa — UI já reflete o estado
        console.warn(`[Pro-Link API] Falha ao marcar mensagem #${id} como lida.`);
    }
}

// Enviar Mensagem
// Composição de E-mail
// Lida com o envio de mensagens textuais (JSON) ou com múltiplos anexos utilizando FormData. Lê o token manualmente para requisições multipart.
async function sendMail(payload) {
    // Se houver attachments (File), usa FormData
    if (payload.attachments && payload.attachments.length > 0) {
        const formData = new FormData();
        formData.append('to', JSON.stringify(payload.to));
        formData.append('subject', payload.subject);
        formData.append('body', payload.body);
        payload.attachments.forEach((file, i) => formData.append(`attachment_${i}`, file));

        const token = sessionStorage.getItem('prolink_token');
        const response = await fetch(`${API_BASE_URL}/correio/send`, {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: formData
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(data?.message || 'Erro ao enviar mensagem.');
        return data;
    }

    return apiRequest('/correio/send', {
        method: 'POST',
        body: JSON.stringify({
            to: payload.to,
            subject: payload.subject,
            body: payload.body
        })
    });
}

// Excluir Mensagem
// Apagar da Inbox
// Envia um comando DELETE para remover a mensagem permanentemente.
async function deleteMail(id) {
    return apiRequest(`/correio/${id}`, { method: 'DELETE' });
}
