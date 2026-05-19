export type OrderCreatedEventType = {
  userId: string;

  orderId: string;

  orderTotal: number;

  reserveId: string;
};

export type OrderFailedUponCreatingEventType = {
  userId: string;

  reserveId: string;
};

export type OrderStatusChangedEventType = {
  userId: string;

  orderId: string;

  orderNewStatus: string;
};

export type OrderCancelEventType = {
  userId: string;

  orderId: string;

  reserveId: string;
};

export type OrderRefundEventType = {
  userId: string;

  orderId: string;

  reserveId: string;

  refundAmount: number;
};

export type OrderPaidEventType = {
  userId: string;

  orderId: string;

  paymentId: string;

  reserveId: string;
};

export type OrderProcessedEventType = {
  userId: string;

  orderId: string;
};

export type OrderShippedEventType = {
  userId: string;

  orderId: string;

  trackingNumber: string;
};

export type OrderDeliveredEventType = {
  userId: string;

  orderId: string;

  deliveryDate: string;
};

export type OrderFailedEventType = {
  userId: string;

  orderId: string;

  reserveId: string;
};
