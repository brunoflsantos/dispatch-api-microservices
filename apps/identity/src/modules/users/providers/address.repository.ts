import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'libs/contracts/repositories/base.repository';
import { Repository } from 'typeorm';
import { Address } from '../entities/address.entity';
import { IAddressRepository } from '../interfaces/address-repository.interface';

@Injectable()
export class AddressRepository
  extends BaseRepository<Address>
  implements IAddressRepository
{
  constructor(@InjectRepository(Address) repository: Repository<Address>) {
    super(repository);
  }
}
