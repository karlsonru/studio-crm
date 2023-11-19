import { BillingStatus } from '../models/IAttendanceModel';

export function getBillingStatusNameAndColor(billingStatus?: BillingStatus) {
  switch (billingStatus) {
    case BillingStatus.PAID:
      return {
        name: 'Оплачено',
        color: 'success.main',
      };
    case BillingStatus.UNPAID:
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
