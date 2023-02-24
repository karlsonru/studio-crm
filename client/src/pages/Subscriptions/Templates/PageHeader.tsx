import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Stack from '@mui/system/Stack';
import { CreateSubscriptionTemplateModal } from '../../../shared/components/CreateSubscriptionTemplateModal';
import { SearchField } from '../../../shared/components/SearchField';
import { MobileFilterButton } from '../../../shared/components/MobileFilterButton';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { subscriptionsPageActions } from '../../../shared/reducers/subscriptionsPageSlice';
import { useActionCreators } from '../../../shared/hooks/useActionCreators';
import { useMobile } from '../../../shared/hooks/useMobile';

function FilterButtons({ isMobile }: { isMobile: boolean }) {
  const titleFilter = useAppSelector(
    (state) => state.subscriptionsPageReducer.templates.filters.title,
  );

  const statusFilter = useAppSelector(
    (state) => state.subscriptionsPageReducer.templates.filters.status,
  );

  const actions = useActionCreators(subscriptionsPageActions);

  const changeTitleHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    actions.setTemplateFilterTitle(event.target.value);
  };

  const changeStatusHandler = (event: SelectChangeEvent) => {
    actions.setTemplateFilterStatus(event.target.value);
  };

  return (
    <Stack direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 1 : 2}>
      <SearchField placeholder='Поиск' value={titleFilter} handler={changeTitleHandler} />

      <Select value={statusFilter} onChange={changeStatusHandler}>
        <MenuItem value="active">Активные</MenuItem>
        <MenuItem value="archived">В архиве</MenuItem>
      </Select>
    </Stack>
  );
}

export function SubscriptionsTemplatesHeader() {
  const isMobile = useMobile();
  const [, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilterButtons = () => {
    setShowFilters((isOpen) => !isOpen);
  };

  return (
    <header style={{ margin: '1rem 0' }}>
      <Stack direction='row' justifyContent="space-between" alignItems="center">
        {isMobile && <MobileFilterButton handler={toggleFilterButtons} />}
        {!isMobile && <FilterButtons isMobile={isMobile} />}
        <Button variant="contained" size="large" onClick={() => setSearchParams({ 'create-subscription-template': 'true' })}>Добавить</Button>
      </Stack>
      {showFilters && <FilterButtons isMobile={isMobile} />}
      <CreateSubscriptionTemplateModal />
    </header>
  );
}
