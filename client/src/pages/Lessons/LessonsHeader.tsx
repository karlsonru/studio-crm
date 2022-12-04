import { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Grid from '@mui/material/Grid';

const FilterButtons = () => (
  <>
    <Select label="Тип" value="groups" sx={{ m: '0rem 0.25rem' }}>
      <MenuItem value="groups">Группа</MenuItem>
      <MenuItem value="individuals">Индивидуальные</MenuItem>
    </Select>
    <Select value="active" sx={{ m: '0rem 0.25rem' }}>
      <MenuItem value="active">Активные</MenuItem>
      <MenuItem value="inactive">В архиве</MenuItem>
    </Select>
  </>
);

const FilterButtonsWrapped = () => (
  <Grid item width='100%' justifyContent='space-around'>
    <FilterButtons />
  </Grid>
);

export function LessonsHeader() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [isFiltersOpen, setFiltersOpen] = useState(false);

  const toggleFilterButtons = () => {
    setFiltersOpen((isOpen) => !isOpen);
  };

  const MobileFilterButton = () => (
    <Button size='large' variant='contained' onClick={toggleFilterButtons} sx={{ m: 0.25 }}>
        <FilterAltIcon fontSize='large' htmlColor='#fff' />
    </Button>
  );

  return (
    <header style={{ margin: '1rem 0rem' }}>
      <Grid container justifyContent="space-between" alignItems="center" spacing={1}>
        <Grid item>
          <TextField
            placeholder = 'Поиск'
            InputProps = {{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }} />
          { !isMobile && <FilterButtons /> }
          { isMobile && <MobileFilterButton />}
        </Grid>
          { isMobile && isFiltersOpen && <FilterButtonsWrapped /> }
        <Grid item>
          <Button variant="contained" size="large">Добавить</Button>
        </Grid>
      </Grid>
    </header>
  );
}
