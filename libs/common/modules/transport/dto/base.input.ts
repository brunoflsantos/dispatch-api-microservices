abstract class BaseInput {
  public static pattern: string;

  constructor(public readonly payload: any) {}

  get pattern(): string {
    return (this.constructor as typeof BaseInput).pattern;
  }
}

export abstract class BaseRpcInput extends BaseInput {
  public abstract response: any;
}

export abstract class BaseEventInput extends BaseInput {}
