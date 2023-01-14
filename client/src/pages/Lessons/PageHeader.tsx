import { useState } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Grid from '@mui/material/Grid';
import { setLessonActiveStatusFilter, setLessonSizeFilter, setLessonTitleFilter } from 'shared/reducers/lessonPageSlice';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { CreateLessonModal } from '../../shared/components/CreateLessonModal';
import { SearchField } from '../../shared/components/SearchField';

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
      <header>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item>
            <SearchField placeholder='Поиск' value={lessonTitleFilter} handler={titleFilterChangeHandler} />
            { !isMobile && <FilterButtons /> }
            { isMobile && <MobileFilterButton />}
          </Grid>
            { isMobile && isFiltersOpen && <FilterButtonsWrapped /> }
          <Grid item>
            <Button variant="contained" size="large" onClick={() => setModalOpen(true)}>Добавить</Button>
          </Grid>
        </Grid>
      </header>
      <CreateLessonModal isOpen={isModalOpen} setModalOpen={setModalOpen} />
    </>
  );
}
