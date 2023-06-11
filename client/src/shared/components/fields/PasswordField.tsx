import { VisibilityOff, Visibility } from '@mui/icons-material';
import { InputAdornment, IconButton } from '@mui/material';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useState } from 'react';

interface IPasswordField {
  name: string;
  props?: TextFieldProps;
}

export function PasswordField({ name, props }: IPasswordField) {
  const [showPassword, setShowPassword] = useState(false);

  console.log(`showPassword: ${showPassword}`);

  return (
    <TextField
      variant="outlined"
      name={name}
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={() => setShowPassword((prev) => !prev)}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>,
      }}
      {...props}
    />
  );
}
