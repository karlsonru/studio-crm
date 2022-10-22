import { model, Schema } from 'mongoose';

export interface IRole {
  value: string;
}

const schema = new Schema<IRole>({
  value: {
    type: String, required: true, unique: true, default: 'teacher',
  },
});

const Role = model('Role', schema);

export { Role };
