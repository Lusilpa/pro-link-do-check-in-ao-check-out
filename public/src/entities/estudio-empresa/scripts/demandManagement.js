(function initDemandManagement() {
    const actionCreate = document.getElementById('actionCreateDemand');
    const actionEdit   = document.getElementById('actionEditDemand');
    const actionClose  = document.getElementById('actionCloseDemand');

    if (actionCreate) {
        actionCreate.addEventListener('click', () => {
            window.location.hash = '#demanda-criar';
        });
    }

    if (actionEdit) {
        actionEdit.addEventListener('click', () => {
            window.location.hash = '#demanda-gerenciar';
        });
    }

    if (actionClose) {
        actionClose.addEventListener('click', () => {
            window.location.hash = '#demanda-encerrar';
        });
    }
})();
