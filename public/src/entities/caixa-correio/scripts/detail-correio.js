window.initDetailCorreio = async function(cartaId = null) {
    const carta = cartaId !== null ? await fetchCartaVirtualById(cartaId) : null;

    if (!carta) {
        document.getElementById('dmSenderName').textContent = 'Carta não encontrada';
        document.getElementById('dmAvatarInitial').textContent = '?';
        document.getElementById('dmSenderEmail').textContent = '';
        document.getElementById('dmDate').textContent = '';
        document.getElementById('dmSubject').textContent = '';
        document.getElementById('dmBodyText').textContent = '';
        document.getElementById('dmAttachmentsZone').style.display = 'none';
        return;
    }

    document.getElementById('dmSenderName').textContent = 'Para: ' + carta.destinatarioEmail;
    document.getElementById('dmAvatarInitial').textContent = carta.destinatarioEmail.charAt(0).toUpperCase();
    document.getElementById('dmSenderEmail').textContent = carta.remetenteEmail ? `De: ${carta.remetenteEmail}` : '';
    document.getElementById('dmDate').textContent = carta.criadoEm
        ? new Date(carta.criadoEm.replace(' ', 'T')).toLocaleString('pt-BR')
        : '';
    document.getElementById('dmSubject').textContent = carta.titulo;

    // legenda e gravada como HTML (o editor de composição suporta negrito/itálico/listas/links).
    const bodyEl = document.getElementById('dmBodyText');
    bodyEl.innerHTML = carta.legenda || '';

    const attZone = document.getElementById('dmAttachmentsZone');
    const attList = document.getElementById('dmAttachmentsList');

    if (carta.nomeArquivo) {
        attZone.style.display = 'block';
        attList.innerHTML = '';
        const item = document.createElement('div');
        item.className = 'pl-dm-att-item';
        const icon = document.createElement('i');
        icon.className = 'bi bi-file-earmark-pdf-fill';
        icon.setAttribute('aria-hidden', 'true');
        const name = document.createElement('span');
        name.textContent = carta.nomeArquivo; // textContent — seguro contra XSS
        item.appendChild(icon);
        item.appendChild(name);
        attList.appendChild(item);
    } else {
        attZone.style.display = 'none';
        attList.innerHTML = '';
    }

    const btnClose = document.getElementById('closeDetailMailPanel');
    if (btnClose) {
        const newBtnClose = btnClose.cloneNode(true);
        btnClose.parentNode.replaceChild(newBtnClose, btnClose);
        newBtnClose.addEventListener('click', () => { document.dispatchEvent(new CustomEvent('prolink:close-mail-read')); });
    }

    // "Responder" não se aplica a uma carta que você mesmo enviou (o destinatário é
    // externo) — reaproveitado como atalho para compor uma nova carta ao mesmo e-mail.
    const btnReply = document.getElementById('btnReplyMail');
    if (btnReply) {
        btnReply.innerHTML = '<i class="bi bi-pencil-square" aria-hidden="true"></i> Nova carta';
        const newBtnReply = btnReply.cloneNode(true);
        btnReply.parentNode.replaceChild(newBtnReply, btnReply);
        newBtnReply.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('prolink:open-mail-compose', {
                detail: { replyTo: carta.destinatarioEmail, originalSubject: carta.titulo }
            }));
        });
    }

    // Excluir agora chama a API de verdade (POST /cartas-virtuais/{id}/remover).
    const btnDelete = document.getElementById('btnDeleteMail');
    if (btnDelete) {
        const newBtnDelete = btnDelete.cloneNode(true);
        btnDelete.parentNode.replaceChild(newBtnDelete, btnDelete);
        newBtnDelete.addEventListener('click', async () => {
            try {
                await deleteCartaVirtual(carta.id);
                if (window.prolinkToast) window.prolinkToast('Carta removida.');
                if (typeof window.refreshCorreioList === 'function') window.refreshCorreioList();
                setTimeout(() => document.dispatchEvent(new CustomEvent('prolink:close-mail-read')), 300);
            } catch (error) {
                if (window.prolinkToast) window.prolinkToast(error.message || 'Erro ao remover carta.', 'error');
            }
        });
    }
};
