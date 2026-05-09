import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from 'libs/contracts/dto/base-query.dto';
import { ProductQueryRequestContract } from 'libs/contracts/interfaces/products/product-query-request.interface';

export class ProductQueryDto
  extends BaseQueryDto
  implements ProductQueryRequestContract
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
