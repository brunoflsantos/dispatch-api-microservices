import { IBaseRepository } from 'libs/contracts/repositories/base-repository.interface';
import { Customer } from '../entities/customer.entity';

export interface ICustomerRepository extends IBaseRepository<Customer> {}
