import { Role } from 'libs/common/enums/role.enum';
import { BaseEntity } from 'libs/contracts/entities/base.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Address } from './address.entity';

// Partial indexes on nullable columns avoid indexing NULL rows.
@Entity('users')
@Index('IDX_users_customerId', ['customerId'], { where: '"customerId" IS NOT NULL' })
@Index('IDX_users_refreshToken', ['refreshToken'], {
  where: '"refreshToken" IS NOT NULL',
})
export class User extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  customerId?: string;

  // Unique constraint creates both the constraint and the B-tree index.
  @Index({ unique: true })
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
