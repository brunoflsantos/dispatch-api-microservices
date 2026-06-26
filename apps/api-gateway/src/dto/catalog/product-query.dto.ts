import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ProductCursorQueryInput } from 'libs/contracts/interfaces/products/product-cursor-query-input.interface';

export class ProductQueryDto implements Omit<ProductCursorQueryInput, 'cursor'> {
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
