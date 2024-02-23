import { useState } from 'react';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import SyncIcon from '@mui/icons-material/Sync';
import { CardWrapper } from '../../shared/components/CardWrapper';
import { ChangeTeacherDialog } from '../../shared/components/ChangeTeacherDialog';
import { ILessonModel } from '../../shared/models/ILessonModel';
import { IAttendanceModel } from '../../shared/models/IAttendanceModel';
import { IUserModel } from '../../shared/models/IUserModel';

interface ITeacherCard {
  teacher: IUserModel;
  lesson?: ILessonModel;
  attendance?: IAttendanceModel;
}

export function TeacherCard({ teacher, lesson, attendance }: ITeacherCard) {
  const [isChangeTeacher, setChangeTeacher] = useState(false);

  return (
    <>
      <CardWrapper extraStyle={{ height: 'max-content' }}>
        <CardHeader
          title={teacher.fullname}
          titleTypographyProps={{ variant: 'h6' }}
          subheader='Кто провел занятие'
          action={
            <IconButton
              title='Заменить преподавателя'
              onClick={() => setChangeTeacher(true)}
            >
              <SyncIcon />
            </IconButton>
          } />
      </CardWrapper>

      <ChangeTeacherDialog
        lesson={lesson}
        attendance={attendance}
        isOpen={isChangeTeacher}
        setModalOpen={setChangeTeacher}
        />
    </>
  );
}
