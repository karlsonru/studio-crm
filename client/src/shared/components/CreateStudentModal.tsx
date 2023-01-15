import { useSearchParams } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Stack from '@mui/system/Stack';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';

function NewContact({ idx }: { idx: number }) {
  return (
    <>
      <InputLabel>Контакт {idx + 1}</InputLabel>
      <TextField name={`name${idx}`} label="Имя" />
      <TextField name={`phone${idx}`} label="Телефон" type="number" />
    </>
  );
}

export function CreateStudentModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [contacts, setContacts] = useState<Array<number>>([0]);

  const addContact = () => {
    setContacts((prevState) => [...prevState, prevState.length]);
  };

  return (
    <Dialog open={searchParams.has('create-student')} onClose={() => setSearchParams('')}>
      <DialogTitle>Добавить ученика</DialogTitle>
      <DialogContent>
        <form>

          <Stack pt={1} direction="column" spacing={2} width={500}>

            <TextField fullWidth variant="outlined" name="fullname" label="ФИО" />
            <TextField fullWidth type="date" variant="outlined" name="birthday" label="Дата рождения" InputLabelProps={{ shrink: true }} />

            <FormControl>
              <FormLabel id="sex-label">Пол</FormLabel>
              <RadioGroup row aria-labelledby="sex-label" name="sex">
                <FormControlLabel value="female" control={<Radio />} label="Девочка" />
                <FormControlLabel value="male" control={<Radio />} label="Мальчик" />
              </RadioGroup>
            </FormControl>

            <hr/>
            {contacts.map((idx) => <NewContact key={`contact${idx}`} idx={idx} />)}
            <Button variant="outlined" onClick={addContact}>Добавить контакт</Button>

            <hr/>
            <InputLabel>Комментарий</InputLabel>
            <TextareaAutosize name="comment" minRows={5} />

          </Stack>

          <DialogActions sx={{ paddingRight: '0', marginTop: '1rem' }}>
            <Button autoFocus variant='contained' color='error' onClick={() => setSearchParams('')}>
              Закрыть
            </Button>
            <Button type='submit' variant='contained' color='success'>Подтвердить</Button>
          </DialogActions>

        </form>

      </DialogContent>
    </Dialog>
  );
}
