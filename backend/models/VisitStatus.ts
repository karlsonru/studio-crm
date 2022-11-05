import { model, Schema } from 'mongoose';

const schema = new Schema({
  title: {
    type: String, required: true, unique: true, trim: true,
  },
  action: {
    type: String, required: true, trim: true,
  },
  isActive: { type: Boolean, required: true },
}, {
  timestamps: true,
});

const VisitStatus = model('VisitStatus', schema);

export { VisitStatus };
