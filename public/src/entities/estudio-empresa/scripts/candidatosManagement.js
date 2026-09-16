(function() {
    const btnAnalyze = document.getElementById('actionAnalyzeCandidates');

    if (btnAnalyze) {
        btnAnalyze.addEventListener('click', () => {
            window.location.hash = '#candidatos-analisar';
        });
    }
})();
