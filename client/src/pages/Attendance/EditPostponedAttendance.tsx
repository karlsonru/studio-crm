import Select from '@mui/material/Select';
import { format, parse } from 'date-fns';
import { useState, FormEvent } from 'react';
import MenuItem from '@mui/material/MenuItem';
import { useFindWithParamsLessonsQuery, usePatchAttendnceStudentByIdMutation } from '../../shared/api';
import { DialogFormWrapper } from '../../shared/components/DialogFormWrapper';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { VisitType } from '../../shared/models/ILessonModel';
import { DateField } from '../../shared/components/fields/DateField';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { attendancePageActions } from '../../shared/reducers/attendancePageSlice';
import { IAttendanceModel } from '../../shared/models/IAttendanceModel';

export function EditPostponedAttendance({ attendance }: { attendance: IAttendanceModel }) {
  const actions = useActionCreators(attendancePageActions);
  const [date, setDate] = useState(format(Date.now(), 'yyyy-MM-dd'));
  const [isDateError, setDateError] = useState(false);
  const [updateAttendanceStudentById, requestStatus] = usePatchAttendnceStudentByIdMutation();

  const {
    searchLessonId,
    searchDateTimestamp,
    editPostponedAttendanceStudentId,
    editPostponedAttendanceModalOpen,
  } = useAppSelector((state) => state.attendancePageReducer);

  const { data: lessons } = useFindWithParamsLessonsQuery({
    route: `available-for-visit-instead/${searchLessonId}`,
    params: {
      studentId: editPostponedAttendanceStudentId,
      dateFrom: searchDateTimestamp,
    },
  }, {
    skip: !editPostponedAttendanceStudentId || !searchLessonId,
  });

  if (!lessons) return null;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    setDateError(false);

    event.preventDefault();

    const formDate = new FormData(event.currentTarget);

    const visitDate = parse(date, 'yyyy-MM-dd', new Date());
    const visiDateUTC = Date.UTC(
      visitDate.getFullYear(),
      visitDate.getMonth(),
      visitDate.getDate(),
    );

    if (visiDateUTC < Date.now()) {
      setDateError(true);
      return;
    }

    updateAttendanceStudentById({
      id: attendance._id,
      path: `student/${editPostponedAttendanceStudentId}/add`,
      newItem: {
        visitType: VisitType.POSTPONED,
        visitInstead: formDate.get('lesson') as string,
        visitInsteadDate: visiDateUTC,
      },
    });
  };

  const selectedWeekdayByDate = parse(date, 'yyyy-MM-dd', new Date()).getDay();
  const lessonsByWeekday = lessons.filter((lesson) => lesson.weekday === selectedWeekdayByDate);
  const studentName = attendance.students
    .find((visitDetails) => visitDetails.student._id === editPostponedAttendanceStudentId)?.student
    .fullname;

  return <DialogFormWrapper
    title={`Назначить отработку для ${studentName}`}
    clearParams={false}
    isOpen={editPostponedAttendanceModalOpen}
    onSubmit={onSubmit}
    requestStatus={requestStatus}
    onClose={() => actions.setEditPostponedAttendanceModalOpen(false)}
  >
    <DateField
      value={date}
      onChange={(event) => {
        setDate(event.target.value);
      }}
      name='date'
      label='Дата отработки'
      error={isDateError}
      helperText={isDateError ? 'Дата должна быть больше текущей' : null}
    />

    {lessonsByWeekday && <Select
      name='lesson'
      label='Занятие'
    >
      { lessonsByWeekday.map((lesson) => <MenuItem key={lesson._id} value={lesson._id}>
          {lesson.title}
        </MenuItem>)
      }
    </Select>
    }

  </DialogFormWrapper>;
}
