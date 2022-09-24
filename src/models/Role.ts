import { model, Schema } from 'mongoose';

const schema = new Schema({
  value: {
    type: String, required: true, unique: true, default: 'teacher',
  },
});

const Role = model('Role', schema);

export { Role };
