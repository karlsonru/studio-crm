import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { dateValueFormatter } from '../../shared/helpers/dateValueFormatter';
import { Loading } from '../../shared/components/Loading';
import { ShowError } from '../../shared/components/ShowError';
import { useFindWithParamsAttendancesQuery } from '../../shared/api';
import { IAttendanceModel, PaymentStatus } from '../../shared/models/IAttendanceModel';
import { getYearMonthDay } from '../../shared/helpers/getYearMonthDay';

interface IStudentWithUnpaidStatus {
  _id: IAttendanceModel['_id'];
  studentFullname: string;
  date: IAttendanceModel['date'];
  lesson: IAttendanceModel['lesson'];
}

function getStudentsWithUnpaidStatus(
  attendance: IAttendanceModel,
): Array<IStudentWithUnpaidStatus> {
  const studentsWithUnpaidStatus: Array<IStudentWithUnpaidStatus> = [];

  attendance.students.forEach((student) => {
    if (student.paymentStatus !== PaymentStatus.UNPAID) return;

    studentsWithUnpaidStatus.push({
      _id: attendance._id,
      studentFullname: student.student.fullname,
      date: attendance.date,
      lesson: attendance.lesson,
    });
  });

  return studentsWithUnpaidStatus;
}

export function UnpaidAttendancesContent() {
  const navigate = useNavigate();

  const {
    data: attendances,
    isLoading,
    isError,
    error,
  } = useFindWithParamsAttendancesQuery({
    route: 'unpaid',
    params: { days: 360 },
  });

  const studentsWithUnpaidStatus = attendances?.map(
    (attendance) => getStudentsWithUnpaidStatus(attendance),
  ).flat();

  const columns: GridColDef<IStudentWithUnpaidStatus>[] = useMemo(() => [
    {
      field: 'date',
      headerName: 'Дата',
      sortable: false,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<IStudentWithUnpaidStatus['date']>) => (
        dateValueFormatter(params.value)
      ),
    },
    {
      field: 'studentFullname',
      headerName: 'Ученик',
      flex: 1,
    },
    {
      field: 'lesson',
      headerName: 'Неоплаченное занятие',
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<IStudentWithUnpaidStatus['lesson']>) => params.value.title,
    },
    {
      field: 'actions',
      type: 'actions',
      getActions: (params: GridRowParams<IStudentWithUnpaidStatus>) => [
        <GridActionsCellItem
          label="Go to attendance"
          icon={<OpenInNewIcon />}
          onClick={() => {
            const { year, month, day } = getYearMonthDay(params.row.date);

            navigate(`/attendances/history?lessonId=${params.row.lesson._id}&year=${year}&month=${month + 1}&day=${day}`);
          }}
        />,
      ],
    },
  ], [dateValueFormatter]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  if (studentsWithUnpaidStatus === undefined) {
    return null;
  }

  return (
    <DataGrid
      autoHeight
      disableColumnMenu
      columns={columns}
      rows={studentsWithUnpaidStatus}
      getRowId={(item) => item._id + item.studentFullname}
      localeText={{
        toolbarFilters: 'Фильтры',
      }}
      initialState={{
        sorting: {
          sortModel: [{ field: 'date', sort: 'desc' }],
        },
      }}
    />
  );
}
