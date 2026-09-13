(function initPortfolioManagement() {
    const btnCreate   = document.getElementById('actionCreatePortfolio');
    const btnEdit     = document.getElementById('actionEditPortfolio');
    const btnValidate = document.getElementById('actionValidatePortfolio');

    if (btnCreate) {
        btnCreate.addEventListener('click', () => {
            window.location.hash = '#portfolio-criar';
        });
    }

    if (btnEdit) {
        btnEdit.addEventListener('click', () => {
            window.location.hash = '#portfolio-editar';
        });
    }

    if (btnValidate) {
        btnValidate.addEventListener('click', () => {
            window.location.hash = '#portfolio-validar';
        });
    }
})();