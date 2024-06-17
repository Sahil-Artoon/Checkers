import Queue from "bull"
import { redisOption } from "../../connection/redisConnection";
import { logger } from "../../logger";
import { QUEUE_EVENT } from "../../constant/queueEvent";


const cancleRoundTimer = async (jobId: any) => {
    try {
        logger.info(`START cancleRoundTimer :::: DATA :::: ${JSON.stringify(jobId)}`)
        const queue = new Queue(QUEUE_EVENT.ROUND_TIMER, redisOption);
        const job = await queue.getJob(jobId);
        if (job) {
            await job?.remove();
            logger.info("END cancleRoundTimer :::: DELETE Done.")
            return true
        }
        logger.info("END cancleRoundTimer :::: not DELETE ????.")
        return false;
    } catch (error) {
        logger.error(`CATCH_ERROR cancleRoundTimer ERROR :::: ${error}`)
    }
}

export { cancleRoundTimer }