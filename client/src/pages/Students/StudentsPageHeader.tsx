import Button from '@mui/material/Button';
import Stack from '@mui/system/Stack';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { SearchField } from '../../shared/components/SearchField';
import { ILessonModel } from '../../shared/models/ILessonModel';
import { useGetLessonsQuery } from '../../shared/api/lessonApi';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface INumberField {
  placeholder: string;
  value: string;
  handler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function NumberField({ placeholder, value, handler }: INumberField) {
  return <TextField type="number" inputProps={{ min: 0, max: 99 }} placeholder={placeholder} onChange={handler} sx={{ minWidth: 60 }} />;
}

function FilterButtons() {
  const lessons = useGetLessonsQuery().data?.payload;

  return (
    <Stack direction="row" spacing={2}>
      <SearchField placeholder='Поиск по имени' value='' handler={(e) => console.log(e.target.value)} />
      <SearchField placeholder='Поиск по телефону' value='' handler={(e) => console.log(e.target.value)} />

      {lessons && <Autocomplete
        multiple
        options={lessons}
        limitTags={1}
        disableCloseOnSelect
        getOptionLabel={(option: ILessonModel) => option.title}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.title}
          </li>
        )}
        onChange={(e) => console.log(e.target)}
        style={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Занятия" placeholder="Занятия" />
        )}
      />}

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="student-status">Статус</InputLabel>
        <Select labelId="student-status"label="Статус" onChange={(e) => console.log(e.target.value)} fullWidth>
          <MenuItem value="active">Активные</MenuItem>
          <MenuItem value="archived">В архиве</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel id="student-age">Возраст</InputLabel>
        <Select labelId="student-age"label="Возраст" onChange={(e) => console.log(e.target.value)} fullWidth>
          <NumberField placeholder="От" value="0" handler={(e) => console.log(e.target.value)} />
          <NumberField placeholder="До" value="0" handler={(e) => console.log(e.target.value)} />
        </Select>

      </FormControl>

    </Stack>
  );
}

export function StudentsPageHeader() {
  return (
  <header>
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <div>
        <FilterButtons />
      </div>
      <div>
        <Button variant="contained" size="large" onClick={() => console.log('Clicked!')}>Добавить</Button>
      </div>
    </Stack>
  </header>
  );
}
