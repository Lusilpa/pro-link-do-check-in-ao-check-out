(function initPostManagement() {
    const actionCreate = document.getElementById('actionCreatePost');
    const actionEdit   = document.getElementById('actionEditPost');
    const actionDelete = document.getElementById('actionDeletePost');

    if (actionCreate) {
        actionCreate.addEventListener('click', () => {
            window.location.hash = '#post-criar';
        });
    }

    if (actionEdit) {
        actionEdit.addEventListener('click', () => {
            window.location.hash = '#post-editar';
        });
    }

    if (actionDelete) {
        actionDelete.addEventListener('click', () => {
            window.location.hash = '#post-deletar';
        });
    }
})();