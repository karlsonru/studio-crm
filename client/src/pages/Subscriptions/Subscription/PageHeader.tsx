import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Stack from '@mui/system/Stack';
import { CreateLessonModal } from '../../../shared/components/CreateLessonModal';
import { SearchField } from '../../../shared/components/SearchField';
import { MobileFilterButton } from '../../../shared/components/MobileFilterButton';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { lessonsPageActions } from '../../../shared/reducers/lessonsPageSlice';
import { useActionCreators } from '../../../shared/hooks/useActionCreators';
import { useMobile } from '../../../shared/hooks/useMobile';

function FilterButtons({ isMobile }: { isMobile: boolean }) {
  const titleFilter = useAppSelector((state) => state.lessonsPageReducer.titleFilter);
  const sizeFilter = useAppSelector((state) => state.lessonsPageReducer.sizeFilter);
  const statusFilter = useAppSelector((state) => state.lessonsPageReducer.statusFilter);

  const actions = useActionCreators(lessonsPageActions);

  const changeTitleHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    actions.setTitleFilter(event.target.value);
  };

  const changeSizeHandler = (event: SelectChangeEvent) => {
    actions.setSizeFilter(event.target.value);
  };

  const changeStatusHandler = (event: SelectChangeEvent) => {
    actions.setStatusFilter(event.target.value);
  };

  return (
    <Stack direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 1 : 2}>
      <SearchField placeholder='Поиск' value={titleFilter} handler={changeTitleHandler} />

      <Select value={sizeFilter} onChange={changeSizeHandler}>
        <MenuItem value="groups">Группа</MenuItem>
        <MenuItem value="individuals">Индивидуальные</MenuItem>
      </Select>

      <Select value={statusFilter} onChange={changeStatusHandler}>
        <MenuItem value="active">Активные</MenuItem>
        <MenuItem value="archived">В архиве</MenuItem>
      </Select>
    </Stack>
  );
}

export function SubscriptionsHeader() {
  const isMobile = useMobile();
  const [, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilterButtons = () => {
    setShowFilters((isOpen) => !isOpen);
  };

  return (
    <header>
      <Stack direction='row' justifyContent="space-between" alignItems="center">
        {isMobile && <MobileFilterButton handler={toggleFilterButtons} />}
        {!isMobile && <FilterButtons isMobile={isMobile} />}
        <Button variant="contained" size="large" onClick={() => setSearchParams({ 'create-lesson': 'true' })}>Добавить</Button>
      </Stack>
      {showFilters && <FilterButtons isMobile={isMobile} />}
      <CreateLessonModal />
    </header>
  );
}