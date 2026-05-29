import { CustomerResult } from 'libs/contracts/interfaces/payments/customer-result.interface';

export class CustomerResultDto implements CustomerResult {
  id: string;

  gatewayCustomerId: string;

  userId: string;

  email: string;

  name: string;
}
