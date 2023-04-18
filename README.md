# on-frame

![npm (scoped)](https://img.shields.io/npm/v/@amate/on-frame)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@amate/on-frame)
![NPM](https://img.shields.io/npm/l/@amate/on-frame)

Batches calls to requestAnimationFrame

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
