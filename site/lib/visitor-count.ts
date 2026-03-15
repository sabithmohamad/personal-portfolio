import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { Redis } from '@upstash/redis';

const VISITOR_SET_KEY = 'sabith-portfolio:visitors';
const LOCAL_DATA_DIR = path.join(process.cwd(), '.data');
const LOCAL_VISITOR_FILE = path.join(LOCAL_DATA_DIR, 'visitors.json');
const memoryVisitors = new Set<string>();

let upstashRedis: Redis | null | undefined;

const getUpstashRedis = () => {
  if (upstashRedis !== undefined) {
    return upstashRedis;
  }

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    upstashRedis = null;
    return upstashRedis;
  }

  upstashRedis = Redis.fromEnv();
  return upstashRedis;
};

export interface VisitorCountResult {
  count: number;
  isNew: boolean;
  persistent: boolean;
}

const readLocalVisitors = async () => {
  try {
    const raw = await readFile(LOCAL_VISITOR_FILE, 'utf8');
    const parsed = JSON.parse(raw) as { visitors?: string[] };

    if (!Array.isArray(parsed.visitors)) {
      return new Set<string>();
    }

    return new Set(parsed.visitors.filter((value): value is string => typeof value === 'string' && value.length > 0));
  } catch {
    return new Set<string>();
  }
};

const writeLocalVisitors = async (visitors: Set<string>) => {
  await mkdir(LOCAL_DATA_DIR, { recursive: true });
  await writeFile(
    LOCAL_VISITOR_FILE,
    JSON.stringify(
      {
        visitors: [...visitors],
      },
      null,
      2,
    ),
    'utf8',
  );
};

export const registerVisitor = async (visitorId: string): Promise<VisitorCountResult> => {
  const redis = getUpstashRedis();

  if (redis) {
    const added = await redis.sadd(VISITOR_SET_KEY, visitorId);
    const count = await redis.scard(VISITOR_SET_KEY);

    return {
      count,
      isNew: added === 1,
      persistent: true,
    };
  }

  const visitors = await readLocalVisitors();
  const isNew = !visitors.has(visitorId);

  try {
    if (isNew) {
      visitors.add(visitorId);
      await writeLocalVisitors(visitors);
    }

    return {
      count: visitors.size,
      isNew,
      persistent: true,
    };
  } catch {
    const fallbackIsNew = !memoryVisitors.has(visitorId);

    if (fallbackIsNew) {
      memoryVisitors.add(visitorId);
    }

    return {
      count: memoryVisitors.size,
      isNew: fallbackIsNew,
      persistent: false,
    };
  }
};
