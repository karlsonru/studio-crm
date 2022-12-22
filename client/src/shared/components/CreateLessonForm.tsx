import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select/Select';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import InputLabel from '@mui/material/InputLabel';
import { getDayName } from '../helpers/getDayName';

/*
{
  "title": "Изо вт 11-14",
  "teacher": "63540d17460f2b088105e004",
  "activeStudents": 1,
  "location": "63542092fca363139570253d",
  "day": 1,
  "timeStart": 1600,
  "timeEnd": 1720,
  "dateFrom": 1661979600000,
  "dateTo": 1693515600000,
  "isActive": true
}
*/

export function CreateLessonForm() {
  return (
    <form onSubmit={(event: React.FormEvent<HTMLFormElement>) => console.log(event)}>
      <Stack spacing={4}>
        <TextField name='title' label="Занятие" placeholder="Занятие" />

        <FormControl>
          <FormLabel>Тип</FormLabel>
          <RadioGroup
            row
            name="type"
          >
            <FormControlLabel value="group" control={<Radio />} label="Группа" />
            <FormControlLabel value="individual" control={<Radio />} label="Индивидуальное" />
          </RadioGroup>
        </FormControl>

        <FormControl>
          <InputLabel>День недели</InputLabel>
          <Select name='day' label="День недели">
            { [0, 1, 2, 3, 4, 5, 6].map(
              (num) => <MenuItem
                key={getDayName(num)}
                value={num.toString()}>
                  {getDayName(num)}
                </MenuItem>,
            )}
          </Select>
        </FormControl>

        <Stack direction='row' spacing={1} width='100%'>
          <TextField
            type='time'
            label='Начало'
            inputProps={{
              endAdornment: <InputAdornment position='end'>Начало</InputAdornment>,
              step: 300,
            }}
            sx={{
              minWidth: '120px',
              flexBasis: '50%',
            }} />
          <TextField
            type='time'
            label='Конец'
            inputProps={{
              endAdornment: <InputAdornment position='end'>Конец</InputAdornment>,
              step: 300,
              placeholder: '',
            }}
            sx={{
              minWidth: '120px',
              flexBasis: '50%',
            }} />
        </Stack>

        <FormControl>
          <InputLabel>Помещение</InputLabel>
          <Select name='location' label='Помещение'>
            <MenuItem value={'location 1'}>location 1</MenuItem>
            <MenuItem value={'location 2'}>location 2</MenuItem>
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Педагог</InputLabel>
          <Select name='teacher' label='Педагог'>
            <MenuItem value={'Педагог 1'}>Педагог 1</MenuItem>
            <MenuItem value={'Педагог 2'}>Педагог 2</MenuItem>
          </Select>
        </FormControl>

        <Stack direction='row' spacing={1}>
          <TextField type='date' inputProps={{
            endAdornment: <InputAdornment position='end'>Начало</InputAdornment>,
          }} />
          <TextField type='date' inputProps={{
            endAdornment: <InputAdornment position='end'>Конец</InputAdornment>,
          }} />
        </Stack>

      </Stack>
    </form>
  );
}
