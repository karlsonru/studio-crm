import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/system/Unstable_Grid/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

export function LessonsHeader() {
  return (
    <header>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid>
          <TextField
            placeholder = 'Поиск'
            InputProps = {{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          ></TextField>
          <Select label="Тип" value="groups">
            <MenuItem value="groups">Группа</MenuItem>
            <MenuItem value="individuals">Индивидуальные</MenuItem>
          </Select>
          <Select value="active">
            <MenuItem value="active">Активные</MenuItem>
            <MenuItem value="inactive">В архиве</MenuItem>
          </Select>
        </Grid>
        <Grid>
          <Button variant="contained" size="large">Добавить</Button>
        </Grid>
      </Grid>
    </header>
  );
}
