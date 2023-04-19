type Subscriber = (time: DOMHighResTimeStamp) => void;
type SubscriberObject = { id: number; subscriber: Subscriber; unsubscribe: () => boolean };

const subscribers: Record<number, SubscriberObject> = {};
let size = 0;
let id = 0;
let rafId: number | null = null;

export function onFrame(subscriber: Subscriber): () => boolean {
  const shouldStart = size === 0;

  let subscriberObject = Object.values(subscribers).find((value) => value.subscriber === subscriber);

  if (!subscriberObject) {
    const subscriberId = id++;
    subscriberObject = {
      id: subscriberId,
      subscriber,
      unsubscribe: () => {
        if (subscriberObject) {
          return unsubscribeSubscriber(subscriberObject);
        }
        return false;
      },
    };
    subscribers[subscriberId] = subscriberObject;
    size++;
  }

  if (shouldStart) {
    rafId = requestAnimationFrame(callback);
  }

  return subscriberObject.unsubscribe;
}

function unsubscribeSubscriber(subscriberObject: SubscriberObject): boolean {
  if (size === 0) {
    return false;
  }

  let result = false;

  if (subscribers[subscriberObject.id]) {
    delete subscribers[subscriberObject.id];
    size -= 1;
    result = true;
  }

  if (size === 0 && rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  return result;
}

function callback(time: DOMHighResTimeStamp) {
  Object.values(subscribers).forEach((subscriberObject) => {
    subscriberObject.subscriber(time);
  });

  if (size > 0) {
    rafId = requestAnimationFrame(callback);
  }
}
