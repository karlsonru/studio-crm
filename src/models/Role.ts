import { model, Schema } from 'mongoose';
/*
export interface IRole {
  value: string;
}
*/
const schema = new Schema({
  value: {
    type: String, required: true, unique: true, default: 'teacher', lowercase: true, trim: true,
  },
}, {
  timestamps: true,
});

const Role = model('Role', schema);

export { Role };
