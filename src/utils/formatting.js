export function formatDate(date) {
  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function getWeekDays() {
  return [
    { label: 'Segunda', shortLabel: 'Seg' },
    { label: 'Terça', shortLabel: 'Ter' },
    { label: 'Quarta', shortLabel: 'Qua' },
    { label: 'Quinta', shortLabel: 'Qui' },
    { label: 'Sexta', shortLabel: 'Sex' },
    { label: 'Sábado', shortLabel: 'Sáb' },
    { label: 'Domingo', shortLabel: 'Dom' },
  ];
}

export function getTodayIndex() {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}

export function getTodayWeekLabel() {
  return getWeekDays()[getTodayIndex()].shortLabel;
}

export function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '...';
}
