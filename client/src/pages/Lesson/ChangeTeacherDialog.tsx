import { FormEvent } from 'react';
import DialogContentText from '@mui/material/DialogContentText';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useGetUsersQuery, usePatchLessonMutation } from '../../shared/api';
import { ILessonModel } from '../../shared/models/ILessonModel';
import { DialogFormWrapper } from '../../shared/components/DialogFormWrapper';
import { ShowError } from '../../shared/components/ShowError';
import { Loading } from '../../shared/components/Loading';
import { IUserModel } from '../../shared/models/IUserModel';

function ListTeachers({ teachers }: { teachers: Array<IUserModel> }) {
  return (
    <RadioGroup name="teacher">
      {
        teachers.map((teacher) => (
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
  lesson: ILessonModel,
  isOpen: boolean;
  setModalOpen: (value: boolean) => void;
}

export function ChangeTeacherDialog(
  {
    lesson,
    isOpen,
    setModalOpen,
  }: IChangeTeacherDialog,
) {
  const {
    data: teachers, isLoading, isError, error,
  } = useGetUsersQuery();
  const [updateLesson, requestStatus] = usePatchLessonMutation();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  if (!teachers) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const formData = Object.fromEntries(new FormData(form).entries());

    updateLesson({
      id: lesson._id,
      newItem: {
        teacher: formData.teacher as string,
      },
    });
  };

  const availableTeachers = teachers.filter((teacher) => teacher._id !== lesson.teacher._id);

  return (
    <DialogFormWrapper
      title="Заменить педагога"
      isOpen={isOpen}
      onSubmit={handleSubmit}
      requestStatus={requestStatus}
      onClose={() => setModalOpen(false)}
    >
      <DialogContentText>
        Вы хотите заменить педагога {''}
        <strong>{lesson.teacher.fullname}</strong>
        {''} в занятии <strong>{lesson.title}</strong>.
      </DialogContentText>
      <DialogContentText>
        Выберите нового педагога.
      </DialogContentText>
      <Divider />

      <ListTeachers teachers={availableTeachers} />

    </DialogFormWrapper>
  );
}
