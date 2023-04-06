import type { VaptchaServerToken, VaptchaOptionInvisibleType } from '@chongying-star/vaptcha-typescript';
import { option as defaultOption } from '../config';
import { InitError, VerifyClosed } from './types';

export async function verifyAndGetToken (option?: Readonly<Partial<VaptchaOptionInvisibleType>>) {
  const { createVaptcha } = await import('@chongying-star/vaptcha-typescript');
  const vid = option?.vid ?? defaultOption.vid;
  if (!vid) {
    throw new InitError('Option "vid" is required');
  }
  const vaptcha = await createVaptcha({
    ...defaultOption,
    vid,
    ...option,
    mode: 'invisible',
  });
  return new Promise<VaptchaServerToken>((resolve, reject) => {
    vaptcha.listen('pass', () => resolve(vaptcha.getServerToken()));
    vaptcha.listen('close', () => reject(new VerifyClosed));
    vaptcha.validate();
  });
}
