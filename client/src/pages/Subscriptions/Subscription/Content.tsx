import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useMobile } from '../../../shared/hooks/useMobile';
import { useGetSubscriptionsQuery } from '../../../shared/api';
import { CustomGridToolbar } from '../../../shared/components/CustomGridToolbar';
import { dateValueFormatter } from '../../../shared/helpers/dateValueFormatter';

const leftAlignNumberColumn: Partial<GridColDef> = {
  type: 'number',
  flex: 1,
  align: 'left',
  headerAlign: 'left',
};

function getColumns(isMobile: boolean) {
  const columns: GridColDef[] = [
    {
      field: 'student',
      headerName: 'Ученик',
      flex: 1,
    },
    // Посещено? Запрос к другой коллекции базы с фильтрацией? Доп.поле к этому абонементу?
    {
      field: 'visits',
      headerName: 'Занятий',
      ...leftAlignNumberColumn,
    },
    {
      field: 'duration',
      headerName: 'Длительность',
      valueFormatter: (params) => Math.floor(params.value / 86400000),
      ...leftAlignNumberColumn,
    },
    {
      field: 'dateFrom',
      type: 'dateTime',
      headerName: 'Дата от',
      flex: 1,
      valueFormatter: dateValueFormatter,
    },
    {
      field: 'dateTo',
      type: 'dateTime',
      headerName: 'Дата до',
      flex: 1,
      valueFormatter: dateValueFormatter,
    },
    {
      field: 'price',
      headerName: 'Цена',
      ...leftAlignNumberColumn,
    },
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
    disableColumnMenu
    components={{
      Toolbar: CustomGridToolbar,
    }}
  />;
}
