import { useCallback, useMemo } from 'react';
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
import { SearchParamsButton } from '../../shared/components/SearchParamsButton';
import { CreateLessonModal } from '../../shared/components/CreateLessonModal';
import { CustomGridToolbar } from '../../shared/components/CustomGridToolbar';
import { useActionCreators } from '../../shared/hooks/useActionCreators';
import { convertTime } from '../../shared/helpers/convertTime';

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
  const actions = useActionCreators(lessonsPageActions);

  const { data, isLoading, error } = useGetLessonsQuery();

  const deleteLessonHandler = useCallback((currentStudent: ILessonModel) => {
    actions.setCurrentLesson(currentStudent);
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

  if (isLoading || !data?.payload) {
    return null;
  }

  if (error) {
    return <h1>Error!!! </h1>;
  }

  return (
    <DataGrid
      autoHeight
      columns={isMobile ? [columns[0]] : columns}
      rows={data.payload}
      getRowId={(item) => item._id}
      disableColumnMenu
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
      }}
    />
  );
}
