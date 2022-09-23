import { model, Schema } from 'mongoose';

// пользователь это администратор, педагог или владелец
const schema = new Schema({
  login: {
    type: String, required: true, minLength: 5, unique: true, trim: true,
  },
  password: {
    type: String, required: true, minLength: 7, trim: true,
  },
  role: {
    type: String, required: true, loawercase: true, trim: true,
  },
  name: { type: String, required: true, trim: true },
  surname: { type: String, required: true, trim: true },
  birthday: { type: Date },
  isActive: { type: Boolean },
});

const User = model('User', schema);

export { User };
