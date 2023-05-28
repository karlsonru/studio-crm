import { useTitle } from '../../shared/hooks/useTitle';
import { SearchParamsButton } from '../../shared/components/buttons/SearchParamsButton';
import { CreateUserModal } from '../../shared/components/modals/CreateUserModal';
import { UpdateUserModal } from '../../shared/components/modals/UpdateUserModal';
import { UsersContent } from './Content';

export function UsersPage() {
  useTitle('Сотрудники');

  return (
    <>
      <header style={{
        marginBottom: '1rem',
        textAlign: 'right',
      }}>
        <CreateUserModal />
        <UpdateUserModal />
        <SearchParamsButton title='Добавить' param='create-user'/>
      </header>

      <UsersContent />
    </>
  );
}
