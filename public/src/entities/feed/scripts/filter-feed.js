function initProLinkFilter() {
    const mockAreasCrea = [
        { id: 1, name: "Engenharia Civil" },
        { id: 2, name: "Engenharia Elétrica" },
        { id: 3, name: "Engenharia Mecânica" },
        { id: 4, name: "Agronomia" },
        { id: 5, name: "Engenharia Florestal" },
        { id: 6, name: "Geologia e Minas" },
        { id: 7, name: "Engenharia Química" },
        { id: 8, name: "Segurança do Trabalho" }
    ];

    // Injeta as áreas do CREA em todos os filtros renderizados
    document.querySelectorAll('.filterArea').forEach(areaSelect => {
        if(areaSelect.children.length > 1) return; // Evita duplicar opções
        
        mockAreasCrea.forEach(area => {
            const option = document.createElement('option');
            option.value = area.name;
            option.textContent = area.name;
            areaSelect.appendChild(option);
        });
    });

    // Lógica inteligente de clique para o botão "Aplicar"
    document.querySelectorAll('.btnApplyFilter').forEach(btn => {
        // Clonamos o botão para evitar que cliques sejam registrados duas vezes
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', function(e) {
            // e.target.closest encontra exatamente de qual menu (desktop ou mobile) o clique veio
            const widget = e.target.closest('.pl-filter-widget');
            const grau = widget.querySelector('.filterGrau').value;
            const area = widget.querySelector('.filterArea').value;
            const cronologia = widget.querySelector('.filterCronologia').value;
            
            // Filtros aplicados — ordenação e visibilidade atualizada
        });
    });

    // Lógica inteligente de clique para o botão "Limpar"
    document.querySelectorAll('.btnClearFilter').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', function(e) {
            const widget = e.target.closest('.pl-filter-widget');
            widget.querySelector('.filterGrau').value = "";
            widget.querySelector('.filterArea').value = "";
            widget.querySelector('.filterCronologia').value = "desc";
            
        });
    });
}

initProLinkFilter();