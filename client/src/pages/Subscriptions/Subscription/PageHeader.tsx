import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Stack from '@mui/system/Stack';
import { CreateSubscriptionModal } from '../../../shared/components/CreateSubscriptionModal';
import { MobileFilterButton } from '../../../shared/components/MobileFilterButton';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { lessonsPageActions } from '../../../shared/reducers/lessonsPageSlice';
import { useActionCreators } from '../../../shared/hooks/useActionCreators';
import { useMobile } from '../../../shared/hooks/useMobile';

// фильтры по имени ?
// по датам
// активный / неактивный
function FilterButtons({ isMobile }: { isMobile: boolean }) {
  const statusFilter = useAppSelector((state) => state.lessonsPageReducer.statusFilter);

  const actions = useActionCreators(lessonsPageActions);

  const changeStatusHandler = (event: SelectChangeEvent) => {
    actions.setStatusFilter(event.target.value);
  };

  return (
    <Stack direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 1 : 2}>
      <Select value={statusFilter} onChange={changeStatusHandler}>
        <MenuItem value="active">Активные</MenuItem>
        <MenuItem value="archived">В архиве</MenuItem>
        <MenuItem value="all">Все</MenuItem>
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
        <Button variant="contained" size="large" onClick={() => setSearchParams({ 'create-subscription': 'true' })}>Оформить</Button>
      </Stack>
      {showFilters && <FilterButtons isMobile={isMobile} />}
      <CreateSubscriptionModal />
    </header>
  );
}
