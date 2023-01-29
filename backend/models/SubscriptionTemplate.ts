import { model, Schema } from 'mongoose';

const schema = new Schema({
  title: {
    type: String, required: true, unique: true, trim: true,
  },
  price: {
    type: Number, required: true, min: 0,
  },
  visits: {
    type: Number, required: true, min: 1,
  },
  duration: {
    type: Number, required: true, min: 86400000,
  },
  isActive: { type: Boolean, required: true },
}, {
  timestamps: true,
});

const SubscriptionTemplate = model('SubscriptionTemplate', schema);

export { SubscriptionTemplate };
