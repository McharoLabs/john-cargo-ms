import { PaymentStatusEnum } from "../enum/payment-status-enum";

export const PaymentStatusArray = Object.values(PaymentStatusEnum) as [
  string,
  ...string[]
];
