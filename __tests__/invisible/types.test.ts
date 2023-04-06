import { test, expect } from 'vitest';
import { InitError } from '@packages/invisible/types';

test('New InitError', () => {
  const error = new InitError('message');
  expect(error).toBeInstanceOf(Error);
  expect(error.message).toBe('message');
});
