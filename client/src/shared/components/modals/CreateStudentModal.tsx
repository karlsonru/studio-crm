import { FormEvent, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Stack from '@mui/system/Stack';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import { SubmitButton } from '../buttons/SubmitButton';
import { FormContentColumn } from '../FormContentColumn';
import { useCreateStudentMutation } from '../../api';

function NewContact({ idx, handler }: { idx: number, handler: () => void }) {
  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <InputLabel>Контакт {idx + 1}</InputLabel>
        {idx > 0 && <IconButton onClick={handler}>
          <HighlightOffIcon />
        </IconButton>}
      </Stack>
      <TextField name={`contactName${idx + 1}`} label="Имя" required />
      <TextField name={`contactPhone${idx + 1}`} label="Телефон" type="number" required />
    </>
  );
}

function validateForm(formData: { [key: string]: FormDataEntryValue }) {
  if (!formData.fullname || (formData.fullname as string).trim().length < 3) {
    return 'fullname';
  }

  if (!formData.contactName1 || (formData.contactName1 as string).trim().length < 2) {
    return 'hasContacts';
  }

  if (!formData.contactPhone1 || (formData.contactPhone1 as string).trim().length !== 11) {
    return 'validPhone';
  }

  return '';
}

export function CreateStudentModal() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [createStudent, { isSuccess, isError, data }] = useCreateStudentMutation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [contacts, setContacts] = useState<Array<number>>([0]);
  const [formValidation, setFormValidation] = useState({
    fullname: true,
    hasContacts: true,
    validPhone: true,
  });

  const addContact = () => {
    setContacts((prevState) => [...prevState, prevState.length]);
  };

  const deleteContact = () => {
    setContacts((prevState) => [...prevState.slice(0, -1)]);
  };

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = Object.fromEntries(new FormData(form).entries());

    validateForm(formData);

    setFormValidation({
      fullname: true,
      hasContacts: true,
      validPhone: true,
    });

    const errorName = validateForm(formData);
    if (errorName) {
      setFormValidation(() => ({
        ...formValidation,
        [errorName]: false,
      }));
      return;
    }

    const studentContacts = contacts.map((idx) => ({
      name: formData[`contactName${idx + 1}`] as string,
      phone: +(formData[`contactPhone${idx + 1}`] as string),
    }));

    createStudent({
      fullname: (formData.fullname as string).trim(),
      sex: formData.sex as string,
      birthday: +Date.parse(formData.birthday as string),
      balance: 0,
      contacts: studentContacts,
      comment: (formData.comment as string).trim() ?? '',
      isActive: true,
    });

    form.reset();
  };

  return (
    <Dialog open={searchParams.has('create-student')} onClose={() => setSearchParams('')}>
      <DialogTitle>Добавить ученика</DialogTitle>

      <DialogContent>
        <form onSubmit={submitHandler}>
          <FormContentColumn>
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

            <FormControl required>
              <FormLabel id="sex-label">Пол</FormLabel>
              <RadioGroup row aria-labelledby="sex-label" name="sex">
                <FormControlLabel value="female" control={<Radio />} label="Девочка" />
                <FormControlLabel value="male" control={<Radio />} label="Мальчик" />
              </RadioGroup>
            </FormControl>

            <hr/>
            {contacts.map((idx) => <NewContact key={`contact${idx}`} idx={idx} handler={deleteContact} />)}

            {!formValidation.hasContacts && <FormHelperText error children={'Заполните хотя бы один контакт'} />}
            {!formValidation.validPhone && <FormHelperText error children={'Проверьте введённый телефон'} />}

            <Button variant="outlined" onClick={addContact}>Добавить контакт</Button>
            <hr/>

            <InputLabel>Комментарий</InputLabel>
            <TextareaAutosize name="comment" minRows={5} />

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