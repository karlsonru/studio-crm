import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Subscription } from './subscription.schema';

export type VisitBillingStatusDocument = HydratedDocument<VisitBillingStatus>;

enum BillingStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
  UNCHARGED = 'uncharged',
}

@Schema({
  timestamps: true,
})
export class VisitBillingStatus {
  _id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Subscription',
  })
  subscription: Subscription | null;

  @Prop({
    type: String,
    default: BillingStatus.UNCHARGED,
    trim: true,
    enum: BillingStatus,
  })
  status: BillingStatus;
}

export const VisitBillingStatusSchema = SchemaFactory.createForClass(VisitBillingStatus);
