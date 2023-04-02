import { shallowRef, readonly, unref, Ref } from 'vue';
import type { CyVaptcha, VaptchaServerToken, VaptchaOptionInvisibleType } from '@chongying-star/vaptcha-typescript';
import { option as defaultOption } from '../config';

export class InitError extends Error {}
export class VerifyClosed {}

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

interface UseInvisibleOption {
  timeout?: number | Ref<number>,
  onPass?(serverToken: VaptchaServerToken): any,
  onClose?(): any,
  onTimeout?(): any,
}
export function useInvisibleVaptcha (option: UseInvisibleOption) {
  const { timeout, onPass, onClose, onTimeout } = { timeout: 120 * 1000, ...option };
  const vaptchaInstance = shallowRef<CyVaptcha>();
  const token = shallowRef('');
  const server = shallowRef('');
  const timeoutId = shallowRef<ReturnType<typeof setTimeout> >();

  const setSeverToken = (value: VaptchaServerToken) => {
    token.value = value.token;
    server.value = value.server;
  };
  const reset = () => {
    clearTimeout(timeoutId.value);
    vaptchaInstance.value?.reset();
    setSeverToken({ server: '', token: '' });
  };

  const init = async (option?: Readonly<Partial<VaptchaOptionInvisibleType>>) => {
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
    vaptcha.listen('pass', () => {
      const serverToken: VaptchaServerToken = { server: vaptcha.server, token: vaptcha.token };
      setSeverToken(serverToken);
      onPass?.(serverToken);
      timeoutId.value = setTimeout(() => {
        onTimeout?.();
        reset();
      }, unref(timeout));
    });
    vaptcha.listen('close', () => onClose?.());
    return vaptchaInstance.value = vaptcha;
  };
  return {
    vaptchaInstance: readonly(vaptchaInstance),
    token: readonly(token),
    server: readonly(server),
    init,
    validate: (...args: Parameters<CyVaptcha['validate']>) => vaptchaInstance.value?.validate(...args),
    reset,
    renderTokenInput: (...args: Parameters<CyVaptcha['renderTokenInput']>) => vaptchaInstance.value?.renderTokenInput(...args),
  };
}
