import Box from '@mui/system/Box';
import { useTitle } from '../../shared/hooks/useTitle';
import { SearchParamsButton } from '../../shared/components/buttons/SearchParamsButton';
import { CreateUserModal } from '../../shared/components/modals/CreateUserModal';
import { UsersContent } from './Content';

export function UsersPage() {
  useTitle('Сотрудники');

  return (
    <>
      <Box component="header" sx={{ mb: '1rem', textAlign: 'right' }} >
        <CreateUserModal />
        <SearchParamsButton title='Добавить' param='create-user'/>
      </Box>

      <UsersContent />
    </>
  );
}
