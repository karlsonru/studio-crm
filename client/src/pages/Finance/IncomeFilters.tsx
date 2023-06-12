import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import { useMobile } from '../../shared/hooks/useMobile';
import { useGetLocationsQuery } from '../../shared/api';
// import { getTodayTimestamp } from '../../shared/helpers/getTodayTimestamp';
import { SubmitButton } from '../../shared/components/buttons/SubmitButton';
import { FormContentColumn } from '../../shared/components/FormContentColumn';

export function IncomeFilters() {
  const isMobile = useMobile();
  const { data: responseLocations, isLoading } = useGetLocationsQuery();

  return (
    <Box component="form" noValidate>
      <FormContentColumn>
        <></>
        <Grid container spacing={1.5}>
          <Grid item xs={4}>
            <FormControl>
              <FormLabel>Период</FormLabel>
                <Select
                  labelId="period"
                  name="period"
                  defaultValue={3}
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
          </Grid>

          <Grid item xs={4}>
            <FormControl>
              <FormLabel>Студия</FormLabel>
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
                    <MenuItem value={location._id}>{ location.title }</MenuItem>
                  )) }
                </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <SubmitButton content='Показать' props={{ sx: { minWidth: '135px' } }}/>
          </Grid>
        </Grid>
      </FormContentColumn>
    </Box>
  );
}
