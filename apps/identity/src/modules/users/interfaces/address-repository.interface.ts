import { IBaseRepository } from 'libs/contracts/repositories/base-repository.interface';
import { Address } from '../entities/address.entity';

export interface IAddressRepository extends IBaseRepository<Address> {}
