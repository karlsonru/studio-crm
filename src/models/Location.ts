import { model, Schema } from 'mongoose';

const schema = new Schema({
  title: {
    type: String, required: true, unique: true, lowercase: true, trim: true,
  },
  description: {
    type: String, lowercase: true, trim: true,
  },
  address: {
    type: String, required: true, unique: true, lowercase: true, trim: true,
  },
  isActive: { type: Boolean, required: true },
});

const Location = model('Location', schema);

export { Location };
