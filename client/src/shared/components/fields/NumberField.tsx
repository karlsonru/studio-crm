import { useEffect, useState } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';

interface INumberField {
  name: string;
  label: string;
  error: boolean;
  helperText?: string;
  minValue?: number;
  defaultValue?: number;
  props?: TextFieldProps;
}

export function NumberField({
  name, label, error, helperText, minValue, defaultValue, props,
}: INumberField) {
  const [value, setValue] = useState(defaultValue ?? '');
  const [valueError, setValueError] = useState(false);
  const valueErrorText = `Укажите число больше ${minValue}`;

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/, '');
    setValue(input);
  };

  useEffect(() => {
    if (!minValue || !value) return;

    if (+value >= minValue) {
      setValueError(false);
      return;
    }

    setValueError(true);
  }, [value, minValue]);

  return (
    <TextField
      variant="outlined"
      value={value}
      onChange={changeHandler}
      name={name}
      label={label}
      fullWidth
      required
      error={error || valueError}
      helperText={(error && helperText) || (valueError && valueErrorText)}
      {...props}
    />
  );
}
