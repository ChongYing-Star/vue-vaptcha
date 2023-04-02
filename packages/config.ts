import { VaptchaOption } from '@chongying-star/vaptcha-typescript';

type Option = Pick<VaptchaOption, 'vid' | 'area' | 'lang'>;

const _option: Partial<Option> = {};
export const option: Readonly<Partial<Option>> = new Proxy(_option, {
  set () { return false; },
});

export const use = (option: Partial<Option>) => {
  Object.assign(_option, option);
};
