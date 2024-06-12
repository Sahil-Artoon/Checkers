import { redis } from "../connection/redisConnection";
import { logger } from "../logger";

const redisSet = async (key: string, data: any) => {
    try {
        logger.info(`START redisSet ::: ${key}`);
        let dataOfRedisSet: any = await redis.set(key, JSON.stringify(data));
        logger.info(`END redisSet ::: ${key} `);
        return
    } catch (error) {
        logger.error(`CATCH_ERROR redisSet :::: ${error}`)
    }
}

const redisGet = async (key: string) => {
    try {
        logger.info(`START redisGet ::: ${key}`);
        let dataOfRedisGet: any = await redis.get(key);
        logger.info(`END redisGet ::: ${key}`);
        return dataOfRedisGet
    } catch (error) {
        logger.error(`CATCH_ERROR redisGet :::: ${error}`)
    }
}

const redisDel = async (key: string) => {
    try {
        logger.info(`START redisDel ::: ${key}`);
        let dataOfRedisDel: any = await redis.del(key);
        logger.info(`END redisDel ::: ${key}`);
        return
    } catch (error) {
        logger.error(`CATCH_ERROR redisDel :::: ${error}`)
    }
}

export { redisGet, redisSet, redisDel }