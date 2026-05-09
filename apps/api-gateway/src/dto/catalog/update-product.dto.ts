import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductRequestContract } from 'libs/contracts/interfaces/products/update-product-request.interface';

export class UpdateProductDto
  extends PartialType(CreateProductDto)
  implements UpdateProductRequestContract {}
