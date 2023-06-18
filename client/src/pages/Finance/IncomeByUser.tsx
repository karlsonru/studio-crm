import { FormEvent, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import { useMobile } from '../../shared/hooks/useMobile';
import { SubmitButton } from '../../shared/components/buttons/SubmitButton';
import { FormContentColumn } from '../../shared/components/FormContentColumn';
import { getMonthName } from '../../shared/helpers/getMonthName';
import { useGetIncomeByUserQuery, useGetUsersQuery } from '../../shared/api';
import { Loading } from '../../shared/components/Loading';
import { ShowError } from '../../shared/components/ShowError';

export function IncomeByUser() {
  const [month, setMonth] = useState(new Date().getMonth());
  const [userId, setUserId] = useState('none');
  const isMobile = useMobile();
  const now = new Date();

  const {
    data: usersResponse,
    isLoading: isLoadingUsers,
    isError: isErrorUser,
    error: errorUsers,
  } = useGetUsersQuery();

  const {
    data: statisticResponse,
    isLoading: isLoadingStatistic,
    isError: isErrorStatistic,
    error: errorStatistic,
  } = useGetIncomeByUserQuery({
    query: {
      dateFrom: new Date(now.getFullYear(), +month, 1).getTime(),
    },
    id: userId,
  }, {
    skip: userId === 'none',
  });

  if (isLoadingUsers || isLoadingStatistic) {
    return <Loading />;
  }

  if (isErrorUser || isErrorStatistic) {
    return <ShowError details={errorUsers ?? errorStatistic} />;
  }

  if (!usersResponse) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);

    setMonth(+(form.get('month') as string));
    setUserId(form.get('userId') as string);
  };

  return (
    <Box component="div">
      <Typography component="h3" fontWeight="bold">
        Доход по сотруднику
      </Typography>

      <Box component="form" noValidate onSubmit={handleSubmit}>
        <FormContentColumn props={{ direction: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl>
            <FormLabel>Период</FormLabel>
            <Select
              label="Педагог"
              name="userId"
              defaultValue="none"
              sx={{
                width: '135px',
              }}
            >
              <MenuItem value="none">Не выбран</MenuItem>
              {usersResponse.map((user) => (
                <MenuItem key={user._id} value={user._id}>{user.fullname}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Месяц</FormLabel>
            <Select
              label="Месяц"
              name="month"
              defaultValue={new Date().getMonth()}
              sx={{
                width: '135px',
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                <MenuItem value={num} key={num}>{ getMonthName(num) }</MenuItem>
              ))}
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

      <Typography component="h3" fontWeight="bold">
        { statisticResponse }
      </Typography>
    </Box>
  );
}
