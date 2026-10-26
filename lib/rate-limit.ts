import { createHash } from "node:crypto";
import { sql } from "@/lib/db";

export interface RateLimitInput {
  key: string;
  limit: number;
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
  degraded: boolean;
}

function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export async function consumeRateLimit(
  input: RateLimitInput
): Promise<RateLimitResult> {
  const rateKey = hashKey(input.key);
  const now = Date.now();

  try {
    const rows = (await sql`
      INSERT INTO rate_limits (rate_key, hit_count, window_start, updated_at)
      VALUES (${rateKey}, 1, NOW(), NOW())
      ON CONFLICT (rate_key) DO UPDATE SET
        hit_count = CASE
          WHEN rate_limits.window_start <= NOW() - make_interval(secs => ${input.windowSeconds})
          THEN 1
          ELSE rate_limits.hit_count + 1
        END,
        window_start = CASE
          WHEN rate_limits.window_start <= NOW() - make_interval(secs => ${input.windowSeconds})
          THEN NOW()
          ELSE rate_limits.window_start
        END,
        updated_at = NOW()
      RETURNING hit_count, window_start;
    `) as { hit_count: number; window_start: string | Date }[];

    const row = rows[0];
    if (!row) {
      return {
        allowed: true,
        remaining: input.limit,
        resetAt: now + input.windowSeconds * 1000,
        retryAfterSeconds: 0,
        degraded: true,
      };
    }

    const windowStart = new Date(row.window_start).getTime();
    const resetAt = windowStart + input.windowSeconds * 1000;
    const hitCount = Number(row.hit_count);
    const allowed = hitCount <= input.limit;

    if (Math.random() < 0.01) {
      void sql`
        DELETE FROM rate_limits
        WHERE updated_at < NOW() - INTERVAL '1 day';
      `.catch((error: unknown) => {
        console.error(
          "[rate-limit] gagal membersihkan data lama",
          error instanceof Error ? error.message : "unknown error"
        );
      });
    }

    return {
      allowed,
      remaining: Math.max(0, input.limit - hitCount),
      resetAt,
      retryAfterSeconds: allowed
        ? 0
        : Math.max(1, Math.ceil((resetAt - now) / 1000)),
      degraded: false,
    };
  } catch (error) {
    console.error(
      "[rate-limit] fallback tanpa pembatasan",
      error instanceof Error ? error.message : "unknown error"
    );
    return {
      allowed: true,
      remaining: input.limit,
      resetAt: now + input.windowSeconds * 1000,
      retryAfterSeconds: 0,
      degraded: true,
    };
  }
}
