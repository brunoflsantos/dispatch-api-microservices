import { PagOffsetResultDto } from 'libs/contracts/dto/pagination/pag-offset-result.dto';
import { CreateOrderInput } from 'libs/contracts/interfaces/orders/create-order-input.interface';
import {
  OrderByUserOffsetQueryInput,
  OrderOffsetQueryInput,
} from 'libs/contracts/interfaces/orders/order-offset-query-input.interface';
import {
  OrderResult,
  PublicOrderResult,
} from 'libs/contracts/interfaces/orders/order-result.interface';
import { ShipOrderInput } from 'libs/contracts/interfaces/orders/ship-order-input.interface';
import { UpdateOrderInput } from 'libs/contracts/interfaces/orders/update-order-input.interface';
import { UpdateOrderPaymentInput } from 'libs/contracts/interfaces/orders/update-order-payment-input.interface';
import { RequestUser } from 'libs/contracts/interfaces/request-user.interface';
import { BaseRpcInput } from './base.input';

interface OrdersTransportPayloads {
  PUBLIC_CREATE_ORDER: {
    dto: CreateOrderInput;
    reqUser: RequestUser;
    idempotencyKey: string;
  };

  PUBLIC_FIND_ORDERS_BY_USER: {
    query: OrderByUserOffsetQueryInput;
    reqUser: RequestUser;
  };

  PUBLIC_FIND_ONE_ORDER: {
    id: string;
    reqUser: RequestUser;
  };

  PUBLIC_CANCEL_ORDER: {
    id: string;
    reqUser: RequestUser;
  };

  ADMIN_FIND_ALL_ORDERS: {
    query: OrderOffsetQueryInput;
  };

  ADMIN_FIND_ONE_ORDER: {
    id: string;
  };

  ADMIN_UPDATE_ORDER: {
    id: string;
    dto: UpdateOrderInput;
  };

  ADMIN_REMOVE_ORDER: {
    id: string;
  };

  ADMIN_SHIP_ORDER: {
    id: string;
    dto: ShipOrderInput;
  };

  ADMIN_DELIVER_ORDER: {
    id: string;
  };

  ADMIN_REFUND_ORDER: {
    id: string;
  };

  MARK_PAYMENT_AS_SUCCEEDED: {
    dto: UpdateOrderPaymentInput;
  };

  MARK_PAYMENT_AS_FAILED: {
    dto: UpdateOrderPaymentInput;
  };
}

interface OrdersTransportResponses {
  PUBLIC_CREATE_ORDER: PublicOrderResult;
  PUBLIC_FIND_ORDERS_BY_USER: PagOffsetResultDto<PublicOrderResult>;
  PUBLIC_FIND_ONE_ORDER: PublicOrderResult;
  PUBLIC_CANCEL_ORDER: void;

  ADMIN_FIND_ALL_ORDERS: PagOffsetResultDto<OrderResult>;
  ADMIN_FIND_ONE_ORDER: OrderResult;
  ADMIN_UPDATE_ORDER: OrderResult;
  ADMIN_REMOVE_ORDER: void;
  ADMIN_SHIP_ORDER: OrderResult;
  ADMIN_DELIVER_ORDER: OrderResult;
  ADMIN_REFUND_ORDER: void;

  MARK_PAYMENT_AS_SUCCEEDED: OrderResult;
  MARK_PAYMENT_AS_FAILED: OrderResult;
}

class OrdersTransportPatterns {
  static readonly PUBLIC_CREATE_ORDER = 'orders.public-create-order';
  static readonly PUBLIC_FIND_ORDERS_BY_USER = 'orders.public-find-orders-by-user';
  static readonly PUBLIC_FIND_ONE_ORDER = 'orders.public-find-one-order';
  static readonly PUBLIC_CANCEL_ORDER = 'orders.public-cancel-order';

  static readonly ADMIN_FIND_ALL_ORDERS = 'orders.admin-find-all-orders';
  static readonly ADMIN_FIND_ONE_ORDER = 'orders.admin-find-one-order';
  static readonly ADMIN_UPDATE_ORDER = 'orders.admin-update-order';
  static readonly ADMIN_REMOVE_ORDER = 'orders.admin-remove-order';
  static readonly ADMIN_SHIP_ORDER = 'orders.admin-ship-order';
  static readonly ADMIN_DELIVER_ORDER = 'orders.admin-deliver-order';
  static readonly ADMIN_REFUND_ORDER = 'orders.admin-refund-order';

  static readonly MARK_PAYMENT_AS_SUCCEEDED = 'orders.mark-payment-as-succeeded';
  static readonly MARK_PAYMENT_AS_FAILED = 'orders.mark-payment-as-failed';
}

export abstract class BaseOrdersRpcInput extends BaseRpcInput {}

export class PublicCreateOrderRpcInput extends BaseOrdersRpcInput {
  public static pattern = OrdersTransportPatterns.PUBLIC_CREATE_ORDER;

  public response =
    null as unknown as OrdersTransportResponses['PUBLIC_CREATE_ORDER'];

  constructor(
    public readonly payload: OrdersTransportPayloads['PUBLIC_CREATE_ORDER'],
  ) {
    super(payload);
  }
}

export class PublicFindOrdersByUserRpcInput extends BaseOrdersRpcInput {
  public static pattern = OrdersTransportPatterns.PUBLIC_FIND_ORDERS_BY_USER;

  public response =
    null as unknown as OrdersTransportResponses['PUBLIC_FIND_ORDERS_BY_USER'];

  constructor(
    public readonly payload: OrdersTransportPayloads['PUBLIC_FIND_ORDERS_BY_USER'],
  ) {
    super(payload);
  }
}

export class PublicFindOneOrderRpcInput extends BaseOrdersRpcInput {
  public static pattern = OrdersTransportPatterns.PUBLIC_FIND_ONE_ORDER;

  public response =
    null as unknown as OrdersTransportResponses['PUBLIC_FIND_ONE_ORDER'];

  constructor(
    public readonly payload: OrdersTransportPayloads['PUBLIC_FIND_ONE_ORDER'],
  ) {
    super(payload);
  }
}

export class AdminFindAllOrdersRpcInput extends BaseOrdersRpcInput {
  public static pattern = OrdersTransportPatterns.ADMIN_FIND_ALL_ORDERS;

  public response =
    null as unknown as OrdersTransportResponses['ADMIN_FIND_ALL_ORDERS'];

  constructor(
    public readonly payload: OrdersTransportPayloads['ADMIN_FIND_ALL_ORDERS'],
  ) {
    super(payload);
  }
}

export class AdminFindOneOrderRpcInput extends BaseOrdersRpcInput {
  public static pattern = OrdersTransportPatterns.ADMIN_FIND_ONE_ORDER;

  public response =
    null as unknown as OrdersTransportResponses['ADMIN_FIND_ONE_ORDER'];

  constructor(
    public readonly payload: OrdersTransportPayloads['ADMIN_FIND_ONE_ORDER'],
  ) {
    super(payload);
  }
}

export class AdminUpdateOrderRpcInput extends BaseOrdersRpcInput {
  public static pattern = OrdersTransportPatterns.ADMIN_UPDATE_ORDER;

  public response =
    null as unknown as OrdersTransportResponses['ADMIN_UPDATE_ORDER'];

  constructor(
    public readonly payload: OrdersTransportPayloads['ADMIN_UPDATE_ORDER'],
  ) {
    super(payload);
  }
}

export class AdminRemoveOrderRpcInput extends BaseOrdersRpcInput {
  public static pattern = OrdersTransportPatterns.ADMIN_REMOVE_ORDER;

  public response =
    null as unknown as OrdersTransportResponses['ADMIN_REMOVE_ORDER'];

  constructor(
    public readonly payload: OrdersTransportPayloads['ADMIN_REMOVE_ORDER'],
  ) {
    super(payload);
  }
}

export class AdminShipOrderRpcInput extends BaseOrdersRpcInput {
  public static pattern = OrdersTransportPatterns.ADMIN_SHIP_ORDER;

  public response = null as unknown as OrdersTransportResponses['ADMIN_SHIP_ORDER'];

  constructor(public readonly payload: OrdersTransportPayloads['ADMIN_SHIP_ORDER']) {
    super(payload);
  }
}

export class AdminDeliverOrderRpcInput extends BaseOrdersRpcInput {
  public static pattern = OrdersTransportPatterns.ADMIN_DELIVER_ORDER;

  public response =
    null as unknown as OrdersTransportResponses['ADMIN_DELIVER_ORDER'];

  constructor(
    public readonly payload: OrdersTransportPayloads['ADMIN_DELIVER_ORDER'],
  ) {
    super(payload);
  }
}

export class PublicCancelOrderRpcInput extends BaseOrdersRpcInput {
  public static pattern = OrdersTransportPatterns.PUBLIC_CANCEL_ORDER;

  public response =
    null as unknown as OrdersTransportResponses['PUBLIC_CANCEL_ORDER'];

  constructor(
    public readonly payload: OrdersTransportPayloads['PUBLIC_CANCEL_ORDER'],
  ) {
    super(payload);
  }
}

export class AdminRefundOrderRpcInput extends BaseOrdersRpcInput {
  public static pattern = OrdersTransportPatterns.ADMIN_REFUND_ORDER;

  public response =
    null as unknown as OrdersTransportResponses['ADMIN_REFUND_ORDER'];

  constructor(
    public readonly payload: OrdersTransportPayloads['ADMIN_REFUND_ORDER'],
  ) {
    super(payload);
  }
}

export class MarkPaymentAsSucceededRpcInput extends BaseOrdersRpcInput {
  public static pattern = OrdersTransportPatterns.MARK_PAYMENT_AS_SUCCEEDED;

  public response =
    null as unknown as OrdersTransportResponses['MARK_PAYMENT_AS_SUCCEEDED'];

  constructor(
    public readonly payload: OrdersTransportPayloads['MARK_PAYMENT_AS_SUCCEEDED'],
  ) {
    super(payload);
  }
}

export class MarkPaymentAsFailedRpcInput extends BaseOrdersRpcInput {
  public static pattern = OrdersTransportPatterns.MARK_PAYMENT_AS_FAILED;

  public response =
    null as unknown as OrdersTransportResponses['MARK_PAYMENT_AS_FAILED'];

  constructor(
    public readonly payload: OrdersTransportPayloads['MARK_PAYMENT_AS_FAILED'],
  ) {
    super(payload);
  }
}
