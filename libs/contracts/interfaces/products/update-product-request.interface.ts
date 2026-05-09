import { CreateProductRequestContract } from './create-product-request.interface';

export interface UpdateProductRequestContract extends Partial<CreateProductRequestContract> {}
