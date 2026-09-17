// ==========================================================================
// Serviço de API: Configurações - Dados Pessoais / Perfis
// Local: public/src/shared/api/dados-pessoais.js
// ==========================================================================

// Evita erro de sintaxe "Identifier 'API_BASE_URL' has already been declared",
// aproveitando a constante global já definida em auth.js/_http.js
var API_URL = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : 'http://localhost:8080';

/**
 * Função utilitária para requisições de salvamento (POST) com cookies de sessão.
 *
 * Remove explicitamente o tipoPerfil do corpo antes de enviar: esse campo é
 * só do front (decide a rota); o back só deve receber tipoPessoa. Isso fica
 * garantido aqui, independente do que o chamador colocar em `dados`.
 */
async function sendProfileRequest(endpoint, dados) {

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Envia o cookie de sessão do PHP
            body: JSON.stringify(dados)
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.message || `Erro ao salvar dados no endpoint ${endpoint}`);
        }

        return { success: true, data };
    } catch (error) {
        console.error(`[API DadosPessoais] Erro em ${endpoint}:`, error.message);
        return { success: false, message: error.message };
    }
}

/**
 * Salva os dados de perfil comum (Pessoa Física geral / usuário base)
 * Endpoint: POST /perfil
 */
async function salvarPerfilComum(dados) {
    sendProfileRequest('/portfolio', dados);
    return sendProfileRequest('/perfil/me', dados);
}

/**
 * Salva os dados específicos de estudante / universitário
 * Endpoint: POST /perfil/universitario
 */
async function salvarPerfilUniversitario(dados) {
    sendProfileRequest('/portfolio', dados);
    sendProfileRequest('/perfil/me', dados);
    return sendProfileRequest('/perfil/universitario/me', dados);
}

/**
 * Salva os dados específicos do profissional habilitado (CREA/CAU)
 * Endpoint: POST /perfil/profissional
 */
async function salvarPerfilProfissional(dados) {
    sendProfileRequest('/portfolio', dados);
    sendProfileRequest('/perfil/me', dados);
    return sendProfileRequest('/perfil/profissional/me', dados);
}

/**
 * Salva os dados específicos de Pessoa Jurídica / Empresa
 * Endpoint: POST /perfil/empresa
 */
async function salvarPerfilEmpresa(dados) {
    sendProfileRequest('/portfolio', dados);
    sendProfileRequest('/perfil/me', dados);
    return sendProfileRequest('/perfil/empresa', dados);
}

/**
 * Função despachante principal:
 * Decide qual endpoint chamar com base no tipoPerfil informado pelo front.
 * tipoPerfil é usado só aqui, pra escolher a rota — nunca é incluído no
 * corpo da requisição (ver sendProfileRequest, que descarta esse campo).
 *
 * @param {Object} dados - Campos do formulário + tipoPessoa
 * @param {string} tipoPerfil - 'universitario', 'profissional', 'empresa' ou 'comum'
 */
async function salvarDadosPessoais(dados, tipoPerfil) {
    const tipo = (tipoPerfil || '').toLowerCase();

    switch (tipo) {
        case 'universitario':
        case 'estudante':
            return salvarPerfilUniversitario(dados);

        case 'profissional':
            return salvarPerfilProfissional(dados);

        case 'empresa':
            return salvarPerfilEmpresa(dados);

        case 'comum':
        default:
            return salvarPerfilComum(dados);
    }
}

/**
 * Busca dados atuais do usuário para pré-carregamento.
 * Também roteado por tipoPerfil, pelo mesmo motivo do salvar.
 */
async function carregarDadosPessoais(tipoPerfil = null) {

    try {
        const response = await fetch(`${API_URL}/portfolio/me`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) return { success: false };

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        return { success: false, message: error.message };
    }
}
// Exporta explicitamente para o escopo global (window)
window.salvarDadosPessoais = salvarDadosPessoais;
window.carregarDadosPessoais = carregarDadosPessoais;
window.salvarPerfilComum = salvarPerfilComum;
window.salvarPerfilUniversitario = salvarPerfilUniversitario;
window.salvarPerfilProfissional = salvarPerfilProfissional;
window.salvarPerfilEmpresa = salvarPerfilEmpresa;