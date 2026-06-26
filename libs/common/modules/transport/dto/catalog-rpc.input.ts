import { PagCursorResultDto } from 'libs/contracts/dto/pagination/pag-cursor-result.dto';
import { CreateOrderProductInput } from 'libs/contracts/interfaces/orders/create-order-product-input.interface';
import { CreateProductInput } from 'libs/contracts/interfaces/products/create-product-input.interface';
import { ProductCursorQueryInput } from 'libs/contracts/interfaces/products/product-cursor-query-input.interface';
import {
  ProductResult,
  PublicProductResult,
} from 'libs/contracts/interfaces/products/product-result.interface';
import { UpdateProductInput } from 'libs/contracts/interfaces/products/update-product-input.interface';
import { BaseRpcInput } from './base.input';

interface CatalogTransportPayloads {
  PUBLIC_FIND_ALL_PRODUCTS: {
    query: ProductCursorQueryInput;
  };

  PUBLIC_FIND_ONE_PRODUCT: {
    id: string;
  };

  ADMIN_CREATE_PRODUCT: {
    idempotencyKey: string;
    dto: CreateProductInput;
  };

  ADMIN_FIND_ALL_PRODUCTS: {
    query: ProductCursorQueryInput;
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

  VALIDATE_AND_RESERVE_STOCK: {
    orderProducts: CreateOrderProductInput[];
    reserveId: string;
    userId: string;
  };

  UNDO_STOCK_RESERVATION: {
    orderProducts: CreateOrderProductInput[];
    reserveId: string;
  };

  CONFIRM_STOCK_RESERVATION: {
    orderProducts: CreateOrderProductInput[];
    reserveId: string;
  };
}

interface CatalogTransportResponses {
  PUBLIC_FIND_ALL_PRODUCTS: PagCursorResultDto<PublicProductResult>;
  PUBLIC_FIND_ONE_PRODUCT: PublicProductResult;

  ADMIN_CREATE_PRODUCT: ProductResult;
  ADMIN_FIND_ALL_PRODUCTS: PagCursorResultDto<ProductResult>;
  ADMIN_FIND_ONE_PRODUCT: ProductResult;
  ADMIN_UPDATE_PRODUCT: ProductResult;
  ADMIN_REMOVE_PRODUCT: void;

  FIND_MANY_PRODUCTS_BY_IDS: ProductResult[];
  VALIDATE_AND_RESERVE_STOCK: ProductResult[];
  UNDO_STOCK_RESERVATION: void;
  CONFIRM_STOCK_RESERVATION: void;
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
  static readonly VALIDATE_AND_RESERVE_STOCK = 'catalog.validate-and-reserve-stock';
  static readonly UNDO_STOCK_RESERVATION = 'catalog.undo-stock-reservation';
  static readonly CONFIRM_STOCK_RESERVATION = 'catalog.confirm-stock-reservation';
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

export class ValidateAndReserveStockRpcInput extends BaseCatalogRpcInput {
  public static pattern = CatalogTransportPatterns.VALIDATE_AND_RESERVE_STOCK;

  public response =
    null as unknown as CatalogTransportResponses['VALIDATE_AND_RESERVE_STOCK'];

  constructor(
    public readonly payload: CatalogTransportPayloads['VALIDATE_AND_RESERVE_STOCK'],
  ) {
    super(payload);
  }
}

export class UndoStockReservationRpcInput extends BaseCatalogRpcInput {
  public static pattern = CatalogTransportPatterns.UNDO_STOCK_RESERVATION;

  public response =
    null as unknown as CatalogTransportResponses['UNDO_STOCK_RESERVATION'];

  constructor(
    public readonly payload: CatalogTransportPayloads['UNDO_STOCK_RESERVATION'],
  ) {
    super(payload);
  }
}

export class ConfirmStockReservationRpcInput extends BaseCatalogRpcInput {
  public static pattern = CatalogTransportPatterns.CONFIRM_STOCK_RESERVATION;

  public response =
    null as unknown as CatalogTransportResponses['CONFIRM_STOCK_RESERVATION'];

  constructor(
    public readonly payload: CatalogTransportPayloads['CONFIRM_STOCK_RESERVATION'],
  ) {
    super(payload);
  }
}
