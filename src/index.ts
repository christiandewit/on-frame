type Subscriber = (time: DOMHighResTimeStamp) => void;

const subscribers = new Set<FrameRequestCallback>();
let rafId: number | null = null;

export function onFrame(subscriber: Subscriber): () => boolean {
  const shouldStart = subscribers.size === 0;

  subscribers.add(subscriber);

  if (shouldStart) {
    rafId = requestAnimationFrame(callback);
  }

  function unsubscribe(): boolean {
    return unsubscribeSubscriber(subscriber);
  }

  return unsubscribe;
}

function unsubscribeSubscriber(subscriber: Subscriber): boolean {
  if (subscribers.size === 0) {
    return false;
  }

  const result = subscribers.delete(subscriber);

  if (subscribers.size === 0 && rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  return result;
}

function callback(time: DOMHighResTimeStamp) {
  subscribers.forEach((subscriber) => {
    subscriber(time);
  });

  if (subscribers.size > 0) {
    rafId = requestAnimationFrame(callback);
  }
}

// tests
/* c8 ignore start */
if (import.meta.vitest) {
  const { test, expect, describe } = import.meta.vitest;

  describe('Initial state', () => {
    test('Initial size of subscribers', () => {
      expect(subscribers.size).toBe(0);
    });

    test('Initial value of rafId ', () => {
      expect(rafId).toBe(null);
    });
  });

  test('Size of subscribers after subscribing', () => {
    function callback() {
      // noop
    }
    const unsubscribe = onFrame(callback);
    expect(subscribers.size).toBe(1);
    unsubscribe();
  });

  test('Size of subscribers after subscribing and immediately unsubscribing', () => {
    function callback() {
      // noop
    }
    const unsubscribe = onFrame(callback);
    unsubscribe();

    expect(subscribers.size).toBe(0);
  });

  test('Size of subscribers after subscribing the same function twice', () => {
    function callback() {
      // noop
    }
    const unsubscribe = onFrame(callback);
    onFrame(callback);

    expect(subscribers.size).toBe(1);

    unsubscribe();
  });

  test('Value of rafId after subscribing', () => {
    function callback() {
      // noop
    }
    const unsubscribe = onFrame(callback);

    expect(rafId).toBeTypeOf('number');

    unsubscribe();
  });

  test('Value of rafId after subscribing and immediately unsubscribing', () => {
    function callback() {
      // noop
    }
    const unsubscribe = onFrame(callback);

    unsubscribe();

    expect(rafId).toBe(null);
  });
}
/* c8 ignore stop */
