import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const MAX_REQUESTS = 18;
const WINDOW_MS = 10 * 60 * 1000;

const memoryStore = new Map<string, { count: number; resetAt: number }>();

let upstashRatelimit: Ratelimit | null | undefined;

const getUpstashRatelimit = () => {
  if (upstashRatelimit !== undefined) {
    return upstashRatelimit;
  }

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    upstashRatelimit = null;
    return upstashRatelimit;
  }

  upstashRatelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS, '10 m'),
    prefix: 'sabith-chat',
  });

  return upstashRatelimit;
};

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export const rateLimit = async (key: string): Promise<RateLimitResult> => {
  const upstash = getUpstashRatelimit();

  if (upstash) {
    const result = await upstash.limit(key);

    return {
      success: result.success,
      limit: MAX_REQUESTS,
      remaining: result.remaining,
      reset: result.reset,
    };
  }

  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || entry.resetAt <= now) {
    const resetAt = now + WINDOW_MS;
    memoryStore.set(key, { count: 1, resetAt });

    return {
      success: true,
      limit: MAX_REQUESTS,
      remaining: MAX_REQUESTS - 1,
      reset: resetAt,
    };
  }

  entry.count += 1;
  memoryStore.set(key, entry);

  return {
    success: entry.count <= MAX_REQUESTS,
    limit: MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - entry.count),
    reset: entry.resetAt,
  };
};
