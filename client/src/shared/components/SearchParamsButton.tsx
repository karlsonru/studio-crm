import Button from '@mui/material/Button';
import { useSearchParams } from 'react-router-dom';

interface ISearchParamsButton {
  title: string;
  param: string;
}

export function SearchParamsButton({ title, param }: ISearchParamsButton) {
  const [,setSearchParams] = useSearchParams();
  return <Button variant="contained" size="large" onClick={() => setSearchParams({ [param]: 'true' })}>{title}</Button>;
}
