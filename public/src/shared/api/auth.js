// Serviço de API: Autenticação
// Gerenciamento de Sessão
// Consagra funções para login, cadastro, recuperação de senha e autenticação social. Gerencia a persistência da sessão via cookies nativos.

const AUTH_API_BASE_URL = 'http://localhost:8080';

// Constantes
// URL Base da API
// Declarado localmente para que o script de autenticação seja independente de _http.js.


async function getCsrfToken() {
    const response = await fetch(`${AUTH_API_BASE_URL}/csrf-token`, {
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Não foi possível iniciar a sessão segura.');
    const data = await response.json();
    return data.csrf_token;
}

// Obter Usuário Logado
// Leitura de Perfil Local
// Retorna os dados do usuário autenticado no momento, parseando do sessionStorage. Retorna null em caso de falha no parse.
function getAuthUser() {
    try {
        return JSON.parse(sessionStorage.getItem('prolink_user'));
    } catch {
        return null;
    }
}

// Checagem de Sessão
// Valida se há usuário logado
// Retorna booleano confirmando se há um usuário na sessão local (o cookie de sessão real é gerenciado pelo back/browser).
function isUserAuthenticated() {
    return !!sessionStorage.getItem('prolink_user');
}

// Login de Usuário
// Autenticação via Credenciais
// Envia e-mail e senha para o servidor com credentials incluídas.
async function loginUser(credentials) {
    try {
        const csrfToken = await getCsrfToken();
        const response = await fetch(`${AUTH_API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            credentials: 'include', // Necessário para salvar o cookie de sessão do PHP
            body: JSON.stringify(credentials)
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok) {
            // O cookie HttpOnly continua sendo a fonte real de autenticação.
            // O sessionStorage guarda apenas dados de apresentação retornados pelo servidor.
            if (data.user) {
                sessionStorage.setItem('prolink_user', JSON.stringify(data.user));
            }
            return { success: true, user: data.user ?? null };
        }

        throw new Error(data.message || 'Erro ao realizar login.');
    } catch (error) {
        console.error('[Auth] Erro no login:', error.message);
        return { success: false, message: error.message };
    }
}

// Cadastro de Usuário
// Criação de nova conta
async function registerUser(formData) {
    try {
        const csrfToken = await getCsrfToken();
        const response = await fetch(`${AUTH_API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'X-CSRF-Token': csrfToken },
            credentials: 'include', // Importante para manter a sessão e validar CSRF
            body: formData // Não definir Content-Type: browser define boundary automaticamente
        });

        if (response.redirected || response.ok) {
            return { success: true };
        }

        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Erro ao realizar o cadastro.');
    } catch (error) {
        console.error('[Auth] Erro no cadastro:', error.message);
        return { success: false, message: error.message };
    }
}

// Recuperar Senha
// Fluxo de redefinição
async function recoverPassword(email) {
    try {
        const csrfToken = await getCsrfToken();
        const response = await fetch(`${AUTH_API_BASE_URL}/recover-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            credentials: 'include',
            body: JSON.stringify({ email })
        });

        if (response.redirected || response.ok) {
            return { success: true };
        }

        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Erro ao solicitar recuperação de senha.');
    } catch (error) {
        console.error('[Auth] Erro na recuperação de senha:', error.message);
        return { success: false, message: error.message };
    }
}


// Redefinir senha usando o token recebido por e-mail.
async function resetPassword(token, password) {
    try {
        const csrfToken = await getCsrfToken();

        const response = await fetch(`${AUTH_API_BASE_URL}/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },
            credentials: 'include',
            body: JSON.stringify({ token, password })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao redefinir a senha.');
        }

        return { success: true };
    } catch (error) {
        console.error('[Auth] Erro ao redefinir senha:', error.message);
        return { success: false, message: error.message };
    }
}
// Login via Google
// OAuth 2.0
function loginWithGoogle() {
    window.location.href = `${AUTH_API_BASE_URL}/auth/google`; // Rotas sociais podem permanecer com /auth/ se criadas depois
}

// Login via LinkedIn
// OAuth 2.0
function loginWithLinkedIn() {
    window.location.href = `${AUTH_API_BASE_URL}/auth/linkedin`;
}

// Logout
// Encerramento de sessão
async function logoutUser() {
    try {
        // Avise o backend para invalidar a sessão
        const csrfToken = await getCsrfToken();
        await fetch(`${AUTH_API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: { 'X-CSRF-Token': csrfToken },
            credentials: 'include'
        });
    } catch (e) {
        console.error('Erro no logout remoto', e);
    }

    // Limpe os dados locais
    sessionStorage.removeItem('prolink_user');
    window.location.hash = '#auth';
}