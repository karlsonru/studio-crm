import { FormEvent } from 'react';
import DialogContentText from '@mui/material/DialogContentText';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useGetUsersQuery, usePatchAttendanceMutation, usePatchLessonMutation } from '../api';
import { ILessonModel } from '../models/ILessonModel';
import { DialogFormWrapper } from './DialogFormWrapper';
import { ShowError } from './ShowError';
import { Loading } from './Loading';
import { IAttendanceModel } from '../models/IAttendanceModel';

function ListAvailableTeachers({ currentTeacherId }: { currentTeacherId: string }) {
  const {
    data: teachers,
    isLoading,
    isError,
    error,
  } = useGetUsersQuery();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  if (!teachers) {
    return null;
  }

  const availableTeachers = teachers.filter((teacher) => teacher._id !== currentTeacherId);

  return (
    <RadioGroup name="teacher">
      {
        availableTeachers.map((teacher) => (
          <FormControlLabel
              key={teacher._id}
              value={teacher._id}
              control={<Radio />}
              label={teacher.fullname}
            />
        ))
    }
    </RadioGroup>
  );
}

interface IChangeTeacherDialog {
  lesson?: ILessonModel;
  attendance?: IAttendanceModel;
  isOpen: boolean;
  setModalOpen: (value: boolean) => void;
}

export function ChangeTeacherDialog(
  {
    lesson,
    attendance,
    isOpen,
    setModalOpen,
  }: IChangeTeacherDialog,
) {
  const [updateLesson, requestStatusLessons] = usePatchLessonMutation();
  const [updateAttendance, requestStatusAttendance] = usePatchAttendanceMutation();

  if (!lesson && !attendance) {
    console.error('No lesson or attendance');
    return null;
  }

  if (lesson && attendance) {
    console.error('Both lesson and attendance');
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const formData = Object.fromEntries(new FormData(form).entries());

    if (lesson) {
      updateLesson({
        id: lesson._id,
        newItem: {
          teacher: formData.teacher as string,
        },
      });
    }

    if (attendance) {
      updateAttendance({
        id: attendance._id,
        newItem: {
          teacher: formData.teacher as string,
        },
      });
    }
  };

  const title = lesson?.title ?? attendance?.lesson.title;
  const teacher = lesson?.teacher ?? attendance?.teacher;

  return (
    <DialogFormWrapper
      title="Заменить педагога"
      isOpen={isOpen}
      onSubmit={handleSubmit}
      onClose={() => setModalOpen(false)}
      clearParams={false}
      requestStatus={lesson ? requestStatusLessons : requestStatusAttendance}
    >
      <DialogContentText>
        Вы хотите заменить педагога {''}
        <strong>{teacher?.fullname}</strong>
        {''} в занятии <strong>{title}</strong>.
      </DialogContentText>
      <DialogContentText>
        Выберите нового педагога.
      </DialogContentText>
      <Divider />

      <ListAvailableTeachers currentTeacherId={teacher?._id ?? ''} />

    </DialogFormWrapper>
  );
}
