import { model, Schema } from 'mongoose';

const schema = new Schema({
  title: {
    type: String, required: true, unique: true, trim: true,
  },
  description: {
    type: String, trim: true,
  },
  address: {
    type: String, required: true, unique: true, trim: true,
  },
  isActive: { type: Boolean, required: true },
});

const Location = model('Location', schema);

export { Location };
