import { OmitType } from '@nestjs/swagger';
import {
  ProductResult,
  PublicProductResult,
} from 'libs/contracts/interfaces/products/product-result.interface';

export class ProductResponseDto implements ProductResult {
  id: string;

  name: string;

  description: string;

  stock: number;

  price: number;

  createdAt: Date;

  updatedAt: Date;
}

export class PublicProductResponseDto
  extends OmitType(ProductResponseDto, ['createdAt', 'updatedAt'] as const)
  implements PublicProductResult {}
