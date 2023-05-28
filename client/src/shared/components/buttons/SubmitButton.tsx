import Button, { ButtonProps } from '@mui/material/Button';

interface ISubmitButton {
  content: string;
  props?: ButtonProps;
}

export function SubmitButton({ content, props }: ISubmitButton) {
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
