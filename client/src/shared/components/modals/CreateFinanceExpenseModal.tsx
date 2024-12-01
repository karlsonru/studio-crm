import { useState, FormEvent, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format, parse } from 'date-fns';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select/Select';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { MODAL_FORM_WIDTH } from 'shared/constants';
import {
  useCreateFinanceMutation,
  useGetLocationsQuery,
  useCreateFinanceCategoryMutation,
  useGetFinanceCategoriesQuery,
  useDeleteFinanceCategoryMutation,
} from '../../api';
import { DialogFormWrapper } from '../DialogFormWrapper';
import { NumberField } from '../fields/NumberField';
import { ConfirmationDialog, DeleteDialogText } from '../ConfirmationDialog';

function validateFrom(formData: { [key: string]: FormDataEntryValue }) {
  if ((formData.title as string).trim().length < 3) {
    return 'title';
  }

  return '';
}

export function CreateFinanceExpenseModal() {
  const [searchParams] = useSearchParams();
  const ref = useRef<HTMLInputElement>(null);

  const [createExpense, requestStatus] = useCreateFinanceMutation();
  const { data: locationsData, isSuccess: isLocationsSuccess } = useGetLocationsQuery();

  const [categoryNameId, setCategoryNameId] = useState('');
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [createCategory] = useCreateFinanceCategoryMutation();
  const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState(false);
  const [deleteCaregory] = useDeleteFinanceCategoryMutation();

  const {
    data: categoriesData,
    isSuccess:
    isCategoriesSuccess,
  } = useGetFinanceCategoriesQuery();

  const [formValidation, setFormValidation] = useState({
    title: true,
    amount: true,
  });

  const categoryName = categoryNameId ? categoriesData?.find((category) => category._id === categoryNameId)?.name : 'noCategory';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = Object.fromEntries(new FormData(form).entries());

    setFormValidation({
      title: true,
      amount: true,
    });

    const errorName = validateFrom(formData);
    if (errorName) {
      setFormValidation(() => ({
        ...formValidation,
        [errorName]: false,
      }));
      return;
    }

    createExpense({
      title: formData.title as string,
      amount: +formData.amount,
      categoryName,
      location: formData.location as string,
      date: parse(formData.date as string, 'yyyy-MM-dd', 0).getTime(),
      comment: formData.comment as string,
    });

    form.reset();
  };

  return (
    <>
      <DialogFormWrapper
        title='Добавить расходы'
        isOpen={searchParams.has('create-expense')}
        onSubmit={handleSubmit}
        requestStatus={requestStatus}
      >
        <TextField
          name='title'
          label='Цель'
          placeholder='Цель'
          autoFocus
          fullWidth
          required
          error={!formValidation.title}
          helperText={!formValidation.title ? 'Укажите название не менее 3х символов' : ''}
          inputProps={{
            minLength: 3,
          }}
        />

        <NumberField
          name="amount"
          label="Сумма"
          error={false}
          minValue={0}
          props={{
            required: true,
          }}
        />

        <FormControl>
          <FormLabel>Категория</FormLabel>
          <Select
            name='categoryName'
            label='Категория'
            defaultValue='noCategory'
            fullWidth
            required
            onChange={(e) => setCategoryNameId(e.target.value)}
          >
            <MenuItem key="noCategory" value="noCategory">Без категории</MenuItem>

            { isCategoriesSuccess
                && categoriesData.map((category) => (
                  <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
                ))}
          </Select>

          <Stack
            direction="row"
            spacing={1}
            my={1}
          >
            <Button
              variant="outlined"
              onClick={() => setIsAddCategoryOpen(true)}
            >
              <AddIcon />
            </Button>

            <Button
              variant="outlined"
              onClick={() => {
                if (!categoryNameId) {
                  return;
                }

                setIsDeleteCategoryOpen(true);
              }}
            >
              <RemoveCircleOutlineIcon />
            </Button>
          </Stack>
        </FormControl>

        <FormControl>
          <FormLabel>Помещение</FormLabel>
          <Select
            name='location'
            label='Помещение'
            defaultValue='common'
            fullWidth
            required
          >
          <MenuItem key="common" value="common">Общий</MenuItem>
          { isLocationsSuccess
              && locationsData.map((location) => (
                <MenuItem key={location._id} value={location._id}>{location.title}</MenuItem>
              ))}
          </Select>
        </FormControl>

        <TextField
          name='date'
          type='date'
          label='Дата'
          defaultValue={format(new Date(), 'yyyy-MM-dd')}
          required
          fullWidth
          InputProps={{
            endAdornment: <InputAdornment position='end'>Дата</InputAdornment>,
          }}
        />

        <TextField
          name='comment'
          label='Комментарий'
          placeholder='Комментарий'
          autoFocus
          fullWidth
          multiline
          minRows={3}
          inputProps={{
            minLength: 3,
          }}
        />

      </DialogFormWrapper>

      <ConfirmationDialog
        title="Удалить категорию"
        contentEl={<DeleteDialogText name={categoryName ?? ''} />}
        isOpen={isDeleteCategoryOpen}
        setModalOpen={() => setIsDeleteCategoryOpen(false)}
        callback={() => deleteCaregory(categoryNameId)}
      />

      <ConfirmationDialog
        title="Добавить категорию"
        contentEl={
          <TextField
            inputRef={ref}
            variant="standard"
            label="Название"
            fullWidth
            sx={{ width: MODAL_FORM_WIDTH }}
          />}
        isOpen={isAddCategoryOpen}
        setModalOpen={() => setIsAddCategoryOpen(false)}
        callback={() => createCategory({ name: ref.current?.value ?? '' })}
      />
    </>
  );
}
