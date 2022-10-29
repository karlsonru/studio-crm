import { model, Schema, Types } from 'mongoose';

const schema = new Schema({
  name: {
    type: String, required: true, trim: true, minLength: 2,
  },
  surname: {
    type: String, required: true, trim: true, minLength: 2,
  },
  sex: { type: String, required: true, trim: true },
  birthday: { type: Number, required: true },
  balance: { type: Number, default: 0 },
  visitingLessons: [ // уроки, которые посещает, в целом в настоящий момент
    {
      lesson: { type: Types.ObjectId, ref: 'Lesson' },
    },
  ],
  contacts: [{
    name: {
      type: String, trim: true, minLength: 2,
    },
    phone: { type: Number },
  }],
  isActive: { type: Boolean, required: true },
}, {
  timestamps: true,
});

const Student = model('Student', schema);

export { Student };
