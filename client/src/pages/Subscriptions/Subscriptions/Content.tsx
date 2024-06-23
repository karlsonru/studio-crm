import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useMobile } from '../../../shared/hooks/useMobile';
import { useGetSubscriptionsQuery } from '../../../shared/api';
import { CustomGridToolbar } from '../../../shared/components/CustomGridToolbar';
import { dateValueFormatter } from '../../../shared/helpers/dateValueFormatter';
import { SearchParamsButton } from '../../../shared/components/buttons/SearchParamsButton';
import { ISubscriptionModel } from '../../../shared/models/ISubscriptionModel';
import { Loading } from '../../../shared/components/Loading';
import { ShowError } from '../../../shared/components/ShowError';
import './subscription.css';

const leftAlignNumberColumn: Partial<GridColDef> = {
  type: 'number',
  flex: 1,
  align: 'left',
  headerAlign: 'left',
};

function getClassNameByExpireDate(today: Date, dateTo: number) {
  const differenceInDays = Math.floor((dateTo - today.getTime()) / (1000 * 3600 * 24));
  if (differenceInDays > 7) {
    return '';
  }

  if (differenceInDays < 0) {
    return 'custom-error-color';
  }

  return 'custom-warning-color';
}

function getColumns(isMobile: boolean) {
  const today = new Date();

  const columns: GridColDef<ISubscriptionModel>[] = [
    {
      field: 'student',
      headerName: 'Ученик',
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<ISubscriptionModel['student']>) => (
        params.value.fullname
      ),
    },
    {
      field: 'visitsTotal',
      headerName: 'Занятий',
      ...leftAlignNumberColumn,
    },
    {
      field: 'visitsLeft',
      headerName: 'Осталось',
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
      cellClassName: (params) => getClassNameByExpireDate(today, params.value),
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
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetSubscriptionsQuery();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  const columns = getColumns(isMobile);

  const ExtendedToolbar = () => (
    CustomGridToolbar([
      <SearchParamsButton title="Оформить" param="create-subscription" />,
    ])
  );

  return <DataGrid
    autoHeight
    columns={columns}
    rows={data ?? []}
    getRowId={(item) => item._id}
    onRowDoubleClick={(params: GridRowParams<ISubscriptionModel>) => navigate(`/subscriptions/${params.id}`)}
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
