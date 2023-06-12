import { FormEvent } from 'react';
import { startOfMonth, subMonths } from 'date-fns';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import { useMobile } from '../../shared/hooks/useMobile';
import { useGetLocationsQuery } from '../../shared/api';
import { SubmitButton } from '../../shared/components/buttons/SubmitButton';
import { FormContentColumn } from '../../shared/components/FormContentColumn';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { financeActions } from '../../shared/reducers/financeSlice';
import { getTodayTimestamp } from '../../shared/helpers/getTodayTimestamp';
import { FINANCE_PERIOD_DEFAULT } from '../../shared/constants';

export function FinanceFilters({ tabName }: { tabName: string }) {
  const isMobile = useMobile();
  const { data: responseLocations, isLoading } = useGetLocationsQuery();

  const actions = useActionCreators(financeActions);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);

    const period = (form.get('period') ?? FINANCE_PERIOD_DEFAULT) as number;
    const location = (form.get('location') ?? 'all') as string;

    // узнаем первый день месяца за период
    const dateFrom = startOfMonth(subMonths(getTodayTimestamp(), period + 1)).getTime();

    const filters = {
      dateFrom,
      period,
      location,
    };

    if (tabName === 'expenses') {
      actions.setExpensesFilters(filters);
    } else if (tabName === 'income') {
      actions.setIncomeFilters(filters);
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <FormContentColumn props={{ direction: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl>
          <FormLabel>Период</FormLabel>
            <Select
              labelId="period"
              name="period"
              defaultValue={FINANCE_PERIOD_DEFAULT}
              label="period"
              disabled={isMobile}
              sx={{
                minWidth: '135px',
              }}
            >
              <MenuItem value={3}>3 месяца</MenuItem>
              <MenuItem value={6}>6 месяцев</MenuItem>
              <MenuItem value={12}>12 месяцев</MenuItem>
            </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Помещение</FormLabel>
            <Select
              labelId="location"
              name="location"
              defaultValue={'all'}
              label="location"
              disabled={isLoading}
              sx={{
                minWidth: '135px',
              }}
            >
              <MenuItem value={'all'}>Все</MenuItem>
              { responseLocations?.payload.map((location) => (
                <MenuItem key={location._id} value={location._id}>{ location.title }</MenuItem>
              )) }
            </Select>
        </FormControl>

        <SubmitButton
          content='Показать'
          props={{
            sx: {
              minWidth: '135px',
              ml: `${(isMobile ? 0 : '16px')}!important`,
              mt: `${isMobile ? '0.5rem' : 0}!important`,
            },
          }}
        />
      </FormContentColumn>
    </Box>
  );
}
