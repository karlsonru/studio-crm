import { FormEvent, useEffect, useState } from 'react';
import { format } from 'date-fns';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/system/Stack';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import { SubmitButton } from '../../shared/components/buttons/SubmitButton';
import { FormContentColumn } from '../../shared/components/FormContentColumn';
import { NumberField } from '../../shared/components/fields/NumberField';
import { PasswordField } from '../../shared/components/fields/PasswordField';
import { UserRole, userRoleLocal } from '../../shared/models/IUserModel';
import { useGetUsersQuery, usePatchUserMutation } from '../../shared/api';
import { isPasswordStrong } from '../../shared/helpers/isPasswordStrong';
import { isValidPhone } from '../../shared/helpers/isValidPhone';

function validateForm(formData: { [key: string]: FormDataEntryValue }) {
  if (!formData.fullname || (formData.fullname as string).trim().length < 3) {
    return 'fullname';
  }

  if (!formData.phone || !isValidPhone(formData.phone as string)) {
    return 'phone';
  }

  if (formData.login && (formData.login as string).trim().length < 3) {
    return 'login';
  }

  if (formData.password && !isPasswordStrong(formData.password as string)) {
    return 'password';
  }

  return '';
}

export function ContentTabDetails({ userId }: { userId: string }) {
  const { data: userEdit } = useGetUsersQuery(undefined, {
    selectFromResult: ({ data }) => ({
      data: data?.find((user) => user._id === userId),
    }),
  });
  const [updateUser, { isSuccess }] = usePatchUserMutation();
  const [canAuthorize, setCanAuthorize] = useState(false);
  const [isEdit, setEdit] = useState(false);

  const [formValidation, setFormValidation] = useState({
    fullname: true,
    phone: true,
    login: true,
    password: true,
    newPassword: true,
  });

  // отключаем форму успешном завершении
  useEffect(() => {
    if (!isSuccess) return;

    const timerId = setTimeout(() => setEdit(false));

    return () => clearTimeout(timerId);
  }, [isSuccess]);

  // установим стартовые показатели может ли пользователь проходить аутентификацию
  useEffect(() => {
    if (!userEdit?.canAuth) return;

    setCanAuthorize(true);
  }, [userEdit]);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = Object.fromEntries(new FormData(form).entries());

    // на время выполнения отключим редактироание формы
    setEdit(false);

    validateForm(formData);

    setFormValidation({
      fullname: true,
      phone: true,
      login: true,
      password: true,
      newPassword: true,
    });

    const errorName = validateForm(formData);
    if (errorName) {
      setFormValidation(() => ({
        ...formValidation,
        [errorName]: false,
      }));
      return;
    }

    updateUser({
      id: userId,
      newItem: {
        fullname: (formData.fullname as string).trim(),
        birthday: +Date.parse(formData.birthday as string),
        phone: +(formData.phone as string),
        role: formData.role as UserRole,
        salary: parseInt(formData.salary as string, 10),
        canAuth: canAuthorize,
        login: (formData.login as string),
        password: (formData.password as string) || undefined,
        newPassword: (formData.newPassword as string) || undefined,
        isActive: true,
      },
    });

    form.reset();
  };

  if (!userEdit) {
    return null;
  }

  return (
    <form onSubmit={submitHandler}>
      <FormContentColumn>
        <Stack
          direction='row'
          justifyContent='end'
        >
          <Button
            variant='contained'
            color='primary'
            startIcon={<EditIcon />}
            onClick={() => setEdit((prev) => !prev)}
          >
            { isEdit ? 'Отменить редактирование' : 'Редактировать' }
          </Button>
        </Stack>

        <TextField
          variant="outlined"
          name="fullname"
          defaultValue={userEdit.fullname}
          disabled={!isEdit}
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
          defaultValue={format(userEdit.birthday, 'yyyy-MM-dd')}
          disabled={!isEdit}
          InputLabelProps={{ shrink: true }}
          fullWidth
          required
        />

        <FormControl>
          <FormLabel>Роль</FormLabel>
            <Select
              name='role'
              label='Роль'
              defaultValue={userEdit.role}
              disabled={!isEdit}
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
          defaultValue={userEdit.phone}
          helperText='Проверьте введённый телефон'
          props={{
            disabled: !isEdit,
          }}
        />

        <NumberField
          name="salary"
          label="Оплата"
          error={false}
          minValue={0}
          defaultValue={userEdit.salary}
          props={{
            disabled: !isEdit,
          }}
        />

        <FormControlLabel
          label="Доступ в CRM"
          disabled={!isEdit}
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
          defaultValue={userEdit.login}
          disabled={!isEdit}
          label="Логин"
          fullWidth
          required
          error={!formValidation.login}
          helperText={!formValidation.login && 'Логин не должен быть пустым или слишком коротким'}
        />
        }

        {canAuthorize && <PasswordField
          name='password'
          props={{
            label: 'Старый пароль',
            fullWidth: true,
            defaultValue: undefined,
            disabled: !isEdit,
            error: !formValidation.password,
            helperText: !formValidation.password && 'Пароль не должен быть пустым или простым. 10 знаков, буквы, цифры и специальный символ.',
          }}
        />
        }

        {canAuthorize && <PasswordField
          name='newPassword'
          props={{
            label: 'Новый пароль',
            defaultValue: undefined,
            fullWidth: true,
            disabled: !isEdit,
            error: !formValidation.newPassword,
            helperText: !formValidation.password && 'Пароль не должен быть пустым или простым. 10 знаков, буквы, цифры и специальный символ.',
          }}
        />
        }

        <SubmitButton content={'Подтвердить'} props={{ disabled: !isEdit }} />
      </FormContentColumn>
    </form>
  );
}
