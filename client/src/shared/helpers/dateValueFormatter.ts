import { GridValueFormatterParams } from '@mui/x-data-grid';

export function dateValueFormatter(params: GridValueFormatterParams<any>) {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour12: false,
  }).format(new Date(params.value));
}
