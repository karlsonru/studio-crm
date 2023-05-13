import Button, { ButtonProps } from '@mui/material/Button';

interface ISuccessButton {
  content: string;
  props?: ButtonProps;
}

export function SuccessButton({ content, props }: ISuccessButton) {
  return (
    <Button
      type='submit'
      variant='contained'
      color='success'
      {...props}
    >
      {content}
    </Button>
  );
}
