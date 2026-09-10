/**
 * Envia uma solicitação de recuperação de senha para o e-mail informado.
 * @param {string} email - E-mail do usuário cadastrado.
 * @returns {Promise<Object>} Retorna sucesso ou mensagem de erro.
 */
async function recoverPassword(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/recover-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao solicitar recuperação de senha.");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Erro na recuperação de senha:", error);
    return { success: false, message: error.message };
  }
}