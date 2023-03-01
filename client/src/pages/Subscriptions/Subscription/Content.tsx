import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { GridColDef, GridValueFormatterParams } from '@mui/x-data-grid';
import { useMobile } from '../../../shared/hooks/useMobile';
import { useGetSubscriptionsQuery } from '../../../shared/api';

function valueFormatter(params: GridValueFormatterParams<any>) {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour12: false,
  }).format(new Date(params.value));
}

function getColumns(isMobile: boolean) {
  const columns: GridColDef[] = [
    { field: 'student', headerName: 'Ученик', flex: 1 },
    // Посещено? Запрос к другой коллекции базы с фильтрацией? Доп.поле к этому абонементу?
    { field: 'visits', headerName: 'Занятий', flex: 1 },
    {
      field: 'duration', headerName: 'Длительность', flex: 1, valueFormatter: (params) => Math.floor(params.value / 86400000),
    },
    {
      field: 'dateFrom', headerName: 'Дата от', flex: 1, valueFormatter,
    },
    {
      field: 'dateTo', headerName: 'Дата до', flex: 1, valueFormatter,
    },
    { field: 'price', headerName: 'Цена', flex: 1 },
  ];

  if (isMobile) {
    return [columns[0], columns[1], columns[2]];
  }

  return columns;
}

export function SubscriptionContent() {
  const isMobile = useMobile();

  const { data } = useGetSubscriptionsQuery();

  if (!data) return <h1>Is loading ...</h1>;

  const columns = getColumns(isMobile);

  return <DataGrid
    autoHeight
    columns={columns}
    rows={data.payload}
    getRowId={(item) => item._id}
  />;
}
