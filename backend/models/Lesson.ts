import {
  model,
  Schema,
  Types,
  InferSchemaType,
} from 'mongoose';

const schema = new Schema({
  title: {
    type: String, required: true, trim: true,
  },
  teacher: {
    type: Types.ObjectId, ref: 'User', required: true, trim: true,
  },
  students: [
    { type: Types.ObjectId, ref: 'Student' },
  ],
  location: {
    type: Types.ObjectId, ref: 'Location', required: true, trim: true,
  },
  day: {
    type: Number, required: true, min: 0, max: 6, index: true,
  },
  timeStart: {
    type: Number, required: true, min: 0, max: 2359,
  },
  timeEnd: {
    type: Number, required: true, min: 0, max: 2359,
  },
  dateFrom: {
    type: Number, required: true,
  },
  dateTo: {
    type: Number, required: true,
  },
  isActive: { type: Boolean, required: true },
}, {
  timestamps: true,
});

const Lesson = model('Lesson', schema);
type ILesson = InferSchemaType<typeof schema>;

export { Lesson, ILesson };
