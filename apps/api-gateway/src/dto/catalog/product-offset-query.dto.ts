import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { OffsetQueryDto } from 'libs/contracts/dto/base-query.dto';
import { ProductOffsetQueryInput } from 'libs/contracts/interfaces/products/product-offset-query-input.interface';

export class ProductOffsetQueryDto
  extends OffsetQueryDto
  implements ProductOffsetQueryInput
{
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
