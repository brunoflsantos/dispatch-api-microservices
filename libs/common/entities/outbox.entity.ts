import { BaseEntity } from 'libs/contracts/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('outbox')
export class Outbox extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  correlationId: string;

  @Column('jsonb', { nullable: false })
  payload: any;
}
