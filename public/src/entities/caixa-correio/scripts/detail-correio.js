window.initDetailCorreio = function(mailData = null) {
    if (!mailData) {
        mailData = {
            id: 1, senderName: "Empresa Tapajós", senderEmail: "rh@tapajos.com",
            subject: "Proposta de Demanda: Automação de RH",
            body: "Olá Luan,\n\nVimos o seu portfólio na plataforma Pro-Link e ficamos impressionados com seus projetos em Python e React.\n\nGostaríamos de propor uma parceria para o desenvolvimento de um sistema multi-agente focado no nosso Departamento Pessoal. Anexamos um PDF com o escopo inicial para você dar uma olhada.\n\nAguardo retorno,\nEquipe Tapajós",
            date: "Hoje, 10:30 AM",
            attachments: [{ id: 101, name: "Escopo_Automacao_RH.pdf", type: "pdf" }]
        };
    }

    document.getElementById('dmSenderName').textContent = mailData.senderName;
    // Pega a primeira letra do nome para o Avatar
    document.getElementById('dmAvatarInitial').textContent = mailData.senderName.charAt(0).toUpperCase();
    
    document.getElementById('dmSenderEmail').textContent = mailData.senderEmail;
    document.getElementById('dmDate').textContent = mailData.date;
    document.getElementById('dmSubject').textContent = mailData.subject;
    // [SEGURANÇA C1 CORRIGIDO] Nunca usar innerHTML com dado de back-end.
    // Convertemos \n → <br> via DOM seguro, sem abrir vetor XSS.
    const bodyEl = document.getElementById('dmBodyText');
    bodyEl.innerHTML = '';
    mailData.body.split('\n').forEach((line, i, arr) => {
        bodyEl.appendChild(document.createTextNode(line));
        if (i < arr.length - 1) bodyEl.appendChild(document.createElement('br'));
    });

    const attZone = document.getElementById('dmAttachmentsZone');
    const attList = document.getElementById('dmAttachmentsList');
    
    if (mailData.attachments && mailData.attachments.length > 0) {
        attZone.style.display = 'block';
        attList.innerHTML = '';
        // [SEGURANÇA] Usar textContent para nomes de anexos — evita XSS via nome de arquivo malicioso
        mailData.attachments.forEach(att => {
            const item = document.createElement('div');
            item.className = 'pl-dm-att-item';
            const icon = document.createElement('i');
            icon.className = 'bi bi-file-earmark-pdf-fill';
            icon.setAttribute('aria-hidden', 'true');
            const name = document.createElement('span');
            name.textContent = att.name; // textContent — seguro contra XSS
            item.appendChild(icon);
            item.appendChild(name);
            attList.appendChild(item);
        });
    } else {
        attZone.style.display = 'none'; attList.innerHTML = '';
    }

    const btnClose = document.getElementById('closeDetailMailPanel');
    if (btnClose) {
        const newBtnClose = btnClose.cloneNode(true);
        btnClose.parentNode.replaceChild(newBtnClose, btnClose);
        newBtnClose.addEventListener('click', () => { document.dispatchEvent(new CustomEvent('prolink:close-mail-read')); });
    }

    const btnReply = document.getElementById('btnReplyMail');
    if (btnReply) {
        const newBtnReply = btnReply.cloneNode(true);
        btnReply.parentNode.replaceChild(newBtnReply, btnReply);
        newBtnReply.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('prolink:open-mail-compose', {
                detail: { replyTo: mailData.senderEmail, originalSubject: mailData.subject }
            }));
        });
    }

    // Delete Button action -> Toast
    const btnDelete = document.getElementById('btnDeleteMail');
    if(btnDelete) {
        const newBtnDelete = btnDelete.cloneNode(true);
        btnDelete.parentNode.replaceChild(newBtnDelete, btnDelete);
        newBtnDelete.addEventListener('click', () => {
            if(window.prolinkToast) window.prolinkToast('Mensagem excluída.', 'error');
            setTimeout(() => document.dispatchEvent(new CustomEvent('prolink:close-mail-read')), 300);
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { if(typeof window.initDetailCorreio === 'function') window.initDetailCorreio(); });
} else {
    setTimeout(() => { if(typeof window.initDetailCorreio === 'function') window.initDetailCorreio(); }, 100);
}