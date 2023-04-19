import { bench, describe } from 'vitest';
import { onFrame as onFrameGeneralUnsubscribe, unsubscribe } from './on-frame-general-unsubscribe';
import { onFrame } from '../../src';

const warmupIterations = 50;
const time = 1000;

describe('Unsubscribe', () => {
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
    'unsubscribe with general unsubscribe function',
    () => {
      function callback() {
        // noop
      }
      onFrameGeneralUnsubscribe(callback);
      unsubscribe(callback);
    },
    { time, warmupIterations },
  );
});

describe('Unsubscribe from bigger set', () => {
  let unsubscribersOnFrame: Array<() => boolean> = [];
  let subscribersOnFrameGeneralUnsubscribe: Array<() => void> = [];

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
        unsubscribersOnFrame = new Array(1000).fill(null).map(() => {
          function callback() {
            // noop
          }
          return onFrame(callback);
        });
      },
      teardown: () => {
        unsubscribersOnFrame.forEach((unsubscribe) => unsubscribe());
        unsubscribersOnFrame = [];
      },
    },
  );

  bench(
    'unsubscribe from bigger set with general unsubscribe function',
    () => {
      subscribersOnFrameGeneralUnsubscribe[10]();
      subscribersOnFrameGeneralUnsubscribe[100]();
      subscribersOnFrameGeneralUnsubscribe[4]();
    },
    {
      time,
      warmupIterations,
      setup: () => {
        subscribersOnFrameGeneralUnsubscribe = new Array(1000).fill(null).map(() => {
          function callback() {
            // noop
          }
          onFrameGeneralUnsubscribe(callback);

          return callback;
        });
      },
      teardown: () => {
        subscribersOnFrameGeneralUnsubscribe.forEach((subscriber) => onFrameGeneralUnsubscribe(subscriber));
        subscribersOnFrameGeneralUnsubscribe = [];
      },
    },
  );
});
