import { model, Schema, Types } from 'mongoose';

const schema = new Schema({
  title: {
    type: String, required: true, unique: true, trim: true,
  },
  teacher: {
    type: Types.ObjectId, ref: 'User', required: true, trim: true,
  },
  location: {
    type: Types.ObjectId, ref: 'Location', required: true, trim: true,
  },
  day: {
    type: Number, required: true, min: 0, max: 6,
  },
  timeStart: {
    type: Number, required: true, min: 0, max: 2359,
  },
  timeEnd: {
    type: String, required: true, min: 0, max: 2359,
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

export { Lesson };
