import { FormEvent, useEffect, useState } from 'react';
import { format } from 'date-fns';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Stack from '@mui/system/Stack';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { usePatchStudentMutation } from '../../shared/api';
import { SubmitButton } from '../../shared/components/buttons/SubmitButton';
import { FormContentColumn } from '../../shared/components/FormContentColumn';
import { IStudentModel, IStudentModelContact, KnowledgeSource } from '../../shared/models/IStudentModel';
import { DateField } from '../../shared/components/fields/DateField';
import { getKnowledgeSourceName } from '../../shared/helpers/getKnowladgeSourceName';
import { INPUT_DATE_FORMAT } from '../../shared/constants';

interface IContact {
  idx: number;
  handler: () => void;
  contactDetails: IStudentModelContact;
  disabled: boolean;
}

function NewContact({
  idx, handler, contactDetails, disabled,
}: IContact) {
  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <InputLabel>Контакт {idx + 1}</InputLabel>
        {idx > 0 && <IconButton onClick={handler}>
          <HighlightOffIcon />
        </IconButton>}
      </Stack>
      <TextField
        name={`contactName${idx + 1}`}
        label="Имя"
        required
        disabled={disabled}
        defaultValue={contactDetails.name}
      />
      <TextField
        name={`contactPhone${idx + 1}`}
        label="Телефон"
        type="number"
        required
        disabled={disabled}
        defaultValue={contactDetails.phone}
      />
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

export function ContentTabDetails({ student }: { student: IStudentModel }) {
  const [updadateStudent] = usePatchStudentMutation();
  const [contacts, setContacts] = useState<Array<number>>([0]);
  const [isEdit, setEdit] = useState(false);

  const [formValidation, setFormValidation] = useState({
    fullname: true,
    hasContacts: true,
    validPhone: true,
  });

  useEffect(() => {
    const contactsNum = new Array(student.contacts.length)
      .fill(0)
      .map((val, idx) => idx);

    setContacts(contactsNum);
  }, [student]);

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

    updadateStudent({
      id: student._id,
      newItem: {
        fullname: (formData.fullname as string).trim(),
        sex: formData.sex as string,
        birthday: +Date.parse(formData.birthday as string),
        balance: 0,
        contacts: studentContacts,
        knowledgeSource: formData.knowledgeSource as KnowledgeSource,
        comment: (formData.comment as string).trim() ?? '',
        isActive: true,
      },
    });
  };

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
          label="ФИО"
          defaultValue={student.fullname}
          disabled={!isEdit}
          fullWidth
          required
          error={!formValidation.fullname}
          helperText={!formValidation.fullname && 'Имя не должно быть пустым или слишком короткий'}
        />
        <DateField
          name="birthday"
          label="Дата рождения"
          defaultValue={format(student.birthday ?? 0, INPUT_DATE_FORMAT)}
          disabled={!isEdit}
        />

        <FormControl required>
          <FormLabel id="sex-label">Пол</FormLabel>
          <RadioGroup
            row
            name="sex"
            defaultValue={student.sex}
            aria-labelledby="sex-label"
          >
            <FormControlLabel
              value="female"
              label="Девочка"
              control={<Radio />}
              disabled={!isEdit}
            />
            <FormControlLabel
              value="male"
              label="Мальчик"
              control={<Radio />}
              disabled={!isEdit}
            />
          </RadioGroup>
        </FormControl>

        <hr/>

        {contacts.map((idx) => {
          const contactDetails = student.contacts[idx];
          return (
            <NewContact
              key={`contact${idx}`}
              idx={idx}
              handler={deleteContact}
              contactDetails={contactDetails}
              disabled={!isEdit}
            />
          );
        })}

        {!formValidation.hasContacts && <FormHelperText error children={'Заполните хотя бы один контакт'} />}
        {!formValidation.validPhone && <FormHelperText error children={'Проверьте введённый телефон'} />}

        <Button
          variant="outlined"
          onClick={addContact}
          disabled={!isEdit}
        >
          Добавить контакт
        </Button>
        <hr/>

        <FormControl>
          <FormLabel>Источник</FormLabel>
          <Select
            name='knowledgeSource'
            label='источник'
            defaultValue={student.knowledgeSource ?? KnowledgeSource.UNKNOWN}
            fullWidth
            disabled={!isEdit}
          >
            {
              Object.values(KnowledgeSource).map((source) => (
                <MenuItem key={source} value={source}>{getKnowledgeSourceName(source)}</MenuItem>
              ))
            }
          </Select>
        </FormControl>

        <TextField
          variant="outlined"
          name="comment"
          label="Комментарий"
          defaultValue={student.comment}
          disabled={!isEdit}
          fullWidth
          multiline
          minRows={3}
        />

      <SubmitButton content={'Подтвердить'} props={{ disabled: !isEdit }} />

      </FormContentColumn>
    </form>
  );
}
