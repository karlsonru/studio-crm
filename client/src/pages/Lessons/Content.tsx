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
import { useGetLessonsQuery, useDeleteLessonMutation } from '../../shared/api/lessonApi';
import { useMobile } from '../../shared/hooks/useMobile';
import { ILessonModel } from '../../shared/models/ILessonModel';
import { ConfirmationDialog, DeleteDialogText } from '../../shared/components/ConfirmationDialog';
import { getDayName } from '../../shared/helpers/getDayName';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { lessonsPageActions } from '../../shared/reducers/lessonsPageSlice';
import { SearchParamsButton } from '../../shared/components/buttons/SearchParamsButton';
import { CreateLessonModal } from '../../shared/components/modals/CreateLessonModal';
import { CustomGridToolbar } from '../../shared/components/CustomGridToolbar';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { convertTime } from '../../shared/helpers/convertTime';
import { Loading } from '../../shared/components/Loading';
import { ShowError } from '../../shared/components/ShowError';

function ExtendedToolbar() {
  const [deleteLesson] = useDeleteLessonMutation();

  const actions = useActionCreators(lessonsPageActions);

  const {
    isConfirmationDialog,
    currentLesson,
  } = useAppSelector((state) => state.lessonsPageReducer);

  return CustomGridToolbar([
    <SearchParamsButton title="Добавить" param="create-lesson" />,
    <CreateLessonModal />,
    <ConfirmationDialog
      title="Удалить занятие"
      contentEl={<DeleteDialogText name={currentLesson?.title ?? ''} />}
      isOpen={isConfirmationDialog}
      setModalOpen={actions.setConfirmationDialog}
      callback={() => deleteLesson(currentLesson?._id ?? '')}
    />,
  ]);
}

export function LessonsContent() {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const actions = useActionCreators(lessonsPageActions);

  const {
    data, isLoading, isError, error,
  } = useGetLessonsQuery();

  const deleteLessonHandler = useCallback((currentLesson: ILessonModel) => {
    actions.setCurrentLesson(currentLesson);
    actions.setConfirmationDialog(true);
  }, [actions.setCurrentLesson, actions.setConfirmationDialog]);

  const columns: GridColDef<ILessonModel>[] = useMemo(() => [
    {
      field: 'title',
      headerName: 'Название',
      flex: 1,
    },
    {
      field: 'day',
      headerName: 'День',
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<ILessonModel['day']>) => (
        getDayName(params.value)
      ),
    },
    {
      field: 'timeStart',
      headerName: 'Время',
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams<ILessonModel['timeStart']>) => convertTime(params.value),
    },
    /*
    {
      field: 'type',
      headerName: 'Тип',
      flex: 1,
    },
    */
    {
      field: 'activeStudents',
      type: 'number',
      headerName: 'Ученики',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'isActive',
      headerName: 'Статус',
      flex: 1,
    },
    {
      field: 'actions',
      type: 'actions',
      getActions: (params: GridRowParams<ILessonModel>) => [
        <GridActionsCellItem
          label="Delete"
          icon={<DeleteIcon />}
          onClick={() => deleteLessonHandler(params.row)}
      />,
      ],
    },
  ], [deleteLessonHandler]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ShowError details={error} />;
  }

  if (!data) {
    return null;
  }

  return (
    <DataGrid
      autoHeight
      columns={isMobile ? [columns[0]] : columns}
      rows={data}
      getRowId={(item) => item._id}
      disableColumnMenu
      density="comfortable"
      pageSizeOptions={[10, 25]}
      onRowDoubleClick={((params: GridRowParams<ILessonModel>) => navigate(`./${params.id}`))}
      components={{
        Toolbar: ExtendedToolbar,
      }}
      localeText={{
        toolbarFilters: 'Фильтры',
      }}
      initialState={{
        sorting: {
          sortModel: [{ field: 'day', sort: 'asc' }],
        },
        pagination: {
          paginationModel: { pageSize: 10 },
        },
      }}
    />
  );
}
