import {
  FormEvent,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { FormContentColumn } from './FormContentColumn';
import { SubmitButton } from './buttons/SubmitButton';
import { getErrorMessage } from '../helpers/getErrorMessage';

interface IForm {
  title: string;
  isOpen: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: Array<ReactNode>;
  onClose?: () => void;
  requestStatus?: {
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error?: FetchBaseQueryError | string | SerializedError | undefined;
    reset: () => void;
  };
  dialogProps?: Partial<DialogProps>;
}

export function DialogFormWrapper({
  title, isOpen, onSubmit, children, requestStatus, dialogProps, onClose,
}: IForm) {
  const {
    isSuccess, isError, error, reset, isLoading,
  } = requestStatus ?? {};

  const ref = useRef<HTMLFormElement>();
  const [, setSearchParams] = useSearchParams();

  const closeHandler = () => {
    // сбросим кэш запроса перед закрытием
    if (reset) {
      reset();
    }

    // если передан кастомынй close handler - вызываем его
    if (onClose) {
      onClose();
    }

    setSearchParams(undefined);
  };

  useEffect(() => {
    if (!isSuccess) return;

    ref.current?.reset();
  }, [isSuccess]);

  return (
    <Dialog open={isOpen} onClose={closeHandler} {...dialogProps}>
      <DialogTitle pb={1}>{title}</DialogTitle>

      {isSuccess && <DialogTitle
        color="success.main"
        variant='subtitle1'
        sx={{ py: 1 }}
        >
          Успешно!
        </DialogTitle>
      }

      {isError && <DialogTitle
          color="error"
          variant='subtitle1'
        >
          {`Не удалось :( ${getErrorMessage(error)}`}
        </DialogTitle>
      }

      <DialogContent>
        <Box
          component='form'
          onSubmit={onSubmit}
          ref={ref}
        >
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
            <SubmitButton
              content={'Подтвердить'}
              props={{
                disabled: isLoading,
              }}
            />
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
