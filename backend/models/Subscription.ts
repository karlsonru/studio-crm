import { model, Schema, Types } from 'mongoose';

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
    type: String, required: true, trim: true,
  },
  student: {
    type: Types.ObjectId, ref: 'Student', required: true, trim: true,
  },
  dateFrom: {
    type: Number, required: true,
  },
  dateTo: {
    type: Number, required: true,
  },
  paymentMethod: {
    type: String, required: true, trim: true,
  },
  isActive: { type: Boolean, required: true },
}, {
  timestamps: true,
});

const Subscription = model('Subscription', schema);

export { Subscription };
