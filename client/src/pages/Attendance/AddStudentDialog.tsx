import { FormEvent, useState } from 'react';
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
import { format } from 'date-fns';
import {
  useFindStudentsQuery,
  usePatchAttendanceStudentsMutation,
} from '../../shared/api';
import { IStudentModel } from '../../shared/models/IStudentModel';
import { VisitType } from '../../shared/models/ILessonModel';
import { DialogFormWrapper } from '../../shared/components/DialogFormWrapper';
import { ShowError } from '../../shared/components/ShowError';
import { DateField } from '../../shared/components/fields/DateField';
import { IAttendanceModel, VisitStatus } from '../../shared/models/IAttendanceModel';
import { useAppSelector } from '../../shared/hooks/useAppSelector';

interface IAddStudentsDialog {
  attendance: IAttendanceModel;
  isOpen: boolean;
  setOpen: (value: boolean) => void;
}

export function AddStudentsDialog({
  attendance,
  isOpen,
  setOpen,
}: IAddStudentsDialog) {
  const searchDateTimestamp = useAppSelector(
    (state) => state.attendancePageReducer.searchDateTimestamp,
  );

  const [visitType, setVisitType] = useState<VisitType>(VisitType.POSTPONED);
  const [selectedOptions, setSelected] = useState<IStudentModel[]>([]);
  const [updateAttendanceStudents, requestStatus] = usePatchAttendanceStudentsMutation();

  const {
    data: possibleStudents,
    isError,
    error,
  } = useFindStudentsQuery({
    _id: {
      $nin: attendance.students.map((visiting) => visiting.student._id),
    },
  });

  if (!possibleStudents) {
    return null;
  }

  if (isError) {
    <ShowError details={error} />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateAttendanceStudents({
      id: attendance._id,
      action: 'add',
      newItem: {
        students: [...selectedOptions.map((student) => ({
          student: student._id,
          visitStatus: VisitStatus.UNKNOWN,
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
      onClose={() => setOpen(false)}
      clearParams={false}
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

      <DateField
        value={format(searchDateTimestamp, 'yyyy-MM-dd')}
        disabled
        name="date"
        label="Дата посещения"
      />

    </DialogFormWrapper>
  );
}
