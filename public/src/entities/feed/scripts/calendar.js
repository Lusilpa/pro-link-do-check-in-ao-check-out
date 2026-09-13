function renderProLinkCalendar() {
  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const date = new Date(); 
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  const todayDate = date.getDate();

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Varre todos os calendários da tela (tanto Desktop quanto Mobile Offcanvas)
  const widgets = document.querySelectorAll('.pl-calendar-widget');
  
  if (widgets.length === 0) return; // DOM ainda não pronto, o callback do feed.html irá chamar novamente

  widgets.forEach(widget => {
    const monthElement = widget.querySelector('.pl-month-name');
    const daysContainer = widget.querySelector('.pl-calendar-days');

    if (!monthElement || !daysContainer) return;

    monthElement.innerText = months[currentMonth];
    daysContainer.innerHTML = '';

    for (let i = 0; i < firstDay; i++) {
      daysContainer.innerHTML += `<span class="pl-calendar-day pl-empty"></span>`;
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayOfWeek = new Date(currentYear, currentMonth, i).getDay();
      let classes = 'pl-calendar-day';
      
      if (dayOfWeek === 0 || dayOfWeek === 6) classes += ' pl-weekend';
      if (i === todayDate) classes += ' pl-today';

      const formattedDay = i < 10 ? '0' + i : i;
      daysContainer.innerHTML += `<span class="${classes}">${formattedDay}</span>`;
    }
  });
}
// NOTA: Não chamar renderProLinkCalendar() aqui.
// O feed.html chama via callback do $.load() após o DOM estar pronto.