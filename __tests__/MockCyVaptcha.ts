import type { CyVaptcha, VaptchaEventName, VaptchaOption } from '@chongying-star/vaptcha-typescript';

type C = CyVaptcha['vaptcha'];

export class MockCyVaptcha implements C {
  protected config = {};
  vaptcha: C;
  token = '';
  server = '';
  callbackMap = new Map<string, Parameters<CyVaptcha['listen']>[1]>();

  constructor (public option?: VaptchaOption) {
    this.vaptcha = this;
  }

  getServerToken () {
    const { token, server } = this;
    return { token, server };
  }

  render (): void {
    return void 0;
  }

  listen (eventName: VaptchaEventName, callback: () => any): void {
    this.callbackMap.set(eventName, callback);
  }

  validate (): void {
    return void 0;
  }

  reset (): void {
    return void 0;
  }

  renderTokenInput (container?: string | HTMLElement | undefined): void {
    return void container;
  }
}
