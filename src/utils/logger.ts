// --- Logger ---
// A minimal timestamped logger.
// For production agents, replace this with a proper logging library like `pino` or `winston`
// which support log levels, structured JSON output, and log file rotation.

function timestamp(): string {
  return new Date().toISOString();
}

export function log(message: string): void {
  console.log(`[${timestamp()}] INFO  ${message}`);
}

export function warn(message: string): void {
  console.warn(`[${timestamp()}] WARN  ${message}`);
}

export function error(message: string, err?: unknown): void {
  console.error(`[${timestamp()}] ERROR ${message}`);
  if (err) console.error(err);
}
