import { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/system/Stack';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useMediaQuery } from '@mui/material';
import { SearchField } from '../../shared/components/SearchField';
import { MobileFilterButton } from '../../shared/components/MobileFilterButton';
import { useGetLessonsQuery } from '../../shared/api/lessonApi';
import { ILessonFilter, studentsPageActions } from '../../shared/reducers/studentsPageSlice';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { useActionCreators } from '../../shared/hooks/useActionCreators';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface INumberField {
  placeholder: string;
  value: number | string;
  handler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function NumberField({ placeholder, value, handler }: INumberField) {
  return (
    <TextField
      value={value}
      placeholder={placeholder}
      onChange={handler}
      type="number"
      inputProps={{ min: 0, max: 99 }}
      sx={{ minWidth: 60 }}
    />
  );
}

function FilterButtons({ isMobile }: { isMobile: boolean }) {
  const actions = useActionCreators(studentsPageActions);

  const lessonsOptions = useGetLessonsQuery().data?.payload.map((lesson) => (
    { id: lesson._id, title: lesson.title }
  ));

  const nameFilter = useAppSelector((state) => state.studentsPageReducer.nameFilter);
  const phoneFilter = useAppSelector((state) => state.studentsPageReducer.phoneFilter);
  const statusFilter = useAppSelector((state) => state.studentsPageReducer.statusFilter);
  const ageFromFilter = useAppSelector((state) => state.studentsPageReducer.ageFromFilter);
  const ageToFilter = useAppSelector((state) => state.studentsPageReducer.ageToFilter);

  const changeNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    actions.setNameFilter(e.target.value);
  };

  const changePhoneHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    actions.setPhoneFilter(e.target.value);
  };

  const changeLessonsHandler = (
    e: React.SyntheticEvent<Element, Event>,
    value: Array<ILessonFilter>,
  ) => {
    actions.setLessonsFilter(value);
  };

  const changeStatusHandler = (e: SelectChangeEvent<string>) => {
    actions.setStatusFilter(e.target.value);
  };

  const changeAgeFromHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    actions.setAgeFromFilter(e.target.value);
  };

  const changeAgeToHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    actions.setAgeToFilter(e.target.value);
  };

  return (
    <Stack direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 1 : 2}>
      <SearchField placeholder='Поиск по имени' value={nameFilter} handler={changeNameHandler} />
      <SearchField placeholder='Поиск по телефону' value={phoneFilter} handler={changePhoneHandler} />

      {lessonsOptions && <Autocomplete
        multiple
        options={lessonsOptions}
        limitTags={1}
        disableCloseOnSelect
        getOptionLabel={(option: ILessonFilter) => option.title}
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
        style={{ width: isMobile ? '100%' : 300 }}
        onChange={changeLessonsHandler}
        renderInput={(params) => (
          <TextField {...params} label="Занятия" placeholder="Занятия" />
        )}
      />}

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="student-status">Статус</InputLabel>
        <Select labelId="student-status" value={statusFilter} label="Статус" onChange={changeStatusHandler} fullWidth>
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value="active">Активные</MenuItem>
          <MenuItem value="archived">В архиве</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel id="student-age">Возраст</InputLabel>
        <Select multiple value={[]} labelId="student-age" label="Возраст" fullWidth>
          <MenuItem disableGutters component="span" sx={{ display: 'inline' }}>
            <NumberField placeholder="От" value={ageFromFilter ?? ''} handler={changeAgeFromHandler} />
          </MenuItem>
          <MenuItem disableGutters component="span" sx={{ display: 'inline' }}>
            <NumberField placeholder="До" value={ageToFilter ?? ''} handler={changeAgeToHandler} />
          </MenuItem>
        </Select>
      </FormControl>

    </Stack>
  );
}

export function StudentsPageHeader() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters((state) => !state);
  };

  return (
    <header>
      <Stack direction='row' justifyContent="space-between" alignItems="center">
        {isMobile && <MobileFilterButton handler={toggleFilters} />}
        {!isMobile && <FilterButtons isMobile={isMobile} />}
        <Button variant="contained" size="large" onClick={() => console.log('Добавлен новый ученик!')}>Добавить</Button>
      </Stack>
      {showFilters && <FilterButtons isMobile={isMobile} />}
    </header>
  );
}
