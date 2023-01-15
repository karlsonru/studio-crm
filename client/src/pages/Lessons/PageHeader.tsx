import { useState } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/system/Stack';
import { setLessonActiveStatusFilter, setLessonSizeFilter, setLessonTitleFilter } from 'shared/reducers/lessonPageSlice';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { CreateLessonModal } from '../../shared/components/CreateLessonModal';
import { SearchField } from '../../shared/components/SearchField';
import { MobileFilterButton } from '../../shared/components/MobileFilterButton';

function FilterButtons({ isMobile }: { isMobile: boolean }) {
  const lessonSelector = useAppSelector((state) => state.lessonPageReduer);
  const dispatch = useAppDispatch();

  const { lessonTitleFilter, lessonSizeFilter, lessonActiveStatusFilter } = lessonSelector;

  const titleFilterChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setLessonTitleFilter(event.target.value));
  };

  const lessonSizeFilterChangeHandler = (event: SelectChangeEvent) => {
    dispatch(setLessonSizeFilter(event.target.value));
  };

  const lessonActiveStatusFilterChangeHandler = (event: SelectChangeEvent) => {
    dispatch(setLessonActiveStatusFilter(event.target.value));
  };

  return (
    <Stack direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 1 : 2}>
      <SearchField placeholder='Поиск' value={lessonTitleFilter} handler={titleFilterChangeHandler} />

      <Select label="Тип" value={lessonSizeFilter} onChange={lessonSizeFilterChangeHandler}>
        <MenuItem value="groups">Группа</MenuItem>
        <MenuItem value="individuals">Индивидуальные</MenuItem>
      </Select>

      <Select value={lessonActiveStatusFilter} onChange={lessonActiveStatusFilterChangeHandler}>
        <MenuItem value="active">Активные</MenuItem>
        <MenuItem value="archived">В архиве</MenuItem>
      </Select>
    </Stack>
  );
}

export function LessonsHeader() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [isModalOpen, setModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilterButtons = () => {
    setShowFilters((isOpen) => !isOpen);
  };

  return (
    <header>
      <Stack direction='row' justifyContent="space-between" alignItems="center">
        {isMobile && <MobileFilterButton handler={toggleFilterButtons} />}
        {!isMobile && <FilterButtons isMobile={isMobile} />}
        <Button variant="contained" size="large" onClick={() => setModalOpen(true)}>Добавить</Button>
      </Stack>
      {showFilters && <FilterButtons isMobile={isMobile} />}
      <CreateLessonModal isOpen={isModalOpen} setModalOpen={setModalOpen} />
    </header>
  );
}
