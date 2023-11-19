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
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import { format, parse } from 'date-fns';
import { getTodayTimestamp } from 'shared/helpers/getTodayTimestamp';
import { useFindStudentsQuery, usePatchLessonStudentsMutation } from '../../shared/api';
import { IStudentModel } from '../../shared/models/IStudentModel';
import { ILessonModel, VisitType } from '../../shared/models/ILessonModel';
import { CardWrapper } from '../../shared/components/CardWrapper';
import { DialogFormWrapper } from '../../shared/components/DialogFormWrapper';
import { ShowError } from '../../shared/components/ShowError';
import { DateField } from '../../shared/components/fields/DateField';
// import { Loading } from '../../shared/components/Loading';

interface IAddStudentsDialog {
  lesson: ILessonModel;
  isOpen: boolean;
  setModalOpen: (value: boolean) => void;
  date?: number;
}

export function AddStudentsDialog({
  lesson, isOpen, setModalOpen, date,
}: IAddStudentsDialog) {
  const [visitType, setVisitType] = useState<VisitType>(VisitType.REGULAR);
  const [visitDate, setVisitDate] = useState(format(date ?? getTodayTimestamp(), 'yyyy-MM-dd'));
  const [selectedOptions, setSelected] = useState<IStudentModel[]>([]);

  const { data: possibleStudents, isError, error } = useFindStudentsQuery({
    _id: { $nin: lesson.students.map((visiting) => visiting.student._id) },
  });
  const [updateLessonStudents, requestStatus] = usePatchLessonStudentsMutation();

  if (!possibleStudents) {
    return null;
  }

  if (isError) {
    <ShowError details={error} />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const futureVisitDate = parse(visitDate, 'yyyy-MM-dd', new Date());
    const futureVisitDateTimestamp = Date.UTC(
      futureVisitDate.getFullYear(),
      futureVisitDate.getMonth(),
      futureVisitDate.getDate(),
    );

    updateLessonStudents({
      id: lesson._id,
      action: 'add',
      newItem: {
        students: [...selectedOptions.map((student) => ({
          student: student._id,
          date: visitType === VisitType.REGULAR ? null : futureVisitDateTimestamp,
          visitType,
        }))],
      },
    });

    setSelected([]);
  };

  const hasAvailableStudents = possibleStudents.length > 0;

  return (
    <DialogFormWrapper
      title="Добавить студентов"
      isOpen={isOpen}
      onSubmit={handleSubmit}
      requestStatus={requestStatus}
      onClose={() => setModalOpen(false)}
      dialogProps={{
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

      <FormControl>
          <FormLabel>Посещение</FormLabel>
            <Select
              name="visitType"
              label="visitType"
              value={visitType}
              onChange={(event) => setVisitType(event.target.value as VisitType)}
              fullWidth
            >
              <MenuItem value={VisitType.REGULAR}>Постоянное</MenuItem>
              <MenuItem value={VisitType.SINGLE}>Однократное</MenuItem>
              <MenuItem value={VisitType.POSTPONED}>Отработка</MenuItem>
              <MenuItem value={VisitType.NEW}>Новое</MenuItem>
            </Select>
        </FormControl>

      {visitType !== VisitType.REGULAR && <DateField
        value={visitDate}
        onChange={(event) => setVisitDate(event.target.value)}
        name="date"
        label="Дата посещения"
      />}

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
