import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseCursorQueryInput } from '../interfaces/base-cursor-query-input.interface';
import type { CursorParams } from '../types/cursor-params.type';

export abstract class BaseCursorQueryDto implements BaseCursorQueryInput {
  @ApiProperty({
    description: 'Cursor for pagination (can be a parameter like createdAt)',
    example: '2026-01-01T00:00:00.000Z_123',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  cursor?: CursorParams;
}
