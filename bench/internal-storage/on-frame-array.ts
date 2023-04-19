type Subscriber = (time: DOMHighResTimeStamp) => void;

const subscribers: Array<Subscriber> = [];
let rafId: number | null = null;

export function onFrame(subscriber: Subscriber): () => boolean {
  const shouldStart = subscribers.length === 0;

  if (!subscribers.includes(subscriber)) {
    subscribers.push(subscriber);
  }

  if (shouldStart) {
    rafId = requestAnimationFrame(callback);
  }

  function unsubscribe(): boolean {
    return unsubscribeSubscriber(subscriber);
  }

  return unsubscribe;
}

function unsubscribeSubscriber(subscriber: Subscriber): boolean {
  if (subscribers.length === 0) {
    return false;
  }

  let result = false;
  const index = subscribers.indexOf(subscriber);
  if (index !== -1) {
    subscribers.splice(index, 1);
    result = true;
  }

  if (subscribers.length === 0 && rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  return result;
}

function callback(time: DOMHighResTimeStamp) {
  subscribers.forEach((subscriber) => {
    subscriber(time);
  });

  if (subscribers.length > 0) {
    rafId = requestAnimationFrame(callback);
  }
}
