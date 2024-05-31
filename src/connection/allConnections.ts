import { logger } from "../logger";
import { connectDb } from "./dbConnection";
import { RedLockConnction } from "./reLockConnection";
import { connectRedis } from "./redisConnection";
import { socketConnection } from "./socketConnection";

const allConnections = async () => {
    try {
        await socketConnection();
        await connectDb();
        await RedLockConnction();
        await connectRedis();
    } catch (error) {
        logger.error(`CATCH_ERROR allConnections :: ${error}`);
    }
}

export { allConnections }