(function initCompanyProfile() {
    const actionEdit    = document.getElementById('actionEditProfile');
    const actionVerify  = document.getElementById('actionVerifyCompany');

    if (actionEdit) {
        actionEdit.addEventListener('click', () => {
            window.location.hash = '#empresa-editar';
        });
    }

    if (actionVerify) {
        actionVerify.addEventListener('click', () => {
            window.location.hash = '#empresa-validar';
        });
    }
})();
