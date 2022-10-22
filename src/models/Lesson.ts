import { model, Schema, Types } from 'mongoose';

const schema = new Schema({
  title: {
    type: String, required: true, unique: true, lowercase: true, trim: true,
  },
  teacher: {
    type: Types.ObjectId, ref: 'User', required: true, lowercase: true, trim: true,
  },
  location: {
    type: String, required: true, lowercase: true, trim: true,
  },
  day: {
    type: Number, required: true, min: 0, max: 6,
  },
  timeHh: {
    type: Number, required: true, min: 0, max: 23,
  },
  timeMin: {
    type: Number, required: true, min: 0, max: 59,
  },
  timeDuration: {
    type: Number, required: true, min: 0, max: 300,
  },
  isActive: { type: Boolean, required: true },
});

const Lesson = model('Lesson', schema);

export { Lesson };
