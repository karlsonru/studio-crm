import Button from '@mui/material/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

interface IMobileFilterButton {
  handler: React.MouseEventHandler<HTMLButtonElement>;
}

export function MobileFilterButton({ handler }: IMobileFilterButton) {
  return (
    <Button variant='contained' size='large' onClick={handler}>
      <FilterAltIcon htmlColor='#fff' />
    </Button>
  );
}
