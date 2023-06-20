import { FormEvent, useState } from 'react';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DialogContentText from '@mui/material/DialogContentText';
import Divider from '@mui/material/Divider';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useFindStudentsQuery, usePatchLessonMutation } from '../../shared/api';
import { IStudentModel } from '../../shared/models/IStudentModel';
import { ILessonModel } from '../../shared/models/ILessonModel';
import { CardWrapper } from '../../shared/components/CardWrapper';
import { DialogFormWrapper } from '../../shared/components/DialogFormWrapper';
import { ShowError } from '../../shared/components/ShowError';
// import { Loading } from '../../shared/components/Loading';

interface IAddStudentsDialog {
  lesson: ILessonModel;
  isOpen: boolean;
  setModalOpen: (value: boolean) => void;
}

export function AddStudentsDialog({ lesson, isOpen, setModalOpen }: IAddStudentsDialog) {
  const [selectedOptions, setSelected] = useState<IStudentModel[]>([]);
  const { data: possibleStudents, isError, error } = useFindStudentsQuery({
    _id: { $nin: lesson.students.map((visiting) => visiting.student._id) },
  });
  const [updateLesson, requestStatus] = usePatchLessonMutation();

  if (!possibleStudents) {
    return null;
  }

  if (isError) {
    <ShowError details={error} />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateLesson({
      id: lesson._id,
      newItem: {
        // @ts-ignore
        $addToSet: {
          students: {
            $each: [...selectedOptions.map((student) => student._id)],
          },
        },
      },
    });
  };

  const hasAvailableStudents = possibleStudents.length > 0;

  return (
    <DialogFormWrapper
      title="Добавить студентов"
      isOpen={isOpen}
      onSubmit={handleSubmit}
      requestStatus={requestStatus}
      dialogProps={{
        onClose: () => setModalOpen(false),
        maxWidth: 'xl',
        // transitionDuration: 250,
      }}
    >
      <DialogContentText>
        {hasAvailableStudents
          ? 'Выберите студентов, которых хотите добавить к занятию'
          : 'Все студенты уже записаны'
        }
      </DialogContentText>

      <Divider sx={{ m: '1rem 0' }}/>

      {hasAvailableStudents && <Autocomplete
          multiple
          options={possibleStudents}
          getOptionLabel={(option) => option.fullname}
          onChange={(event, value) => setSelected(() => value)}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.fullname}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              placeholder="Добавить"
            />
          )}
        />
        }

    </DialogFormWrapper>
  );
}

export function AddStudentButton({ setModalOpen }: { setModalOpen: (value: boolean) => void }) {
  return (
    <CardWrapper>
      <CardActionArea
        sx={{ height: '100%' }}
        onClick={() => setModalOpen(true)}
      >
      <CardContent sx={{ textAlign: 'center' }}>
          <ControlPointIcon fontSize='large' />
        </CardContent>
      </CardActionArea>
    </CardWrapper>
  );
}
