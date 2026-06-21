// In-memory brute-force limiter (keyed by an arbitrary string, e.g. email or IP).
//
// Suitable for a SINGLE app instance — which is how this app is deployed on
// Dokploy. If you ever scale horizontally (multiple instances behind a load
// balancer), this Map-based store will only protect each instance in isolation;
// swap the store below for Redis/Upstash. The exported API
// (isLocked / recordFailure / reset) is designed to stay the same.

const MAX_ATTEMPTS = 5; // failures allowed within WINDOW_MS before lockout
const WINDOW_MS = 15 * 60 * 1000; // rolling window in which failures accumulate
const LOCKOUT_MS = 15 * 60 * 1000; // how long a key stays locked once tripped

type Entry = { count: number; firstAt: number; lockedUntil: number };

const store = new Map<string, Entry>();

function prune(now: number) {
  for (const [key, e] of store) {
    // drop entries that are neither locked nor inside an active window
    if (e.lockedUntil <= now && now - e.firstAt > WINDOW_MS) store.delete(key);
  }
}

/** Returns whether the key is currently locked out, and for how much longer. */
export function isLocked(key: string): { locked: boolean; retryAfterMs: number } {
  const now = Date.now();
  const e = store.get(key);
  if (e && e.lockedUntil > now) {
    return { locked: true, retryAfterMs: e.lockedUntil - now };
  }
  return { locked: false, retryAfterMs: 0 };
}

/** Records a failed attempt for the key; trips a lockout once MAX_ATTEMPTS reached. */
export function recordFailure(key: string): void {
  const now = Date.now();
  prune(now);
  const e = store.get(key);
  if (!e || now - e.firstAt > WINDOW_MS) {
    // start a fresh window
    store.set(key, { count: 1, firstAt: now, lockedUntil: 0 });
    return;
  }
  e.count += 1;
  if (e.count >= MAX_ATTEMPTS) {
    e.lockedUntil = now + LOCKOUT_MS;
  }
}

/** Clears all state for a key (call on successful login). */
export function reset(key: string): void {
  store.delete(key);
}

export const RATE_LIMIT = { MAX_ATTEMPTS, WINDOW_MS, LOCKOUT_MS };
