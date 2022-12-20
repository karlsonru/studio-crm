import {
  model,
  Schema,
  Types,
  InferSchemaType,
} from 'mongoose';

// пользователь это администратор, педагог или владелец
const schema = new Schema({
  login: {
    type: String, required: true, minLength: 5, unique: true, trim: true,
  },
  password: {
    type: String, required: true, minLength: 5, trim: true,
  },
  role: {
    type: Types.ObjectId, ref: 'Role', required: true, lowercase: true, trim: true,
  },
  name: {
    type: String, required: true, trim: true, minLength: 2,
  },
  surname: {
    type: String, required: true, trim: true, minLength: 2,
  },
  birthday: { type: Number },
  isActive: { type: Boolean, required: true },
}, {
  timestamps: true,
});

const User = model('User', schema);
type IUser = InferSchemaType<typeof schema>;

export { User, IUser };
