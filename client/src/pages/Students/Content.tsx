import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useGetStudentsQuery, useDeleteStudentMutation } from '../../shared/api/studentApi';
import { ConfirmationDialog, DeleteDialogText } from '../../shared/components/ConfirmationDialog';
import { IStudentModel } from '../../shared/models/IStudentModel';
import { useMobile } from '../../shared/hooks/useMobile';
import { CustomGridToolbar } from '../../shared/components/CustomGridToolbar';
import { dateValueFormatter } from '../../shared/helpers/dateValueFormatter';
import { SearchParamsButton } from '../../shared/components/buttons/SearchParamsButton';
import { CreateStudentModal } from '../../shared/components/modals/CreateStudentModal';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { studentsPageActions } from '../../shared/reducers/studentsPageSlice';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { Loading } from '../../shared/components/Loading';
import { ShowError } from '../../shared/components/ShowError';

function ExtendedToolbar() {
  const [deleteStudent] = useDeleteStudentMutation();

  const actions = useActionCreators(studentsPageActions);

  const {
    isConfirmationDialog,
    currentStudent,
  } = useAppSelector((state) => state.studentsPageReducer);

  return CustomGridToolbar([
    <SearchParamsButton title="Добавить" param="create-student" />,
    <CreateStudentModal />,
    <ConfirmationDialog
      title="Удалить ученика"
      contentEl={<DeleteDialogText name={currentStudent?.fullname ?? ''} />}
      isOpen={isConfirmationDialog}
      setModalOpen={actions.setConfirmationDialog}
      callback={() => deleteStudent(currentStudent?._id ?? '')}
    />,
  ]);
}

export function StudentsContent() {
  const isMobile = useMobile();
  const actions = useActionCreators(studentsPageActions);
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetStudentsQuery();

  const deleteStudentHandler = useCallback((currentStudent: IStudentModel) => {
    actions.setCurrentStudent(currentStudent);
    actions.setConfirmationDialog(true);
  }, [actions.setCurrentStudent, actions.setConfirmationDialog]);

  const columns: GridColDef<IStudentModel>[] = useMemo(() => [
    {
      field: 'fullname',
      headerName: 'Ученик',
      flex: 1,
    },
    {
      field: 'contacts',
      headerName: 'Телефон',
      sortable: false,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<IStudentModel['contacts']>) => (
        params.value[0].phone
      ),
    },
    {
      field: 'sex',
      headerName: 'Пол',
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<IStudentModel['sex']>) => (
        params.value === 'male' ? 'Мужской' : 'Женский'
      ),
    },
    {
      field: 'birthday',
      type: 'date',
      headerName: 'Дата рождения',
      flex: 1,
      valueFormatter:
        (params: GridValueFormatterParams<IStudentModel['birthday']>) => dateValueFormatter(params.value ?? 0),
    },
    {
      field: 'isActive',
      headerName: 'Статус',
      flex: 1,
    },
    {
      field: 'actions',
      type: 'actions',
      getActions: (params: GridRowParams<IStudentModel>) => [
        <GridActionsCellItem
          label="WhatsApp"
          color="success"
          icon={<WhatsAppIcon />}
          onClick={() => window.open(
            `https://api.whatsapp.com/send/?phone=${params.row.contacts[0].phone}&text&type=phone_number`,
            '_blank',
          )}
        />,
        <GridActionsCellItem
          label="Delete"
          icon={<DeleteIcon />}
          onClick={() => deleteStudentHandler(params.row)}
      />,
      ],
    },
  ], [deleteStudentHandler, dateValueFormatter]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ShowError details={error} />;
  }

  if (!data) {
    return null;
  }

  return (
    <DataGrid
      autoHeight
      disableColumnMenu
      columns={isMobile ? [columns[0]] : columns}
      rows={data}
      getRowId={(item) => item._id}
      onRowDoubleClick={((params: GridRowParams<IStudentModel>) => navigate(`./${params.id}`))}
      components={{
        Toolbar: ExtendedToolbar,
      }}
      localeText={{
        toolbarFilters: 'Фильтры',
      }}
      initialState={{
        sorting: {
          sortModel: [{ field: 'fullname', sort: 'desc' }],
        },
      }}
    />
  );
}
