import { UserRole } from 'libs/common/enums/user-role.enum';
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
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: 'en' })
  language: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[];
}
