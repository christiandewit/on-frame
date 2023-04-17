# on-frame

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
