import {
  OrderCancelEventType,
  OrderCreatedEventType,
  OrderDeliveredEventType,
  OrderFailedEventType,
  OrderFailedUponCreatingEventType,
  OrderPaidEventType,
  OrderProcessedEventType,
  OrderRefundEventType,
  OrderShippedEventType,
  OrderStatusChangedEventType,
} from '../types/orders.type';
import { BaseEventInput } from './base.input';

interface OrdersTransportPayloads {
  ORDER_CREATED: OrderCreatedEventType;

  ORDER_FAILED_UPON_CREATING: OrderFailedUponCreatingEventType;

  ORDER_STATUS_CHANGED: OrderStatusChangedEventType;

  ORDER_CANCELED: OrderCancelEventType;

  ORDER_REFUNDED: OrderRefundEventType;

  ORDER_FAILED: OrderFailedEventType;

  ORDER_PAID: OrderPaidEventType;

  ORDER_PROCESSED: OrderProcessedEventType;

  ORDER_SHIPPED: OrderShippedEventType;

  ORDER_DELIVERED: OrderDeliveredEventType;
}

class OrdersTransportPatterns {
  static readonly ORDER_CREATED = 'order.created';
  static readonly ORDER_FAILED_UPON_CREATING = 'order.failed-upon-creating';
  static readonly ORDER_STATUS_CHANGED = 'order.status-changed';
  static readonly ORDER_CANCELED = 'order.canceled';
  static readonly ORDER_REFUNDED = 'order.refunded';
  static readonly ORDER_PAID = 'order.paid';
  static readonly ORDER_FAILED = 'order.failed';
  static readonly ORDER_PROCESSED = 'order.processed';
  static readonly ORDER_SHIPPED = 'order.shipped';
  static readonly ORDER_DELIVERED = 'order.delivered';
}

abstract class BaseOrdersEventInput extends BaseEventInput {}

export class OrderCreatedEventInput extends BaseOrdersEventInput {
  public static pattern = OrdersTransportPatterns.ORDER_CREATED;

  constructor(public readonly payload: OrdersTransportPayloads['ORDER_CREATED']) {
    super(payload);
  }
}

export class OrderFailedUponCreatingEventInput extends BaseOrdersEventInput {
  public static pattern = OrdersTransportPatterns.ORDER_FAILED_UPON_CREATING;

  constructor(
    public readonly payload: OrdersTransportPayloads['ORDER_FAILED_UPON_CREATING'],
  ) {
    super(payload);
  }
}

export class OrderStatusChangedEventInput extends BaseOrdersEventInput {
  public static pattern = OrdersTransportPatterns.ORDER_STATUS_CHANGED;

  constructor(
    public readonly payload: OrdersTransportPayloads['ORDER_STATUS_CHANGED'],
  ) {
    super(payload);
  }
}

export class OrderCanceledEventInput extends BaseOrdersEventInput {
  public static pattern = OrdersTransportPatterns.ORDER_CANCELED;

  constructor(public readonly payload: OrdersTransportPayloads['ORDER_CANCELED']) {
    super(payload);
  }
}

export class OrderRefundedEventInput extends BaseOrdersEventInput {
  public static pattern = OrdersTransportPatterns.ORDER_REFUNDED;

  constructor(public readonly payload: OrdersTransportPayloads['ORDER_REFUNDED']) {
    super(payload);
  }
}

export class OrderPaidEventInput extends BaseOrdersEventInput {
  public static pattern = OrdersTransportPatterns.ORDER_PAID;

  constructor(public readonly payload: OrdersTransportPayloads['ORDER_PAID']) {
    super(payload);
  }
}

export class OrderFailedEventInput extends BaseOrdersEventInput {
  public static pattern = OrdersTransportPatterns.ORDER_FAILED;

  constructor(public readonly payload: OrdersTransportPayloads['ORDER_FAILED']) {
    super(payload);
  }
}

export class OrderProcessedEventInput extends BaseOrdersEventInput {
  public static pattern = OrdersTransportPatterns.ORDER_PROCESSED;

  constructor(public readonly payload: OrdersTransportPayloads['ORDER_PROCESSED']) {
    super(payload);
  }
}

export class OrderShippedEventInput extends BaseOrdersEventInput {
  public static pattern = OrdersTransportPatterns.ORDER_SHIPPED;

  constructor(public readonly payload: OrdersTransportPayloads['ORDER_SHIPPED']) {
    super(payload);
  }
}

export class OrderDeliveredEventInput extends BaseOrdersEventInput {
  public static pattern = OrdersTransportPatterns.ORDER_DELIVERED;

  constructor(public readonly payload: OrdersTransportPayloads['ORDER_DELIVERED']) {
    super(payload);
  }
}
