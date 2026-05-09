import { OmitType } from '@nestjs/swagger';
import {
  ProductResponseContract,
  PublicProductResponseContract,
} from 'libs/contracts/interfaces/products/product-response.interface';

export class ProductResponseDto implements ProductResponseContract {
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
  implements PublicProductResponseContract {}
