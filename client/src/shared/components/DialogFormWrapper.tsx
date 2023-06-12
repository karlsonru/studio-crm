import { FormEvent, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { FormContentColumn } from './FormContentColumn';
import { SubmitButton } from './buttons/SubmitButton';

interface IForm {
  title: string;
  isOpen: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: Array<ReactNode>;
}

export function DialogFormWrapper({
  title, isOpen, onSubmit, children,
}: IForm) {
  const [, setSearchParams] = useSearchParams();
  const closeHandler = () => setSearchParams(undefined);

  return (
    <Dialog open={isOpen} onClose={closeHandler}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Box component='form' onSubmit={onSubmit}>
          <FormContentColumn>
            { children }
          </FormContentColumn>

          <DialogActions sx={{ paddingRight: '0' }}>
            <Button
              autoFocus
              variant='contained'
              color='error'
              onClick={closeHandler}
            >
              Закрыть
            </Button>
            <SubmitButton content={'Подтвердить'} />
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
