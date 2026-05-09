/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseEntity } from 'libs/contracts/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { OutboxType } from '../enums/outbox-type.enum';

@Entity('outbox')
export class Outbox extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  correlationId: string;

  @Column({
    type: 'enum',
    enum: OutboxType,
    nullable: false,
  })
  type: OutboxType;

  @Column('jsonb', { nullable: false })
  payload: any;
}
