import { RequestContext } from 'libs/common/utils/request-context.utils';

abstract class BaseInput {
  public static pattern: string;

  public readonly correlationId: string;

  constructor(public readonly payload: any) {
    this.correlationId = RequestContext.getCorrelationId();
  }

  get pattern(): string {
    return (this.constructor as typeof BaseInput).pattern;
  }
}

export abstract class BaseRpcInput extends BaseInput {
  public abstract response: any;
}

export abstract class BaseEventInput extends BaseInput {}
