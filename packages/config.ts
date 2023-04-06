import { VaptchaOptionClickType, VaptchaOptionEmbeddedType, VaptchaOptionInvisibleType } from '@chongying-star/vaptcha-typescript';

export type Option = Omit<VaptchaOptionClickType, 'mode'|'container'> & Omit<VaptchaOptionEmbeddedType, 'mode'|'container'> & Omit<VaptchaOptionInvisibleType, 'mode'>;

const _option: Partial<Option> = {};
export const option: Readonly<Partial<Option>> = new Proxy(_option, {
  set () { return false; },
});

export const use = (option: Partial<Option>) => {
  Object.assign(_option, option);
};
