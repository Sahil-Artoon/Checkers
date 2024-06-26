import { createClient } from 'redis';
import { logger } from "../logger";
import dotenv from 'dotenv';
dotenv.config()
let redisOption: any = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
}

const redis = createClient(redisOption);

const redisPub: any = createClient(redisOption);
const redisSub: any = createClient(redisOption);

const connectRedis = async () => {
    try {
        redis.connect()
        redis.on("connect", () => {
            logger.info("Redis Connected...");

            // redis.flushDb();
        })
        redis.on('error', (error: any) => {
            logger.error(`CATCH_ERROR connectRedis :: ${error}`);
        });
    } catch (error) {
        logger.error(`CATCH_ERROR connectRedis :: ${error}`);
    }
}

export { redis, connectRedis, redisOption, redisPub, redisSub }