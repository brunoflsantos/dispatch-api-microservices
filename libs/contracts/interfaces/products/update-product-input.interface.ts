import { CreateProductInput } from './create-product-input.interface';

export interface UpdateProductInput extends Partial<CreateProductInput> {}
