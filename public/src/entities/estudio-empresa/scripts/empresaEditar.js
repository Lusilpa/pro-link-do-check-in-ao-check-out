(function () {
    var form = document.getElementById('formEditarEmpresa');
    var btn = document.getElementById('btn-salvar-empresa');
    var feedback = document.getElementById('empresaEditar-feedback');

    if (!form) return;

    // TODO: Popular campos ao carregar a página
    // fetch('/api/pessoa-juridica/' + empresaId, {
    //   headers: { 'Authorization': 'Bearer ' + token }
    // })
    // .then(res => res.json())
    // .then(data => {
    //   form.razao_social.value  = data.razao_social;
    //   form.nome_fantasia.value = data.nome_fantasia || '';
    //   document.getElementById('empresa-cnpj').value = data.cnpj;
    //   form.nome.value      = data.nome;
    //   form.email.value     = data.email;
    //   form.telefone.value  = data.telefone;
    // });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        var payload = {
            razao_social: form.razao_social.value.trim(),
            nome_fantasia: form.nome_fantasia.value.trim() || null,
            nome: form.nome.value.trim(),
            email: form.email.value.trim(),
            telefone: form.telefone.value.trim()
        };

        btn.disabled = true;
        btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Salvando...';

        // TODO: Substituir pelo fetch real
        // fetch('/api/pessoa-juridica/' + empresaId, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        //   body: JSON.stringify(payload)
        // })
        // .then(res => { if (!res.ok) throw new Error(res.statusText); return res.json(); })
        // .then(() => { onSuccess(); })
        // .catch(err => { onError(err.message); });

        // Simulação temporária
        setTimeout(function () { onSuccess(); }, 800);

        function onSuccess() {
            btn.innerHTML = '<i class="bi bi-check-circle"></i> Salvo!';
            btn.style.color = '#00d278';
            btn.style.borderColor = '#00d278';
            feedback.classList.remove('d-none', 'pl-estudio-sub-alert--warning');
            feedback.innerHTML = '<i class="bi bi-check-circle"></i> <span>Dados atualizados com sucesso.</span>';
            setTimeout(function () {
                btn.disabled = false;
                btn.innerHTML = '<i class="bi bi-check2-square"></i> Salvar Alterações';
                btn.style.color = '';
                btn.style.borderColor = '';
            }, 2000);
        }

        function onError(msg) {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-check2-square"></i> Salvar Alterações';
            feedback.classList.remove('d-none');
            feedback.classList.add('pl-estudio-sub-alert--warning');
            feedback.innerHTML = '<i class="bi bi-exclamation-triangle"></i> <span>Erro: ' + msg + '</span>';
        }
    });
})();