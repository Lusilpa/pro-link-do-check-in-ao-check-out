(function () {
    const form = document.getElementById('formCriarDemanda');
    const btn = document.getElementById('btn-publicar-demanda');
    const feedback = document.getElementById('demandaCriar-feedback');

    if (!form) return;

    form.addEventListener('submit', async function (e) {
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

        const originalBtnHTML = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Publicando...';

        try {
            // Usa apiRequest do _http.js (que envia cookies automaticamente)
            const data = await apiRequest('/demandas', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            // Sucesso
            btn.innerHTML = '<i class="bi bi-check-circle"></i> Demanda Publicada!';
            btn.style.color = '#00d278';
            btn.style.borderColor = '#00d278';
            
            feedback.classList.remove('d-none', 'pl-estudio-sub-alert--warning');
            feedback.innerHTML = `<i class="bi bi-check-circle"></i> <span>Demanda criada com sucesso (ID: ${data?.id || '—'}).</span>`;
            
            setTimeout(() => { 
                window.location.hash = '#painel-empresa'; 
            }, 1500);

        } catch (error) {
            console.error("Falha ao publicar demanda:", error);
            btn.disabled = false;
            btn.innerHTML = originalBtnHTML;
            
            feedback.classList.remove('d-none');
            feedback.classList.add('pl-estudio-sub-alert--warning');
            feedback.innerHTML = `<i class="bi bi-exclamation-triangle"></i> <span>Erro ao publicar: ${error.message}</span>`;
        }
    });
})();