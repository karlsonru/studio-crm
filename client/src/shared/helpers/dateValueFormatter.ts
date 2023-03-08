export function dateValueFormatter(value: number) {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour12: false,
  }).format(new Date(value));
}
