import { logger } from "../logger";
import { connectDb } from "./dbConnection";
import { RedLockConnction } from "./reLockConnection";
import { connectRedis } from "./redisConnection";
import { socketConnection } from "./socketConnection";

const allConnections = async () => {
    try {
        await connectRedis();
        await socketConnection();
        await RedLockConnction();
        await connectDb();
    } catch (error) {
        logger.error(`CATCH_ERROR allConnections :: ${error}`);
    }
}

export { allConnections }