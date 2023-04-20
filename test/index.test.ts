import { expect, test, vi } from 'vitest';
import { onFrame } from '../src/index';

test('Subscribe', async () => {
  const callback = vi.fn();
  const unsubscribe = onFrame(callback);
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 100);
  });

  expect(callback).toBeCalled();
  unsubscribe();
});

test('Unsubscribe', async () => {
  const callback = vi.fn();
  const unsubscribe = onFrame(() => {
    callback();
    unsubscribe();
  });

  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 100);
  });

  expect(callback).toBeCalledTimes(1);
});

test('Unsubscribe return value', async () => {
  const unsubscribe = onFrame(() => {
    // noop
  });

  const success = unsubscribe();

  expect(success).toBe(true);
});

test('Unsubscribe return value second time', () => {
  const unsubscribe = onFrame(() => {
    // noop
  });

  unsubscribe();
  const success = unsubscribe();

  expect(success).toBe(false);
});

test('Timing', () => {
  vi.useFakeTimers();

  const start = Date.now();

  const unsubscribe = onFrame(() => {
    const now = Date.now();
    expect(now - start).toBe(16);
  });

  vi.advanceTimersByTime(16);

  unsubscribe();
  vi.useRealTimers();
});
