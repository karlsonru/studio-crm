import { useCallback, useMemo, useState } from 'react';
import {
  DataGrid,
  GridActionsCellItem,
  GridEnrichedColDef,
  GridRowParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetStudentsQuery, useDeleteStudentMutation } from '../../shared/api/studentApi';
import { ConfirmationDialog, DeleteDialogText } from '../../shared/components/ConfirmationDialog';
import { IStudentModel } from '../../shared/models/IStudentModel';
import { useMobile } from '../../shared/hooks/useMobile';
import { CustomGridToolbar } from '../../shared/components/CustomGridToolbar';
import { dateValueFormatter } from '../../shared/helpers/dateValueFormatter';
import { SearchParamsButton } from '../../shared/components/SearchParamsButton';

export function StudentsContent() {
  const isMobile = useMobile();

  const [isModalOpen, setModalOpen] = useState(false);
  const [studentDetails, setStudentDetails] = useState<IStudentModel>();

  const { data, isLoading, error } = useGetStudentsQuery();
  const [deleteStudent] = useDeleteStudentMutation();

  const deleteStudentHandler = useCallback((currentStudent: IStudentModel) => {
    setStudentDetails(currentStudent);
    setModalOpen(true);
  }, [setModalOpen, setStudentDetails]);

  const columns: GridEnrichedColDef[] = useMemo(() => [
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
      valueFormatter: (params: GridValueFormatterParams<any>) => (
        params.value[0].phone
      ),
    },
    {
      field: 'sex',
      headerName: 'Пол',
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<any>) => (
        params.value === 'male' ? 'Мужской' : 'Женский'
      ),
    },
    {
      field: 'birthday',
      type: 'dateTime',
      headerName: 'Дата рождения',
      flex: 1,
      valueFormatter: dateValueFormatter,
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
          label="Delete"
          icon={<DeleteIcon />}
          onClick={() => {
            deleteStudentHandler(params.row);
          }
        }
      />,
      ],
    },
  ], [deleteStudentHandler]);

  if (isLoading || !data?.payload) {
    return null;
  }

  if (error) {
    return <h1>Error!!! </h1>;
  }

  const extendedToolbar = () => (
    CustomGridToolbar([
      <SearchParamsButton title="Добавить" param="create-student" />,
    ])
  );

  return (
    <DataGrid
      autoHeight
      columns={isMobile ? [columns[0]] : columns}
      rows={data.payload}
      getRowId={(item) => item._id}
      disableColumnMenu
      components={{
        Toolbar: extendedToolbar,
      }}
      localeText={{
        toolbarFilters: 'Фильтры',
      }}
    />
  );
}
