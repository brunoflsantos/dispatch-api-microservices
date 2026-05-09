export abstract class BaseContractMethod {
  public static message: string;

  public abstract response: any;

  constructor(public readonly payload: any) {}

  get message(): string {
    return (this.constructor as typeof BaseContractMethod).message;
  }
}
