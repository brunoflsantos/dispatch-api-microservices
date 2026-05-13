import { PagOffsetResultDto } from '../../../../contracts/dto/pagination/pag-offset-result.dto';
import { CreateProductInput } from '../../../../contracts/interfaces/products/create-product-input.interface';
import { ProductQueryInput } from '../../../../contracts/interfaces/products/product-query-input.interface';
import {
  ProductResult,
  PublicProductResult,
} from '../../../../contracts/interfaces/products/product-result.interface';
import { UpdateProductInput } from '../../../../contracts/interfaces/products/update-product-input.interface';
import { BaseRpcInput } from './base.input';

interface CatalogTransportPayloads {
  PUBLIC_FIND_ALL_PRODUCTS: {
    query: ProductQueryInput;
  };

  PUBLIC_FIND_ONE_PRODUCT: {
    id: string;
  };

  ADMIN_CREATE_PRODUCT: {
    idempotencyKey: string;
    dto: CreateProductInput;
  };

  ADMIN_FIND_ALL_PRODUCTS: {
    query: ProductQueryInput;
  };

  ADMIN_FIND_ONE_PRODUCT: {
    id: string;
  };

  ADMIN_UPDATE_PRODUCT: {
    id: string;
    dto: UpdateProductInput;
  };

  ADMIN_REMOVE_PRODUCT: {
    id: string;
  };

  FIND_MANY_PRODUCTS_BY_IDS: {
    ids: string[];
  };

  DECREMENT_PRODUCTS_STOCK: {
    id: string;
    quantity: number;
  };

  INCREMENT_PRODUCTS_STOCK: {
    id: string;
    quantity: number;
  };

  VALIDATE_AND_GET_PRODUCTS: {
    ids: string[];
  };
}

interface CatalogTransportResponses {
  PUBLIC_FIND_ALL_PRODUCTS: PagOffsetResultDto<PublicProductResult>;
  PUBLIC_FIND_ONE_PRODUCT: PublicProductResult;

  ADMIN_CREATE_PRODUCT: ProductResult;
  ADMIN_FIND_ALL_PRODUCTS: PagOffsetResultDto<ProductResult>;
  ADMIN_FIND_ONE_PRODUCT: ProductResult;
  ADMIN_UPDATE_PRODUCT: ProductResult;
  ADMIN_REMOVE_PRODUCT: void;

  FIND_MANY_PRODUCTS_BY_IDS: ProductResult[];
  DECREMENT_PRODUCTS_STOCK: void;
  INCREMENT_PRODUCTS_STOCK: void;
  VALIDATE_AND_GET_PRODUCTS: ProductResult[];
}

class CatalogTransportPatterns {
  static readonly PUBLIC_FIND_ALL_PRODUCTS = 'catalog.public-find-all-products';
  static readonly PUBLIC_FIND_ONE_PRODUCT = 'catalog.public-find-one-product';

  static readonly ADMIN_CREATE_PRODUCT = 'catalog.admin-create-product';
  static readonly ADMIN_FIND_ALL_PRODUCTS = 'catalog.admin-find-all-products';
  static readonly ADMIN_FIND_ONE_PRODUCT = 'catalog.admin-find-one-product';
  static readonly ADMIN_UPDATE_PRODUCT = 'catalog.admin-update-product';
  static readonly ADMIN_REMOVE_PRODUCT = 'catalog.admin-remove-product';

  static readonly FIND_MANY_PRODUCTS_BY_IDS = 'catalog.find-many-products-by-ids';
  static readonly DECREMENT_PRODUCTS_STOCK = 'catalog.decrement-products-stock';
  static readonly INCREMENT_PRODUCTS_STOCK = 'catalog.increment-products-stock';
  static readonly VALIDATE_AND_GET_PRODUCTS = 'catalog.validate-and-get-products';
}

export abstract class BaseCatalogRpcInput extends BaseRpcInput {}

export class PublicFindAllProductsRpcInput extends BaseCatalogRpcInput {
  public static pattern = CatalogTransportPatterns.PUBLIC_FIND_ALL_PRODUCTS;

  public response =
    null as unknown as CatalogTransportResponses['PUBLIC_FIND_ALL_PRODUCTS'];

  constructor(
    public readonly payload: CatalogTransportPayloads['PUBLIC_FIND_ALL_PRODUCTS'],
  ) {
    super(payload);
  }
}

export class PublicFindOneProductRpcInput extends BaseCatalogRpcInput {
  public static pattern = CatalogTransportPatterns.PUBLIC_FIND_ONE_PRODUCT;

  public response =
    null as unknown as CatalogTransportResponses['PUBLIC_FIND_ONE_PRODUCT'];

  constructor(
    public readonly payload: CatalogTransportPayloads['PUBLIC_FIND_ONE_PRODUCT'],
  ) {
    super(payload);
  }
}

export class AdminCreateProductRpcInput extends BaseCatalogRpcInput {
  public static pattern = CatalogTransportPatterns.ADMIN_CREATE_PRODUCT;

  public response =
    null as unknown as CatalogTransportResponses['ADMIN_CREATE_PRODUCT'];

  constructor(
    public readonly payload: CatalogTransportPayloads['ADMIN_CREATE_PRODUCT'],
  ) {
    super(payload);
  }
}

export class AdminFindAllProductsRpcInput extends BaseCatalogRpcInput {
  public static pattern = CatalogTransportPatterns.ADMIN_FIND_ALL_PRODUCTS;

  public response =
    null as unknown as CatalogTransportResponses['ADMIN_FIND_ALL_PRODUCTS'];

  constructor(
    public readonly payload: CatalogTransportPayloads['ADMIN_FIND_ALL_PRODUCTS'],
  ) {
    super(payload);
  }
}

export class AdminFindOneProductRpcInput extends BaseCatalogRpcInput {
  public static pattern = CatalogTransportPatterns.ADMIN_FIND_ONE_PRODUCT;

  public response =
    null as unknown as CatalogTransportResponses['ADMIN_FIND_ONE_PRODUCT'];

  constructor(
    public readonly payload: CatalogTransportPayloads['ADMIN_FIND_ONE_PRODUCT'],
  ) {
    super(payload);
  }
}

export class AdminUpdateProductRpcInput extends BaseCatalogRpcInput {
  public static pattern = CatalogTransportPatterns.ADMIN_UPDATE_PRODUCT;

  public response =
    null as unknown as CatalogTransportResponses['ADMIN_UPDATE_PRODUCT'];

  constructor(
    public readonly payload: CatalogTransportPayloads['ADMIN_UPDATE_PRODUCT'],
  ) {
    super(payload);
  }
}

export class AdminRemoveProductRpcInput extends BaseCatalogRpcInput {
  public static pattern = CatalogTransportPatterns.ADMIN_REMOVE_PRODUCT;

  public response =
    null as unknown as CatalogTransportResponses['ADMIN_REMOVE_PRODUCT'];

  constructor(
    public readonly payload: CatalogTransportPayloads['ADMIN_REMOVE_PRODUCT'],
  ) {
    super(payload);
  }
}

export class FindManyProductsByIdsRpcInput extends BaseCatalogRpcInput {
  public static pattern = CatalogTransportPatterns.FIND_MANY_PRODUCTS_BY_IDS;

  public response =
    null as unknown as CatalogTransportResponses['FIND_MANY_PRODUCTS_BY_IDS'];

  constructor(
    public readonly payload: CatalogTransportPayloads['FIND_MANY_PRODUCTS_BY_IDS'],
  ) {
    super(payload);
  }
}

export class DecrementProductsStockRpcInput extends BaseCatalogRpcInput {
  public static pattern = CatalogTransportPatterns.DECREMENT_PRODUCTS_STOCK;

  public response =
    null as unknown as CatalogTransportResponses['DECREMENT_PRODUCTS_STOCK'];

  constructor(
    public readonly payload: CatalogTransportPayloads['DECREMENT_PRODUCTS_STOCK'],
  ) {
    super(payload);
  }
}

export class IncrementProductsStockRpcInput extends BaseCatalogRpcInput {
  public static pattern = CatalogTransportPatterns.INCREMENT_PRODUCTS_STOCK;

  public response =
    null as unknown as CatalogTransportResponses['INCREMENT_PRODUCTS_STOCK'];

  constructor(
    public readonly payload: CatalogTransportPayloads['INCREMENT_PRODUCTS_STOCK'],
  ) {
    super(payload);
  }
}

export class ValidateAndGetProductsRpcInput extends BaseCatalogRpcInput {
  public static pattern = CatalogTransportPatterns.VALIDATE_AND_GET_PRODUCTS;

  public response =
    null as unknown as CatalogTransportResponses['VALIDATE_AND_GET_PRODUCTS'];

  constructor(
    public readonly payload: CatalogTransportPayloads['VALIDATE_AND_GET_PRODUCTS'],
  ) {
    super(payload);
  }
}
