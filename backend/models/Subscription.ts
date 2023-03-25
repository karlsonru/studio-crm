import {
  InferSchemaType, model, Schema, Types,
} from 'mongoose';

const schema = new Schema({
  student: {
    type: Types.ObjectId, ref: 'Student', required: true, index: true,
  },
  template: {
    type: Types.ObjectId, ref: 'SubscriptionTemplate', required: true,
  },
  lesson: {
    type: Types.ObjectId, ref: 'Lesson', required: true, nullable: true, index: true,
  },
  price: {
    type: Number, required: true, min: 0,
  },
  visits: {
    type: Number, required: true, min: 1,
  },
  visitsLeft: {
    type: Number, required: true, min: 0,
  },
  duration: {
    type: String, required: true, trim: true,
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
type ISubscription = InferSchemaType<typeof schema>;

export { Subscription, ISubscription };
