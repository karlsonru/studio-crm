import { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Grid from '@mui/material/Grid';
import { setLessonActiveStatusFilter, setLessonSizeFilter, setLessonTitleFilter } from 'shared/reducers/lessonPageSlice';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { ConfirmationDialog } from '../../shared/components/ConfirmationDialog';
import { CreateLessonForm } from '../../shared/components/CreateLessonForm';

function FilterButtons() {
  const lessonSelector = useAppSelector((state) => state.lessonPageReduer);
  const dispatch = useAppDispatch();

  const { lessonSizeFilter, lessonActiveStatusFilter } = lessonSelector;

  const lessonSizeFilterChangeHandler = (event: SelectChangeEvent) => {
    dispatch(setLessonSizeFilter(event.target.value));
  };

  const lessonActiveStatusFilterChangeHandler = (event: SelectChangeEvent) => {
    dispatch(setLessonActiveStatusFilter(event.target.value));
  };

  return (
    <>
      <Select label="Тип" value={lessonSizeFilter} sx={{ m: '0rem 0.25rem' }} onChange={lessonSizeFilterChangeHandler}>
        <MenuItem value="groups">Группа</MenuItem>
        <MenuItem value="individuals">Индивидуальные</MenuItem>
      </Select>
      <Select value={lessonActiveStatusFilter} sx={{ m: '0rem 0.25rem' }} onChange={lessonActiveStatusFilterChangeHandler}>
        <MenuItem value="active">Активные</MenuItem>
        <MenuItem value="archived">В архиве</MenuItem>
      </Select>
    </>
  );
}

const FilterButtonsWrapped = () => (
  <Grid item width='100%' justifyContent='space-around'>
    <FilterButtons />
  </Grid>
);

export function LessonsHeader() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFiltersOpen, setFiltersOpen] = useState(false);
  const lessonSelector = useAppSelector((state) => state.lessonPageReduer);
  const dispatch = useAppDispatch();

  const toggleFilterButtons = () => {
    setFiltersOpen((isOpen) => !isOpen);
  };

  const MobileFilterButton = () => (
    <Button size='large' variant='contained' onClick={toggleFilterButtons} sx={{ m: 0.25 }}>
        <FilterAltIcon fontSize='large' htmlColor='#fff' />
    </Button>
  );

  const { lessonTitleFilter } = lessonSelector;

  const titleFilterChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setLessonTitleFilter(event.target.value));
  };

  return (
    <>
      <header style={{ margin: '1rem 0rem' }}>
        <Grid container justifyContent="space-between" alignItems="center" spacing={1}>
          <Grid item>
            <TextField
              placeholder = 'Поиск'
              value = { lessonTitleFilter }
              onChange = { titleFilterChangeHandler }
              InputProps = {{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }} />
            { !isMobile && <FilterButtons /> }
            { isMobile && <MobileFilterButton />}
          </Grid>
            { isMobile && isFiltersOpen && <FilterButtonsWrapped /> }
          <Grid item>
            <Button variant="contained" size="large" onClick={() => setModalOpen(true)}>Добавить</Button>
          </Grid>
        </Grid>
      </header>
      <ConfirmationDialog title='Добавить занятие' contentEl={<CreateLessonForm />} isOpen={isModalOpen} setModalOpen={setModalOpen} />
    </>
  );
}
