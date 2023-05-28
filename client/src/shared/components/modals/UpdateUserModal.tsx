import { FormEvent, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { UserRole, userRoleLocal } from '../../models/IUserModel';
import { SubmitButton } from '../buttons/SubmitButton';
import { FormContentColumn } from '../FormContentColumn';
import { usePatchUserMutation, useGetUsersQuery } from '../../api';
import { NumberField } from '../fields/NumberField';

function validateForm(formData: { [key: string]: FormDataEntryValue }) {
  if (!formData.fullname || (formData.fullname as string).trim().length < 3) {
    return 'fullname';
  }

  if (!formData.phone || (formData.phone as string).trim().length !== 11) {
    return 'phone';
  }

  if (formData.login && (formData.login as string).trim().length < 3) {
    return 'login';
  }

  if (formData.password) {
    const password = (formData.password as string).trim();
    if (password.length < 10) {
      return 'password';
    }

    if (!(/^.*(?=.{10,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/g).test(password)) {
      return 'password';
    }
  }

  return '';
}

export function UpdateUserModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: userEdit } = useGetUsersQuery(undefined, {
    selectFromResult: ({ data }) => ({
      data: data?.payload.find((user) => user._id === searchParams.get('id')),
    }),
  });

  const [canAuthorize, setCanAuthorize] = useState(false);
  const [updateUser] = usePatchUserMutation();
  const [formValidation, setFormValidation] = useState({
    fullname: true,
    phone: true,
    login: true,
    password: true,
  });

  if (!userEdit) {
    return null;
  }

  if (userEdit?.login) {
    setCanAuthorize(true);
  }

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

    updateUser({
      id: '',
      newItem: {
        fullname: (formData.fullname as string).trim(),
        birthday: +Date.parse(formData.birthday as string),
        role: formData.role as UserRole,
        phone: +(formData.phone as string).trim(),
        salary: +(formData.salary as string).trim(),
        login: (formData.login as string)?.trim(),
        password: (formData.password as string)?.trim(),
        isActive: true,
      },
    });

    form.reset();
  };

  return (
    <Dialog open={searchParams.has('update-user')} onClose={() => setSearchParams('')}>
      <DialogTitle>Редактировать сотрудника</DialogTitle>

      <DialogContent>
        <form onSubmit={submitHandler}>
          <FormContentColumn>
            <TextField
              variant="outlined"
              name="fullname"
              defaultValue={userEdit.fullname}
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
              defaultValue={format(userEdit.birthday, 'dd-MM-yyyy')}
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
              minValue={7_900_000_00_00}
              defaultValue={userEdit.phone}
              helperText='Проверьте введённый телефон'
            />

            <NumberField
              name="salary"
              label="Оплата"
              error={false}
              minValue={0}
              defaultValue={userEdit.salary}
            />

            <FormControlLabel
              label="Доступ в CRM"
              control={
                <Checkbox
                  checked={canAuthorize}
                  onChange={() => setCanAuthorize((prev) => !prev)}
                />
              }
            />

            {canAuthorize && <TextField
              variant="outlined"
              name="login"
              label="Логин"
              defaultValue={userEdit.login}
              fullWidth
              required
              error={!formValidation.login}
              helperText={!formValidation.login && 'Логин не должен быть пустым или слишком коротким'}
            />
            }

            {canAuthorize && <TextField
              variant="outlined"
              name="oldPassword"
              type="oldPassword"
              label="Старый пароль"
              fullWidth
              required
              error={!formValidation.password}
              helperText={!formValidation.password && 'Пароль не должен быть пустым или простым. 10 знаков, буквы, цифры и специальный символ.'}
            />
            }

            {canAuthorize && <TextField
              variant="outlined"
              name="newPassword"
              type="newPassword"
              label="Новый пароль"
              fullWidth
              required
              error={!formValidation.password}
              helperText={!formValidation.password && 'Пароль не должен быть пустым или простым. 10 знаков, буквы, цифры и специальный символ.'}
            />
            }

          </FormContentColumn>

          <DialogActions sx={{ paddingRight: '0' }}>
            <Button
              autoFocus
              variant='contained'
              color='error'
              onClick={() => setSearchParams('')}
            >
              Закрыть
            </Button>
            <SubmitButton content={'Подтвердить'} />
          </DialogActions>
        </form>

      </DialogContent>
    </Dialog>
  );
}
