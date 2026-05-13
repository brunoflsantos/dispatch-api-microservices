import { Role } from 'libs/common/enums/role.enum';
import { BaseEntity } from 'libs/contracts/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Address } from './address.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  customerId?: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({ default: 'en' })
  language: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[];
}
