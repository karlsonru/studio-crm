import { model, Schema, Types } from 'mongoose';

const schema = new Schema({
  lesson: {
    type: Types.ObjectId, ref: 'Lesson', required: true,
  },
  day: {
    type: Number, required: true, min: 0, max: 6,
  },
  date: {
    type: Number, required: true,
  },
  students: [
    {
      student: {
        type: Types.ObjectId, ref: 'Student', required: true,
      },
      visitStatus: {
        type: Types.ObjectId, ref: 'VisitStatus', required: true,
      },
    },
  ],
}, {
  timestamps: true,
});

const VisitedLesson = model('VisitedLesson', schema);

export { VisitedLesson };
