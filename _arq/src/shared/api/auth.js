// ==========================================
// API SERVICE: Autenticação
// ==========================================

const API_BASE_URL = "http://localhost:8080/api"; // Ajuste para a URL real do seu back-end

/**
 * Realiza o login do usuário enviando as credenciais para o back-end.
 * @param {Object} credentials - Objeto contendo username/email e password.
 * @returns {Promise<Object>} Retorna o resultado com sucesso e dados ou mensagem de erro.
 */
async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao realizar login no sistema.");
    }

    // Armazena os dados de sessão no localStorage do navegador
    if (data.token) {
      localStorage.setItem("prolink_token", data.token);
      localStorage.setItem("prolink_user", JSON.stringify(data.user || {}));
    }

    return { success: true, data };
  } catch (error) {
    console.error("Erro na requisição de login:", error);
    return { success: false, message: error.message };
  }
}

/**
 * Inicia o fluxo de autenticação social via Google redirecionando para o Back-end.
 */
function loginWithGoogle() {
  window.location.href = `${API_BASE_URL}/auth/google`;
}

/**
 * Inicia o fluxo de autenticação social via LinkedIn redirecionando para o Back-end.
 */
function loginWithLinkedIn() {
  window.location.href = `${API_BASE_URL}/auth/linkedin`;
}

/**
 * Realiza o logout do usuário limpando o armazenamento local.
 */
function logoutUser() {
  localStorage.removeItem("prolink_token");
  localStorage.removeItem("prolink_user");
  window.location.hash = "#auth"; // Redireciona para a tela de login
}

/**
 * Verifica se o usuário está autenticado checando a presença do token.
 * @returns {boolean}
 */
function isUserAuthenticated() {
  return !!localStorage.getItem("prolink_token");
}

/**
 * Realiza o cadastro de um novo usuário enviando os dados do formulário.
 * Usa FormData para suportar upload de arquivos (ex: comprovante de matrícula).
 * @param {FormData} formData - Dados completos do formulário de cadastro.
 * @returns {Promise<Object>} Retorna o resultado com sucesso ou mensagem de erro.
 */
async function registerUser(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      body: formData
      // Não definir Content-Type manualmente: o browser faz isso automaticamente com o boundary correto para multipart/form-data
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao realizar o cadastro.");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Erro na requisição de cadastro:", error);
    return { success: false, message: error.message };
  }
}