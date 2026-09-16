(function () {
    const form = document.getElementById('formCriarDemanda');
    const btn = document.getElementById('btn-publicar-demanda');
    const feedback = document.getElementById('demandaCriar-feedback');

    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const payload = {
            titulo: form.titulo.value.trim(),
            descricao: form.descricao.value.trim(),
            area_demanda: form.area_demanda.value.trim(),
            tipo_demanda: form.tipo_demanda.value,
            modalidade: form.modalidade.value,
            cidade_demanda: form.cidade_demanda.value.trim(),
            uf_demanda: form.uf_demanda.value,
            data_fechamento: form.data_fechamento.value || null
        };

        btn.disabled = true;
        btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Publicando...';

        // fetch('/api/demandas', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        //   body: JSON.stringify(payload)
        // })
        // .then(res => { if (!res.ok) throw new Error(res.statusText); return res.json(); })
        // .then(data => { onSuccess(data); })
        // .catch(err => { onError(err.message); });

        setTimeout(() => {
            onSuccess({ id: 999 });
        }, 800);

        function onSuccess(data) {
            btn.innerHTML = '<i class="bi bi-check-circle"></i> Demanda Publicada!';
            btn.style.color = '#00d278';
            btn.style.borderColor = '#00d278';
            feedback.classList.remove('d-none', 'pl-estudio-sub-alert--warning');
            feedback.innerHTML = '<i class="bi bi-check-circle"></i> <span>Demanda criada com sucesso (ID: ' + (data.id || '—') + ').</span>';
            setTimeout(() => { window.location.hash = '#painel-empresa'; }, 1500);
        }

        function onError(msg) {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-megaphone"></i> Publicar Demanda';
            feedback.classList.remove('d-none');
            feedback.classList.add('pl-estudio-sub-alert--warning');
            feedback.innerHTML = '<i class="bi bi-exclamation-triangle"></i> <span>Erro: ' + msg + '</span>';
        }
    });
})();