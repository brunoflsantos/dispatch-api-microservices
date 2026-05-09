export interface ProductResponseContract {
  id: string;

  name: string;

  description: string;

  stock: number;

  price: number;

  createdAt: Date;

  updatedAt: Date;
}

export interface PublicProductResponseContract extends Omit<
  ProductResponseContract,
  'createdAt' | 'updatedAt'
> {}
