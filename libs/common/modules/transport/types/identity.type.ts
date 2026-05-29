export type UserCreatedEventType = {
  userId: string;

  email: string;

  name: string;

  idempotencyKey: string;
};

export type UserUpdatedEventType = {
  userId: string;

  email?: string;

  name?: string;
};

export type UserDeletedEventType = {
  userId: string;
};
