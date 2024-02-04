import { PaymentStatus } from '../models/IAttendanceModel';

export function getBillingStatusNameAndColor(billingStatus?: PaymentStatus) {
  switch (billingStatus) {
    case PaymentStatus.PAID:
      return {
        name: 'Оплачено',
        color: 'success.main',
      };
    case PaymentStatus.UNPAID:
      return {
        name: 'Неоплачено',
        color: 'error.main',
      };
    default:
      return {
        name: 'Нет информации',
        color: 'default',
      };
  }
}
