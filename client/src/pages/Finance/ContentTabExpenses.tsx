import { useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDeleteFinanceMutation, useFindFinancesQuery } from '../../shared/api';
import { useMobile } from '../../shared/hooks/useMobile';
import { IFinanceModel } from '../../shared/models/IFinanceModel';
import { ConfirmationDialog, DeleteDialogText } from '../../shared/components/ConfirmationDialog';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { SearchParamsButton } from '../../shared/components/buttons/SearchParamsButton';
import { CustomGridToolbar } from '../../shared/components/CustomGridToolbar';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { ShowError } from '../../shared/components/ShowError';
import { Loading } from '../../shared/components/Loading';
import { financeActions } from '../../shared/reducers/financeSlice';
import { CreateFinanceExpenseModal } from '../../shared/components/modals/CreateFinanceExpenseModal';

function ExtendedToolbar() {
  const [deleteFinanceRecord] = useDeleteFinanceMutation();

  const actions = useActionCreators(financeActions);

  const isConfirmationDialog = useAppSelector((state) => state.financeReducer.isConfirmationDialog);
  const currentFinanceRecord = useAppSelector((state) => state.financeReducer.currentFinanceRecord);

  return CustomGridToolbar([
    <ConfirmationDialog
      title="Удалить запись о расходах"
      contentEl={<DeleteDialogText name={currentFinanceRecord?.title ?? ''} />}
      isOpen={isConfirmationDialog}
      setModalOpen={actions.setConfirmationDialog}
      callback={() => deleteFinanceRecord(currentFinanceRecord?._id ?? '')}
    />,
    <SearchParamsButton title="Добавить" param="create-expense" />,
    <CreateFinanceExpenseModal />,
  ]);
}

export function ContentTabExpenses() {
  const isMobile = useMobile();
  const actions = useActionCreators(financeActions);
  const filters = useAppSelector((state) => state.financeReducer.expenses);

  const deleteFinanceRecordHandler = useCallback((currentFinanceRecord: IFinanceModel) => {
    actions.setConfirmationDialog(true);
    actions.setCurrentFinanceRecord(currentFinanceRecord);
  }, []);

  const {
    data, isLoading, isError, error,
  } = useFindFinancesQuery({
    date: { $gte: filters.dateFrom },
    location: filters.location,
  });

  const columns: GridColDef<IFinanceModel>[] = useMemo(() => [
    {
      field: 'title',
      headerName: 'Название',
      flex: 1,
    },
    {
      field: 'amount',
      headerName: 'Сумма',
      flex: 1,
    },
    {
      field: 'date',
      headerName: 'Дата',
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<IFinanceModel['date']>) => (
        format(params.value, 'dd-MM-yyyy')
      ),
    },
    {
      field: 'location',
      headerName: 'Локация',
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<IFinanceModel['location']>) => (
        params.value ?? 'Общий'
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      getActions: (params: GridRowParams<IFinanceModel>) => [
        <GridActionsCellItem
          label="Delete"
          icon={<DeleteIcon />}
          onClick={() => deleteFinanceRecordHandler(params.row)}
      />,
      ],
    },
  ], [deleteFinanceRecordHandler]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  if (!data?.payload) {
    return null;
  }

  return (
    <DataGrid
      autoHeight
      columns={isMobile ? columns.slice(0, 3) : columns}
      rows={data.payload}
      getRowId={(item) => item._id}
      disableColumnMenu
      density="comfortable"
      pageSizeOptions={[25, 50]}
      components={{
        Toolbar: ExtendedToolbar,
      }}
      localeText={{
        toolbarFilters: 'Фильтры',
      }}
      initialState={{
        sorting: {
          sortModel: [{ field: 'date', sort: 'desc' }],
        },
        pagination: {
          paginationModel: { pageSize: 25 },
        },
      }}
    />
  );
}
