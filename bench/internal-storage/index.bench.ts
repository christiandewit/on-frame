import { bench, describe } from 'vitest';
import { onFrame as onFrameObject } from './on-frame-object';
import { onFrame as onFrameArray } from './on-frame-array';
import { onFrame } from '../../src';

const warmupIterations = 50;
const time = 1000;

describe('unsubscribe', () => {
  bench(
    'unsubscribe default implementation',
    () => {
      function callback() {
        // noop
      }
      const unsubscribe = onFrame(callback);
      unsubscribe();
    },
    { time, warmupIterations },
  );

  bench(
    'unsubscribe with object implementation',
    () => {
      function callback() {
        // noop
      }
      const unsubscribe = onFrameObject(callback);
      unsubscribe();
    },
    { time, warmupIterations },
  );

  bench(
    'unsubscribe with array implementation',
    () => {
      function callback() {
        // noop
      }
      const unsubscribe = onFrameArray(callback);
      unsubscribe();
    },
    { time, warmupIterations },
  );
});

function batchSubscribe(fn: typeof onFrame) {
  return new Array(1000).fill(null).map(() => {
    function callback() {
      // noop
    }
    return fn(callback);
  });
}

describe('unsubscribe from bigger set', () => {
  let unsubscribersOnFrame: Array<() => boolean> = [];
  let unsubscribersOnFrameArray: Array<() => boolean> = [];
  let unsubscribersOnFrameObject: Array<() => boolean> = [];

  bench(
    'unsubscribe from bigger set with default implementation',
    () => {
      unsubscribersOnFrame[10]();
      unsubscribersOnFrame[100]();
      unsubscribersOnFrame[4]();
    },
    {
      time,
      warmupIterations,
      setup: () => {
        unsubscribersOnFrame = batchSubscribe(onFrame);
      },
      teardown: () => {
        unsubscribersOnFrame.forEach((unsubscribe) => unsubscribe());
        unsubscribersOnFrame = [];
      },
    },
  );

  bench(
    'unsubscribe from bigger set with array implementation',
    () => {
      unsubscribersOnFrameArray[10]();
      unsubscribersOnFrameArray[100]();
      unsubscribersOnFrameArray[4]();
    },
    {
      time,
      warmupIterations,
      setup: () => {
        unsubscribersOnFrameArray = batchSubscribe(onFrameArray);
      },
      teardown: () => {
        unsubscribersOnFrameArray.forEach((unsubscribe) => unsubscribe());
        unsubscribersOnFrameArray = [];
      },
    },
  );

  bench(
    'unsubscribe from bigger set with object implementation',
    () => {
      unsubscribersOnFrameObject[10]();
      unsubscribersOnFrameObject[100]();
      unsubscribersOnFrameObject[4]();
    },
    {
      time,
      warmupIterations,
      setup: () => {
        unsubscribersOnFrameObject = batchSubscribe(onFrameObject);
      },
      teardown: () => {
        unsubscribersOnFrameObject.forEach((unsubscribe) => unsubscribe());
        unsubscribersOnFrameObject = [];
      },
    },
  );
});
