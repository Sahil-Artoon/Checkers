import Redlock from "redlock";
import Redis from 'ioredis';
import { logger } from "../logger";

import dotenv from 'dotenv';
dotenv.config()
let redisOption: any = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB
}

let redLock: any;

const RedLockConnction = async () => {

    try {
        const redisClient = new Redis(redisOption);
        redLock = new Redlock([redisClient as any], {
            driftFactor: 0.01,
            retryCount: -1,
            retryDelay: 25,
            retryJitter: 20,
            // automaticExtensionThreshold: 500
        });
        redLock.on('error', async (error: any) => { logger.error("Error with redlock") });
        logger.info("Connected redLock Successfully !!!")
    } catch (error: any) {
        logger.error(`CATCH_ERROR RedLockConnction :: ${error}`);
    };
};

const ApplyLock = async (Path: string, LockId: string) => {
    try {
        await logger.info("ApplyLock", JSON.stringify({ Path, LockId }));
        const Lock = await redLock.acquire([LockId], 5 * 1000);
        return Lock;
    } catch (error: any) {
        await logger.error(`CATCH_ERROR ApplyLock :: ${error}`);
    };
};

const RemoveLock = async (Path: string, Lock: any) => {
    try {
        await logger.info("RemoveLock", JSON.stringify({ Path, LockId: Lock?.resources }));
        await Lock.release();
    } catch (error: any) {
        await logger.error(`CATCH_ERROR RemoveLock :: ${error}`);
    };
};

export { RedLockConnction, ApplyLock, RemoveLock };