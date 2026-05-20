import { warn } from './logger.js';

// --- Retry with Exponential Backoff ---
// Agents call external APIs (Gemini, Claude, Gmail, etc.) which can fail temporarily:
//   - Rate limit hit (429) — the API is telling you to slow down
//   - Network blip — a transient connection error
//   - Service overload (503) — the provider is temporarily busy
//
// Retrying immediately after a failure usually hits the same error.
// Exponential backoff waits progressively longer between attempts:
//   Attempt 1 fails → wait 1s → Attempt 2 fails → wait 2s → Attempt 3 fails → wait 4s → give up
//
// This dramatically improves reliability without any changes to your main logic.
// Just wrap any unreliable call: await withRetry(() => provider.ask(...), 3, 1000)

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxAttempts) {
        const delayMs = baseDelayMs * Math.pow(2, attempt - 1);
        warn(`Attempt ${attempt}/${maxAttempts} failed. Retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
}
