import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { OffsetQueryDto } from 'libs/contracts/dto/base-query.dto';
import { ProductQueryInput } from 'libs/contracts/interfaces/products/product-query-input.interface';

export class ProductQueryDto extends OffsetQueryDto implements ProductQueryInput {
  @ApiPropertyOptional({
    description: 'Filter items by name (partial match)',
    example: 'Headphones',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter items by description (partial match)',
    example: 'wireless',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
