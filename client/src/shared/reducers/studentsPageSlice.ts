import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IStudentModel } from '../models/IStudentModel';

interface IStudentsPageState {
  students: IStudentModel[],
  studentsIds: string[],
  currentStudent?: IStudentModel,
  isConfirmationDialog: boolean;
}

const initialState: IStudentsPageState = {
  students: [],
  studentsIds: [],
  isConfirmationDialog: false,
};

const studentsPageState = createSlice({
  name: 'studentsPage',
  initialState,
  reducers: {
    setCurrentStudent: (state, action: PayloadAction<IStudentModel>) => {
      state.currentStudent = action.payload;
    },
    setConfirmationDialog: (state, action: PayloadAction<boolean>) => {
      state.isConfirmationDialog = action.payload;
    },
  },
});

export const { reducer: studentsPageReducer, actions: studentsPageActions } = studentsPageState;
