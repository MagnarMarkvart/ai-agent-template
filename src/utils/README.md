# utils/

Shared helper functions used across the project.

| File | Purpose |
|---|---|
| `logger.ts` | Timestamped `log`, `warn`, `error` functions |
| `retry.ts` | `withRetry(fn, maxAttempts, baseDelayMs)` — retries a failing async call with exponential backoff |

Use `withRetry` around any external API call that can transiently fail (rate limits, network errors):

```ts
const response = await withRetry(() => provider.ask(messages, tools), 3, 1000);
```
