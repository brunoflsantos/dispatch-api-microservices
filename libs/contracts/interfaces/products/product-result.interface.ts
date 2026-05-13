export interface ProductResult {
  id: string;

  name: string;

  description: string;

  stock: number;

  price: number;

  createdAt: Date;

  updatedAt: Date;
}

export interface PublicProductResult extends Omit<
  ProductResult,
  'createdAt' | 'updatedAt'
> {}
