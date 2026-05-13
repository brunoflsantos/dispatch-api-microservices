import { PartialType } from '@nestjs/swagger';
import { UpdateProductInput } from 'libs/contracts/interfaces/products/update-product-input.interface';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto
  extends PartialType(CreateProductDto)
  implements UpdateProductInput {}
