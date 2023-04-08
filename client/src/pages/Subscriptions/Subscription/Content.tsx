import { DataGrid, GridColDef, GridValueFormatterParams } from '@mui/x-data-grid';
import { useMobile } from '../../../shared/hooks/useMobile';
import { useGetSubscriptionsQuery } from '../../../shared/api';
import { CustomGridToolbar } from '../../../shared/components/CustomGridToolbar';
import { dateValueFormatter } from '../../../shared/helpers/dateValueFormatter';
import { SearchParamsButton } from '../../../shared/components/SearchParamsButton';
import { CreateSubscriptionModal } from '../../../shared/components/CreateSubscriptionModal';
import { ISubscriptionModel } from '../../../shared/models/ISubscriptionModel';

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
      valueFormatter: (params: GridValueFormatterParams<ISubscriptionModel['student']>) => (
        params.value.fullname
      ),
    },
    // eslint-disable-next-line max-len
    // Посещено занятий по абонементу? Запрос к другой коллекции базы с фильтрацией? Доп.поле к этому абонементу?
    {
      field: 'visits',
      headerName: 'Занятий',
      ...leftAlignNumberColumn,
    },
    {
      field: 'duration',
      headerName: 'Длительность',
      valueFormatter: (params) => Math.floor(params.value / 86_400_000),
      ...leftAlignNumberColumn,
    },
    {
      field: 'dateFrom',
      type: 'date',
      headerName: 'Дата от',
      flex: 1,
      valueFormatter:
        (params: GridValueFormatterParams<ISubscriptionModel['dateFrom']>) => dateValueFormatter(params.value),
    },
    {
      field: 'dateTo',
      type: 'date',
      headerName: 'Дата до',
      flex: 1,
      valueFormatter:
        (params: GridValueFormatterParams<ISubscriptionModel['dateTo']>) => dateValueFormatter(params.value),
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

  const ExtendedToolbar = () => (
    CustomGridToolbar([
      <SearchParamsButton title="Оформить" param="create-subscription" />,
      <CreateSubscriptionModal />,
    ])
  );

  return <DataGrid
    autoHeight
    columns={columns}
    rows={data.payload}
    getRowId={(item) => item._id}
    disableColumnMenu
    components={{
      Toolbar: ExtendedToolbar,
    }}
    initialState={{
      sorting: {
        sortModel: [{ field: 'dateTo', sort: 'desc' }],
      },
    }}
  />;
}
