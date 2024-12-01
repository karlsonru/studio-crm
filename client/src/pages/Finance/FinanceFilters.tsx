import { FormEvent } from 'react';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import { useMobile } from '../../shared/hooks/useMobile';
import { useGetLocationsQuery, useGetUsersQuery } from '../../shared/api';
import { SubmitButton } from '../../shared/components/buttons/SubmitButton';
import { FormContentColumn } from '../../shared/components/FormContentColumn';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { financeActions } from '../../shared/reducers/financeSlice';
import { getMonthName } from '../../shared/helpers/getMonthName';

const MONTHES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export function FinanceFilters({ tabName }: { tabName: string }) {
  const isMobile = useMobile();
  const { data: responseLocations, isLoading: isLoadingLocations } = useGetLocationsQuery();
  const { data: responseUsers, isLoading: isLoadingUsers } = useGetUsersQuery();

  const currentMonth = new Date().getMonth();

  const actions = useActionCreators(financeActions);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);

    const month = (form.get('month') ?? currentMonth) as number;
    const userId = (form.get('teacher') ?? 'all') as string;
    const location = (form.get('location') ?? 'common') as string;

    const filters = { month, location, userId };

    if (tabName === 'expenses') {
      actions.setExpensesFilters(filters);
    } else if (tabName === 'income') {
      actions.setIncomeFilters(filters);
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <FormContentColumn
        props={{
          direction: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'left' : 'center',
          width: '100%',
        }}>
        <FormControl>
          <FormLabel>Период</FormLabel>
            <Select
              labelId="month"
              name="month"
              defaultValue={currentMonth}
              label="month"
              sx={{
                minWidth: '135px',
              }}
            >
              {
                MONTHES.map((month) => (
                  <MenuItem
                    key={month}
                    value={month}>{ getMonthName(month) }
                  </MenuItem>
                ))

              }
            </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Помещение</FormLabel>
            <Select
              labelId="location"
              name="location"
              defaultValue={'common'}
              label="location"
              disabled={isLoadingLocations}
              sx={{
                minWidth: '135px',
              }}
            >
              <MenuItem value={'common'}>Все</MenuItem>
              { responseLocations?.map((location) => (
                <MenuItem key={location._id} value={location._id}>{ location.title }</MenuItem>
              )) }
            </Select>
        </FormControl>

        {tabName === 'income' && <FormControl>
          <FormLabel>Сотрудник</FormLabel>
              <Select
                labelId="teacher"
                name="teacher"
                defaultValue={'all'}
                label="teacher"
                disabled={isLoadingUsers}
                sx={{
                  minWidth: '135px',
                }}
              >
                <MenuItem value={'all'}>Все</MenuItem>
                { responseUsers?.map((user) => (
                  <MenuItem key={user._id} value={user._id}>{ user.fullname }</MenuItem>
                ))}
              </Select>
          </FormControl>
        }

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
