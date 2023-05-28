import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

interface ISearchField {
  placeholder: string;
  value: string;
  handler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchField({ placeholder, value, handler }: ISearchField) {
  return (
    <TextField
      placeholder={placeholder}
      value={value}
      onChange={handler}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}
