import { FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { UserRole, userRoleLocal } from '../../models/IUserModel';
import { useCreateUserMutation } from '../../api';
import { isValidPhone } from '../../helpers/isValidPhone';
import { isPasswordStrong } from '../../helpers/isPasswordStrong';
import { NumberField } from '../fields/NumberField';
import { PasswordField } from '../fields/PasswordField';
import { DialogFormWrapper } from '../DialogFormWrapper';

function validateForm(formData: { [key: string]: FormDataEntryValue }) {
  if (!formData.fullname || (formData.fullname as string).trim().length < 3) {
    return 'fullname';
  }

  if (!formData.phone || !isValidPhone(formData.phone as string)) {
    return 'phone';
  }

  if (formData.login && (formData.login as string).trim().length < 5) {
    return 'login';
  }

  if (formData.password && !isPasswordStrong(formData.password as string)) {
    return 'password';
  }

  return '';
}

export function CreateUserModal() {
  const [canAuthorize, setCanAuthorize] = useState(false);
  const [createUser, isSuccess] = useCreateUserMutation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [formValidation, setFormValidation] = useState({
    fullname: true,
    phone: true,
    login: true,
    password: true,
  });

  useEffect(() => {
    if (!isSuccess) return;

    const timerId = setTimeout(() => setSearchParams(undefined), 500);

    return () => clearTimeout(timerId);
  }, [isSuccess]);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = Object.fromEntries(new FormData(form).entries());

    setFormValidation({
      fullname: true,
      phone: true,
      login: true,
      password: true,
    });

    const errorName = validateForm(formData);
    if (errorName) {
      setFormValidation(() => ({
        ...formValidation,
        [errorName]: false,
      }));
      return;
    }

    createUser({
      fullname: (formData.fullname as string).trim(),
      birthday: +Date.parse(formData.birthday as string),
      role: formData.role as UserRole,
      phone: +(formData.phone as string).trim(),
      salary: +(formData.salary as string).trim(),
      canAuth: canAuthorize,
      login: (formData.login as string)?.trim(),
      password: (formData.password as string)?.trim(),
      isActive: true,
    });

    form.reset();
  };

  return (
    <DialogFormWrapper
      title="Добавить сотрудника"
      isOpen={searchParams.has('create-user')}
      onSubmit={submitHandler}
    >
      <TextField
        variant="outlined"
        name="fullname"
        label="ФИО"
        fullWidth
        required
        error={!formValidation.fullname}
        helperText={!formValidation.fullname && 'Имя не должно быть пустым или слишком короткий'}
      />

      <TextField
        type="date"
        variant="outlined"
        name="birthday"
        label="Дата рождения"
        InputLabelProps={{ shrink: true }}
        fullWidth
        required
      />

      <FormControl>
        <FormLabel>Роль</FormLabel>
          <Select
            name='role'
            label='Роль'
            defaultValue={UserRole.TEACHER}
            fullWidth
            required
          >
            {
              Object.values(UserRole).map((role) => (
                <MenuItem key={role} value={role}>
                  {userRoleLocal[role]}
                </MenuItem>
              ))
            }
          </Select>
      </FormControl>

      <NumberField
        name="phone"
        label="Телефон"
        error={!formValidation.phone}
        helperText='Проверьте введённый телефон'
      />

      <NumberField
        name="salary"
        label="Оплата"
        error={false}
        minValue={0}
        defaultValue={0}
      />

      <FormControlLabel
        label="Доступ в CRM"
        control={
          <Checkbox
            name="canAuth"
            checked={canAuthorize}
            onChange={() => setCanAuthorize((prev) => !prev)}
          />
        }
      />

      {canAuthorize && <TextField
        variant="outlined"
        name="login"
        label="Логин"
        fullWidth
        required
        error={!formValidation.login}
        helperText={!formValidation.login && 'Логин не должен быть пустым или слишком коротким'}
      />
      }

      {canAuthorize && <PasswordField
        name="password"
        props={{
          label: 'Пароль',
          fullWidth: true,
          required: true,
          error: !formValidation.password,
          helperText: !formValidation.password && 'Пароль не должен быть пустым или простым. 10 знаков, буквы, цифры и специальный символ.',
        }}
      />
      }
    </DialogFormWrapper>
  );
}
