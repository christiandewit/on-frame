# on-frame

[![npm (scoped)](https://img.shields.io/npm/v/@amate/on-frame)](https://www.npmjs.com/package/@amate/on-frame)
[![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@amate/on-frame)](https://bundlephobia.com/package/@amate/on-frame)
[![NPM](https://img.shields.io/npm/l/@amate/on-frame)](https://github.com/christiandewit/on-frame/blob/main/LICENSE.md)

Batches calls to requestAnimationFrame.

## API

- `onFrame(subscriber: Subscriber): () => boolean`
- `type Subscriber = (time: DOMHighResTimeStamp) => void;`

## How it works

The return value of `onFrame` is an unsubscribe function, it returns a `boolean`that indicates if unsubscribing was successful.

The timestamp passed to the subscriber is the original timestamp as provided by the `requestAnimationFrame` callback.

Functions can only be subscribed once, but invoking it multiple times is fine as it will also return an `unsubscribe` function.

## Example

```
import { onFrame } from 'on-frame';

let i = 0;

const unsubscribe = onFrame((time) => {
  console.log(`frame called at ${time}`);

  i += 1;

  // stop after 5 ticks
  if (i === 5) {
    unsubscribe();
  }
});
```
