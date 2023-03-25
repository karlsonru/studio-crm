import { model, Schema, Types } from 'mongoose';

const schema = new Schema({
  lesson: {
    type: Types.ObjectId, ref: 'Lesson', required: true, index: true,
  },
  day: {
    type: Number, required: true, min: 0, max: 6,
  },
  date: {
    type: Number, required: true, index: true,
  },
  teacher: {
    type: Types.ObjectId, ref: 'User', required: true,
  },
  students: [
    {
      student: {
        type: Types.ObjectId, ref: 'Student', required: true,
      },
      /*
      visitStatus: {
        type: Types.ObjectId, ref: 'VisitStatus', required: true,
      },
      */
      visitStatus: {
        type: Number, required: true,
      },
    },
  ],
}, {
  timestamps: true,
});

const VisitedLesson = model('Visit', schema);

export { VisitedLesson };
