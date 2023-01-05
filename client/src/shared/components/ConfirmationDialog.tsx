import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ReactElement } from 'react';

interface IConfirmationDialog {
  title: string;
  isOpen: boolean;
  contentEl: ReactElement;
  setModalOpen: (value: boolean) => void;
  callback?: () => void;
}

export function DeleteDialogText({ name }: { name: string }) {
  return <DialogContentText>Вы уверены что хотите удалить {name}?</DialogContentText>;
}

export function ConfirmationDialog(
  {
    title,
    isOpen,
    setModalOpen,
    contentEl,
    callback,
  }: IConfirmationDialog,
) {
  const handleOk = () => {
    if (callback) {
      callback();
    }
    setModalOpen(false);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <Dialog open={isOpen} maxWidth='xl' transitionDuration={500} onClose={() => setModalOpen(false)}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        { contentEl }
      </DialogContent>
      <DialogActions>
        <Button autoFocus variant='contained' color='error' onClick={handleCancel}>
          Закрыть
        </Button>
        <Button variant='contained' color='success' onClick={handleOk}>Подтвердить</Button>
      </DialogActions>
    </Dialog>
  );
}
