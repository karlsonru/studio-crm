import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { useMediaQuery } from '@mui/material';
import { SearchField } from '../../shared/components/SearchField';
import { MobileFilterButton } from '../../shared/components/MobileFilterButton';
import { useGetLessonsQuery } from '../../shared/api/lessonApi';
import { ILessonFilter, studentsPageActions } from '../../shared/reducers/studentsPageSlice';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { CreateStudentModal } from '../../shared/components/CreateStudentModal';

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

  const nameFilter = useAppSelector((state) => state.studentsPageReducer.filters.fullname);
  const phoneFilter = useAppSelector((state) => state.studentsPageReducer.filters.phone);
  const statusFilter = useAppSelector((state) => state.studentsPageReducer.filters.status);
  const ageFromFilter = useAppSelector((state) => state.studentsPageReducer.filters.ageFrom);
  const ageToFilter = useAppSelector((state) => state.studentsPageReducer.filters.ageTo);

  return (
    <Stack direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 1 : 2}>
      <SearchField placeholder='Поиск по имени' value={nameFilter} handler={(e) => actions.setFilter({ fullname: e.target.value }) } />
      <SearchField placeholder='Поиск по телефону' value={phoneFilter} handler={(e) => actions.setFilter({ phone: e.target.value }) } />

      { // TODO - переделать разделив заголовками уроки по дням и отсортировав их по времени
      lessonsOptions && <Autocomplete
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
        onChange={(e, value) => actions.setFilter({ lessons: value }) }
        renderInput={(params) => (
          <TextField {...params} label="Занятия" placeholder="Занятия" />
        )}
      />}

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="student-status">Статус</InputLabel>
        <Select labelId="student-status" value={statusFilter} label="Статус" onChange={(e) => actions.setFilter({ status: e.target.value })} fullWidth>
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value="active">Активные</MenuItem>
          <MenuItem value="archived">В архиве</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel id="student-age">Возраст</InputLabel>
        <Select multiple value={[]} labelId="student-age" label="Возраст" fullWidth>
          <MenuItem disableGutters component="span" sx={{ display: 'inline' }}>
            <NumberField placeholder="От" value={ageFromFilter ?? ''} handler={(e) => actions.setFilter({ ageFrom: +e.target.value }) } />
          </MenuItem>
          <MenuItem disableGutters component="span" sx={{ display: 'inline' }}>
            <NumberField placeholder="До" value={ageToFilter ?? ''} handler={(e) => actions.setFilter({ ageTo: +e.target.value })} />
          </MenuItem>
        </Select>
      </FormControl>

    </Stack>
  );
}

export function StudentsPageHeader() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [showFilters, setShowFilters] = useState(false);
  const [, setSearchParams] = useSearchParams();

  const toggleFilters = () => {
    setShowFilters((state) => !state);
  };

  return (
    <header>
      <Stack direction='row' justifyContent="space-between" alignItems="center">
        {isMobile && <MobileFilterButton handler={toggleFilters} />}
        {!isMobile && <FilterButtons isMobile={isMobile} />}
        <Button variant="contained" size="large" onClick={() => setSearchParams({ 'create-student': 'true' })}>Добавить</Button>
      </Stack>
      {showFilters && <FilterButtons isMobile={isMobile} />}
      <CreateStudentModal />
    </header>
  );
}
