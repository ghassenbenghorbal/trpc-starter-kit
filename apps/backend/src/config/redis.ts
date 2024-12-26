import dotenv from "dotenv";
import Redis from "ioredis";
import logger from "./logger";

dotenv.config();

let redis_config = {};

if (process.env.NODE_ENV === "development") {
    redis_config = {
        host: "localhost",
        port: 6379,
    };
// } else if (process.env.NODE_ENV === "office") {
//     redis_config = {
//         host: process.env.REDIS_HOST,
//         port: 6379,
//     };
} else if (process.env.NODE_ENV === "production") {
    redis_config = {
        host: `${process.env.REDIS_HOST}`,
        port: 6379,
        password: `${process.env.DB_PASSWORD}`,
    };
} else {
    logger.error("NODE_ENV is not set!");
    process.exit(1);
}

const initRedis = () => {
    const redis = new Redis(redis_config);

    redis.on("connect", () => {
        logger.info("Express is connected to Redis!");
    });

    redis.on("error", () => {
        logger.error("Express failed to connect to Redis!");
        throw new Error("Redis connection failed!");
    });

    return redis;
};

export const redis = initRedis();