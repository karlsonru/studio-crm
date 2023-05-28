import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useMobile } from '../../shared/hooks/useMobile';
import { useFindStudentsQuery, useGetLessonQuery, usePatchLessonMutation } from '../../shared/api';
import { IStudentModel } from '../../shared/models/IStudentModel';
import { ILessonModel } from '../../shared/models/ILessonModel';

interface IAddStudentsDialog {
  lesson: ILessonModel;
  isOpen: boolean;
  setModalOpen: (value: boolean) => void;
}

function AddStudentsDialog({ lesson, isOpen, setModalOpen }: IAddStudentsDialog) {
  const [selectedOptions, setSelected] = useState<IStudentModel[]>([]);
  const { data } = useFindStudentsQuery({
    _id: {
      $nin: [...lesson.students.map((student) => student._id)],
    },
  });
  const [updateLesson, { isSuccess, isError, error }] = usePatchLessonMutation();

  if (isError) {
    console.error(error);
  }

  useEffect(() => {
    setModalOpen(false);
  }, [isSuccess]);

  if (!data?.payload) {
    return <h3>Все студенты записаны</h3>;
  }

  const handleOk = () => {
    updateLesson({
      id: lesson._id,
      newItem: {
        // @ts-ignore
        $addToSet: {
          students: [...selectedOptions.map((student) => student._id)],
        },
      },
    });
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const changeHandler = (event: React.SyntheticEvent<Element, Event>, value: IStudentModel[]) => {
    setSelected(() => value);
  };

  return (
    <Dialog open={isOpen} maxWidth='xl' transitionDuration={500} onClose={() => setModalOpen(false)}>
      <DialogTitle>Добавить студентов</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Выберите студентов, которых хотите добавить к занятию
        </DialogContentText>

        <Divider sx={{ m: '1rem 0' }}/>

        <Autocomplete
          multiple
          options={data.payload}
          getOptionLabel={(option) => option.fullname}
          onChange={changeHandler}
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

      </DialogContent>
      <DialogActions>
        <Button autoFocus variant='contained' color='error' onClick={handleCancel}>
          Закрыть
        </Button>
        <Button variant='contained' color='success' onClick={handleOk}>Подтвердить</Button>
      </DialogActions>
    </Dialog>
  );
}

export function AddStudentButton({ lessonId }: { lessonId: string }) {
  const isMobile = useMobile();
  const [isModalOpen, setModalOpen] = useState(false);

  const {
    data, isFetching, isError, error,
  } = useGetLessonQuery(lessonId);

  if (isFetching || !data?.payload) {
    return null;
  }

  if (isError) {
    console.error(error);
    return <h3>Ошибка при запросе</h3>;
  }

  return (
    <>
      <Card variant="outlined" sx={{ width: '325px', marginRight: isMobile ? 0 : '0.5rem', marginBottom: '0.5rem' }}>
        <CardActionArea
          sx={{ height: '100%' }}
          onClick={() => setModalOpen(true)}
        >
        <CardContent sx={{ textAlign: 'center' }}>
            <ControlPointIcon fontSize='large' />
          </CardContent>
        </CardActionArea>
      </Card>

      <AddStudentsDialog
        lesson={data?.payload}
        isOpen={isModalOpen}
        setModalOpen={setModalOpen}
      />
    </>
  );
}
