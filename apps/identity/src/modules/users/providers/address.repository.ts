import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'libs/contracts/repositories/base.repository';
import { Repository } from 'typeorm';
import { Address } from '../modules/users/entities/address.entity';
import { IAddressRepository } from '../modules/users/interfaces/address-repository.interface';

@Injectable()
export class AddressRepository
  extends BaseRepository<Address>
  implements IAddressRepository
{
  constructor(@InjectRepository(Address) repository: Repository<Address>) {
    super(repository);
  }
}
