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
import { useFindWithParamsAttendancesQuery, useGetLessonsQuery } from '../../shared/api';
import { IAttendanceModel, PaymentStatus, VisitStatus } from '../../shared/models/IAttendanceModel';
import { getYearMonthDay } from '../../shared/helpers/getYearMonthDay';
import { ILessonModel } from '../../shared/models/ILessonModel';
/*
function UnpaidAttendancesDisplay() {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useFindWithParamsAttendancesQuery({
    route: 'unpaid',
    params: { days: 30 },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  const attendances = data ?? [];
  const rows = attendances.map((attendance) => {
    const studentsWithPostponedVisits: Array<React.ReactNode> = [];

    attendance.students.forEach((student) => {
      if (student.paymentStatus !== PaymentStatus.UNPAID) return;

      const { year, month, day } = getYearMonthDay(attendance.date);

      const row = CreateRow({
        content: [attendance.lesson.title, format(attendance.date, 'dd.MM.yyyy'), student.student.fullname],
        props: {
          onDoubleClick: () => navigate(`/attendances?lessonId=${attendance.lesson._id}&year=${year}&month=${month + 1}&day=${day}`),
        },
      });
      studentsWithPostponedVisits.push(row);
    });

    return [...studentsWithPostponedVisits];
  }).flat();

  return <BasicTable
    headers={['Неоплаченное занятие', 'Дата', 'Ученик']}
    rows={rows}
  />;
}
*/
interface IStudentWithPostponedStatus {
  _id: IAttendanceModel['_id'];
  studentName: string;
  lesson: IAttendanceModel['lesson'];
  date: IAttendanceModel['date'];
  visitInsteadDate: number | null;
  visitInstead: string | null;
  visitStatus: VisitStatus;
  paymentStatus: PaymentStatus;
}

function getEachStudentWithPostponedStatus(
  attendances: Array<IAttendanceModel>,
  lessons: Array<ILessonModel>,
) {
  const eachStudentWithPostponedStatus = [] as IStudentWithPostponedStatus[];

  const lessonsIdsAndTitle: Record<string, string> = {};
  lessons.forEach((lesson) => {
    lessonsIdsAndTitle[lesson._id] = lesson.title;
  });

  attendances.forEach((attendance) => {
    attendance.students.forEach((student) => {
      if (student.visitStatus !== VisitStatus.POSTPONED_FUTURE) return;

      eachStudentWithPostponedStatus.push({
        _id: attendance._id,
        lesson: attendance.lesson,
        date: attendance.date,
        studentName: student.student.fullname,
        visitInsteadDate: student.visitInsteadDate ?? null,
        visitInstead: student.visitInstead ? lessonsIdsAndTitle[student.visitInstead] : null,
        visitStatus: student.visitStatus,
        paymentStatus: student.paymentStatus,
      });
    });
  });

  return eachStudentWithPostponedStatus;
}

export function PostponedAttendancesContent() {
  const navigate = useNavigate();

  const { data: lessons } = useGetLessonsQuery();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useFindWithParamsAttendancesQuery({
    route: 'postponed',
    params: { days: 360 },
  });

  const columns: GridColDef<IStudentWithPostponedStatus>[] = useMemo(() => [
    {
      field: 'date',
      headerName: 'Дата пропуска',
      sortable: false,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<IStudentWithPostponedStatus['date']>) => (
        dateValueFormatter(params.value)
      ),
    },
    {
      field: 'studentName',
      headerName: 'Ученик',
      flex: 1,
    },
    {
      field: 'lesson',
      headerName: 'Пропущенное занятие',
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<IStudentWithPostponedStatus['lesson']>) => params.value.title,
    },
    {
      field: 'visitInsteadDate',
      headerName: 'Дата отработки',
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<IStudentWithPostponedStatus['visitInsteadDate']>) => {
        if (params.value === null) {
          return null;
        }

        return dateValueFormatter(params.value);
      },
    },
    {
      field: 'visitInstead',
      headerName: 'Записан для отработки',
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<IStudentWithPostponedStatus['visitInstead']>) => params.value,
    },
    {
      field: 'actions',
      type: 'actions',
      getActions: (params: GridRowParams<IStudentWithPostponedStatus>) => [
        <GridActionsCellItem
          label="Go to attendance"
          icon={<OpenInNewIcon />}
          onClick={() => {
            const { year, month, day } = getYearMonthDay(params.row.date);

            navigate(`/attendances?lessonId=${params.row.lesson._id}&year=${year}&month=${month + 1}&day=${day}`);
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

  if (!data || !lessons) {
    return null;
  }

  return (
    <DataGrid
      autoHeight
      disableColumnMenu
      columns={columns}
      rows={getEachStudentWithPostponedStatus(data, lessons)}
      getRowId={(item) => item._id}
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
