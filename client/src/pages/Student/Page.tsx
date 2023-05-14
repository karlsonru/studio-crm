import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetStudentQuery } from 'shared/api';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { setPageTitle } from '../../shared/reducers/appMenuSlice';
import { ContentTabDetails } from './ContentTabDetails';

export function StudentPage() {
  const dispatch = useAppDispatch();

  const { studentId } = useParams();

  const { data } = useGetStudentQuery(studentId ?? '');

  useEffect(() => {
    if (!data?.payload) return;

    dispatch(setPageTitle(data.payload.fullname));
  }, [data]);

  if (!studentId) return null;

  return <ContentTabDetails studentId={studentId} />;
}
