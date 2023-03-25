import { model, Schema } from 'mongoose';

const schema = new Schema({
  fullname: {
    type: String, required: true, trim: true, minLength: 2,
  },
  sex: {
    type: String, required: true, trim: true,
  },
  birthday: {
    type: Number, required: true,
  },
  balance: {
    type: Number, default: 0,
  },
  contacts: [{
    name: {
      type: String, trim: true, minLength: 2,
    },
    phone: { type: Number },
  }],
  source: {
    type: String,
  }, // источник, откуда ребёнок узнал о занятии
  isActive: {
    type: Boolean, required: true,
  },
}, {
  timestamps: true,
});

const Student = model('Student', schema);

export { Student };
