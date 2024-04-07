import { useNavigate } from 'react-router-dom';
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import { format } from 'date-fns';
import { Loading } from '../../shared/components/Loading';
import { ShowError } from '../../shared/components/ShowError';
import { useFindWithParamsAttendancesQuery } from '../../shared/api/attendanceApi';
import { IAttendanceModel, VisitStatus } from '../../shared/models/IAttendanceModel';

export function ContentAttendance({ lessonId }: { lessonId: string }) {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useFindWithParamsAttendancesQuery({
    params: {
      lessonId,
    },
  });

  const columns: GridColDef<IAttendanceModel>[] = [
    {
      field: 'date',
      headerName: 'Дата',
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<IAttendanceModel['date']>) => (
        format(params.value, 'dd-MM-yyyy')
      ),
    },
    {
      field: 'students',
      type: 'number',
      headerName: 'Посетило',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      valueFormatter: (params: GridValueFormatterParams<IAttendanceModel['students']>) => (
        `${params.value.filter((visit) => visit.visitStatus === VisitStatus.VISITED).length} / ${params.value.length}`
      ),
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  if (!data) {
    return null;
  }

  return (
    <DataGrid
      autoHeight
      columns={columns}
      rows={data}
      getRowId={(item) => item._id}
      disableColumnMenu
      density="comfortable"
      pageSizeOptions={[10, 25]}
      onRowDoubleClick={((params: GridRowParams<IAttendanceModel>) => navigate(`/attendances?year=${new Date(params.row.date).getFullYear()}&month=${new Date(params.row.date).getMonth() + 1}&day=${new Date(params.row.date).getDate()}&lessonId=${lessonId}`))}
      localeText={{
        toolbarFilters: 'Фильтры',
      }}
      initialState={{
        sorting: {
          sortModel: [{ field: 'date', sort: 'desc' }],
        },
        pagination: {
          paginationModel: { pageSize: 100 },
        },
      }}
    />
  );
}
