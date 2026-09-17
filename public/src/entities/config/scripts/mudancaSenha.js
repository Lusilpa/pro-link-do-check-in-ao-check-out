// ==========================================================================
// Script: Mudança de Senha
// Local: public/src/entities/config/scripts/mudancaSenha.js
// ==========================================================================

(function () {
    // ----------------------------------------------------------------------
    // 1. Elementos do Formulário (vindos de mudancaSenha.html)
    // ----------------------------------------------------------------------
    const inputSenhaAtual = document.getElementById('cfg-senha-atual');
    const inputNovaSenha = document.getElementById('cfg-nova-senha');
    const inputConfirmarSenha = document.getElementById('cfg-confirmar-senha');
    const btnAlterarSenha = document.getElementById('btn-alterar-senha');

    if (!btnAlterarSenha) return;

    // ----------------------------------------------------------------------
    // 2. Função principal para alterar a senha
    // ----------------------------------------------------------------------
    async function handleAlterarSenha() {

        const senhaAtualDigitada = inputSenhaAtual ? inputSenhaAtual.value.trim() : '';
        const novaSenha = inputNovaSenha ? inputNovaSenha.value.trim() : '';
        const confirmarSenha = inputConfirmarSenha ? inputConfirmarSenha.value.trim() : '';

        // Validações básicas de preenchimento
        if (!senhaAtualDigitada || !novaSenha || !confirmarSenha) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (novaSenha !== confirmarSenha) {
            alert('A nova senha e a confirmação não coincidem.');
            return;
        }

        if (novaSenha.length < 4) {
            alert('A nova senha deve ter no mínimo 4 caracteres.');
            return;
        }

        try {
            btnAlterarSenha.disabled = true;
            btnAlterarSenha.textContent = 'Processando...';

            const result = await alterarSenhaUsuarioAPI({ senha_atual: senhaAtualDigitada, nova_senha: novaSenha });

            if (result && result.success) {
                alert('Senha alterada com sucesso!');

                // Limpa os campos do formulário após o sucesso
                if (inputSenhaAtual) inputSenhaAtual.value = '';
                if (inputNovaSenha) inputNovaSenha.value = '';
                if (inputConfirmarSenha) inputConfirmarSenha.value = '';
            } else {
                alert(result && result.message ? result.message : 'Erro ao alterar a senha.');
            }

        } catch (error) {
            console.error('[Mudança de Senha] Erro:', error);
            alert('Erro ao tentar alterar a senha. Verifique a conexão com a API.');
        } finally {
            btnAlterarSenha.disabled = false;
            btnAlterarSenha.innerHTML = '<i class="bi bi-check-lg"></i> Alterar Senha';
        }
    }

    // ----------------------------------------------------------------------
    // 3. Ouvinte do botão de salvar
    // ----------------------------------------------------------------------
    btnAlterarSenha.addEventListener('click', handleAlterarSenha);
})();