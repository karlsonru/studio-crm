import TextField, { TextFieldProps } from '@mui/material/TextField';

export function DateField(props: TextFieldProps) {
  return (
    <TextField
      type="date"
      variant="outlined"
      InputLabelProps={{ shrink: true }}
      fullWidth
      required
      {...props}
      />
  );
}
