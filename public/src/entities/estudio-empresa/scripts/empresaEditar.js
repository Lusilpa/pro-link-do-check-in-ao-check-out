(function () {
    const form = document.getElementById('formEditarEmpresa');
    const btn = document.getElementById('btn-salvar-empresa');
    const feedback = document.getElementById('empresaEditar-feedback');

    const user = typeof getAuthUser === 'function' ? getAuthUser() : null;
    const empresaId = user ? user.id : '1';

    if (!form) return;

    async function loadEmpresaData() {
        try {
            const data = await apiRequest(`/perfil/${empresaId}`, {
                method: 'GET'
            });

            form.razao_social.value  = data?.razao_social || '';
            form.nome_fantasia.value = data?.nome_fantasia || '';
            const cnpjInput = document.getElementById('empresa-cnpj');
            if (cnpjInput) cnpjInput.value = data?.cnpj || '';
            form.nome.value      = data?.nome || '';
            form.email.value     = data?.email || '';
            form.telefone.value  = data?.telefone || '';
            
        } catch (error) {
            console.error("Falha ao carregar dados da empresa:", error);
        }
    }

    loadEmpresaData();

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const payload = {
            razao_social: form.razao_social.value.trim(),
            nome_fantasia: form.nome_fantasia.value.trim() || null,
            nome: form.nome.value.trim(),
            email: form.email.value.trim(),
            telefone: form.telefone.value.trim()
        };

        const originalBtnHTML = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';

        try {
            await apiRequest(`/perfil`, {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            // Sucesso
            btn.innerHTML = '<i class="bi bi-check-circle"></i> Salvo!';
            btn.style.color = '#00d278';
            btn.style.borderColor = '#00d278';
            
            feedback.classList.remove('d-none', 'pl-estudio-sub-alert--warning');
            feedback.innerHTML = '<i class="bi bi-check-circle"></i> <span>Dados atualizados com sucesso.</span>';
            
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalBtnHTML;
                btn.style.color = '';
                btn.style.borderColor = '';
            }, 2500);

        } catch (error) {
            console.error("Erro ao salvar perfil da empresa:", error);
            
            btn.disabled = false;
            btn.innerHTML = originalBtnHTML;
            
            feedback.classList.remove('d-none');
            feedback.classList.add('pl-estudio-sub-alert--warning');
            feedback.innerHTML = `<i class="bi bi-exclamation-triangle"></i> <span>Erro ao atualizar os dados: ${error.message}</span>`;
        }
    });
})();