import Button, { ButtonProps } from '@mui/material/Button';

interface IPrimaryButton {
  content: string;
  props?: ButtonProps;
}

export function PrimaryButton({ content, props }: IPrimaryButton) {
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
