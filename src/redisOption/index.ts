import { redis } from "../connection/redisConnection";

const redisSet = async (key: string, data: string) => {
    return await redis.set(key, data);
}

const redisGet = async (key: string) => {
    return await redis.get(key);
}

const redisDel = async (key: string) => {
    return await redis.del(key);
}

export { redisGet, redisSet, redisDel }