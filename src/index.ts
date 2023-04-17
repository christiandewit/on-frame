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
