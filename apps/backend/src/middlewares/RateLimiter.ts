import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import {redis} from "../config/redis";
import logger from "../config/logger";

// 500 requests per 15 minutes
const getLimiterConfig = (prefix: string = "default-limiter", max: number = 500, windowMs: number = 15 * 60 * 1000) => {
    return {
        windowMs,
        // max: process.env.NODE_ENV === "development" ? 10 : max,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req: any, res: any) => {
            if (req.rateLimit.current === req.rateLimit.limit + 1) {
                logger.error(`Rate limit reached for ${req.ip}`);
            }
            res.status(429).json({
                message: "Too many requests, please try again later.",
            });
        },
        store: new RedisStore({
            // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
            sendCommand: (...args: string[]) => redis.call(...args),
            prefix,
        }),
    };
};

export const appLimiter = (app: any) => {
    app.use(rateLimit(getLimiterConfig()));
};

export const rateLimiter = (prefix?: string, max?: number, windowMs?: number) => {
    return rateLimit(getLimiterConfig(prefix, max, windowMs));
};
