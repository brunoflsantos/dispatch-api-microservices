import { PagOffsetResultDto } from '../dto/pagination/pag-offset-result.dto';
import { CreateProductRequestContract } from '../interfaces/products/create-product-request.interface';
import { ProductQueryRequestContract } from '../interfaces/products/product-query-request.interface';
import {
  ProductResponseContract,
  PublicProductResponseContract,
} from '../interfaces/products/product-response.interface';
import { UpdateProductRequestContract } from '../interfaces/products/update-product-request.interface';
import { BaseContractMethod } from './base-contract-method';

interface CatalogTransportPayloads {
  PUBLIC_FIND_ALL_PRODUCTS: {
    query: ProductQueryRequestContract;
  };

  PUBLIC_FIND_ONE_PRODUCT: {
    id: string;
  };

  ADMIN_CREATE_PRODUCT: {
    idempotencyKey: string;
    dto: CreateProductRequestContract;
  };

  ADMIN_FIND_ALL_PRODUCTS: {
    query: ProductQueryRequestContract;
  };

  ADMIN_FIND_ONE_PRODUCT: {
    id: string;
  };

  ADMIN_UPDATE_PRODUCT: {
    id: string;
    dto: UpdateProductRequestContract;
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
  PUBLIC_FIND_ALL_PRODUCTS: PagOffsetResultDto<PublicProductResponseContract>;
  PUBLIC_FIND_ONE_PRODUCT: PublicProductResponseContract;

  ADMIN_CREATE_PRODUCT: ProductResponseContract;
  ADMIN_FIND_ALL_PRODUCTS: PagOffsetResultDto<ProductResponseContract>;
  ADMIN_FIND_ONE_PRODUCT: ProductResponseContract;
  ADMIN_UPDATE_PRODUCT: ProductResponseContract;
  ADMIN_REMOVE_PRODUCT: void;

  FIND_MANY_PRODUCTS_BY_IDS: ProductResponseContract[];
  DECREMENT_PRODUCTS_STOCK: void;
  INCREMENT_PRODUCTS_STOCK: void;
  VALIDATE_AND_GET_PRODUCTS: ProductResponseContract[];
}

class CatalogTransportPatterns {
  static PUBLIC_FIND_ALL_PRODUCTS = 'catalog.public.products';
  static PUBLIC_FIND_ONE_PRODUCT = 'catalog.public.products.get';

  static ADMIN_CREATE_PRODUCT = 'catalog.admin.products.create';
  static ADMIN_FIND_ALL_PRODUCTS = 'catalog.admin.products';
  static ADMIN_FIND_ONE_PRODUCT = 'catalog.admin.products.get';
  static ADMIN_UPDATE_PRODUCT = 'catalog.admin.products.update';
  static ADMIN_REMOVE_PRODUCT = 'catalog.admin.products.remove';

  static FIND_MANY_PRODUCTS_BY_IDS = 'catalog.misc.products.find-by-ids';
  static DECREMENT_PRODUCTS_STOCK = 'catalog.misc.products.decrement-stock';
  static INCREMENT_PRODUCTS_STOCK = 'catalog.misc.products.increment-stock';
  static VALIDATE_AND_GET_PRODUCTS = 'catalog.misc.products.validate-and-get';
}

export class PublicFindAllProductsContractMethod extends BaseContractMethod {
  public static message = CatalogTransportPatterns.PUBLIC_FIND_ALL_PRODUCTS;

  public response =
    null as unknown as CatalogTransportResponses['PUBLIC_FIND_ALL_PRODUCTS'];

  constructor(
    public readonly payload: CatalogTransportPayloads['PUBLIC_FIND_ALL_PRODUCTS'],
  ) {
    super(payload);
  }
}

export class PublicFindOneProductContractMethod extends BaseContractMethod {
  public static message = CatalogTransportPatterns.PUBLIC_FIND_ONE_PRODUCT;

  public response =
    null as unknown as CatalogTransportResponses['PUBLIC_FIND_ONE_PRODUCT'];

  constructor(
    public readonly payload: CatalogTransportPayloads['PUBLIC_FIND_ONE_PRODUCT'],
  ) {
    super(payload);
  }
}

export class AdminCreateProductContractMethod extends BaseContractMethod {
  public static message = CatalogTransportPatterns.ADMIN_CREATE_PRODUCT;

  public response =
    null as unknown as CatalogTransportResponses['ADMIN_CREATE_PRODUCT'];

  constructor(
    public readonly payload: CatalogTransportPayloads['ADMIN_CREATE_PRODUCT'],
  ) {
    super(payload);
  }
}

export class AdminFindAllProductsContractMethod extends BaseContractMethod {
  public static message = CatalogTransportPatterns.ADMIN_FIND_ALL_PRODUCTS;

  public response =
    null as unknown as CatalogTransportResponses['ADMIN_FIND_ALL_PRODUCTS'];

  constructor(
    public readonly payload: CatalogTransportPayloads['ADMIN_FIND_ALL_PRODUCTS'],
  ) {
    super(payload);
  }
}

export class AdminFindOneProductContractMethod extends BaseContractMethod {
  public static message = CatalogTransportPatterns.ADMIN_FIND_ONE_PRODUCT;

  public response =
    null as unknown as CatalogTransportResponses['ADMIN_FIND_ONE_PRODUCT'];

  constructor(
    public readonly payload: CatalogTransportPayloads['ADMIN_FIND_ONE_PRODUCT'],
  ) {
    super(payload);
  }
}

export class AdminUpdateProductContractMethod extends BaseContractMethod {
  public static message = CatalogTransportPatterns.ADMIN_UPDATE_PRODUCT;

  public response =
    null as unknown as CatalogTransportResponses['ADMIN_UPDATE_PRODUCT'];

  constructor(
    public readonly payload: CatalogTransportPayloads['ADMIN_UPDATE_PRODUCT'],
  ) {
    super(payload);
  }
}

export class AdminRemoveProductContractMethod extends BaseContractMethod {
  public static message = CatalogTransportPatterns.ADMIN_REMOVE_PRODUCT;

  public response =
    null as unknown as CatalogTransportResponses['ADMIN_REMOVE_PRODUCT'];

  constructor(
    public readonly payload: CatalogTransportPayloads['ADMIN_REMOVE_PRODUCT'],
  ) {
    super(payload);
  }
}

export class FindManyProductsByIdsContractMethod extends BaseContractMethod {
  public static message = CatalogTransportPatterns.FIND_MANY_PRODUCTS_BY_IDS;

  public response =
    null as unknown as CatalogTransportResponses['FIND_MANY_PRODUCTS_BY_IDS'];

  constructor(
    public readonly payload: CatalogTransportPayloads['FIND_MANY_PRODUCTS_BY_IDS'],
  ) {
    super(payload);
  }
}

export class DecrementProductsStockContractMethod extends BaseContractMethod {
  public static message = CatalogTransportPatterns.DECREMENT_PRODUCTS_STOCK;

  public response =
    null as unknown as CatalogTransportResponses['DECREMENT_PRODUCTS_STOCK'];

  constructor(
    public readonly payload: CatalogTransportPayloads['DECREMENT_PRODUCTS_STOCK'],
  ) {
    super(payload);
  }
}

export class IncrementProductsStockContractMethod extends BaseContractMethod {
  public static message = CatalogTransportPatterns.INCREMENT_PRODUCTS_STOCK;

  public response =
    null as unknown as CatalogTransportResponses['INCREMENT_PRODUCTS_STOCK'];

  constructor(
    public readonly payload: CatalogTransportPayloads['INCREMENT_PRODUCTS_STOCK'],
  ) {
    super(payload);
  }
}

export class ValidateAndGetProductsContractMethod extends BaseContractMethod {
  public static message = CatalogTransportPatterns.VALIDATE_AND_GET_PRODUCTS;

  public response =
    null as unknown as CatalogTransportResponses['VALIDATE_AND_GET_PRODUCTS'];

  constructor(
    public readonly payload: CatalogTransportPayloads['VALIDATE_AND_GET_PRODUCTS'],
  ) {
    super(payload);
  }
}
