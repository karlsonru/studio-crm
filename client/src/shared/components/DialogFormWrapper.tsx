import React, { FormEvent, ReactNode } from 'react';
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
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: Array<ReactNode>;
}

export function DialogFormWrapper({
  title, isOpen, onClose, onSubmit, children,
}: IForm) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
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
              onClick={onClose}
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
