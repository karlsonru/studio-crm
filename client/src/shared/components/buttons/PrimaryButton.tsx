import Button, { ButtonProps } from '@mui/material/Button';

interface IButton {
  content: string;
  props?: ButtonProps;
}

export function PrimaryButton({ content, props }: IButton) {
  return (
    <Button
      variant='contained'
      color='primary'
      {...props}
    >
      { content }
    </Button>
  );
}
