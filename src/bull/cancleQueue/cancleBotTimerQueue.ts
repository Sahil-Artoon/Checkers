import Queue from "bull"
import { redisOption } from "../../connection/redisConnection";
import { logger } from "../../logger";
import { QUEUE_EVENT } from "../../constant/queueEvent";


const cancleBotTimer = async (jobId: any) => {
    try {
        const queue = new Queue(QUEUE_EVENT.JOIN_BOT, redisOption);
        const job = await queue.getJob(jobId);
        if (job) {
            await job?.remove();
            return true
        }
        return false;
    } catch (error) {
        logger.error("LEAVE_BUTTON CANCLE QUEUE ERROR :::: ", error)
    }
}

export { cancleBotTimer }