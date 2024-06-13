import Queue from "bull"
import { redisOption } from "../../connection/redisConnection";
import { QUEUE_EVENT } from "../../constant/queueEvent";
import { logger } from "../../logger"
import { SOCKET_EVENT_NAME } from "../../constant/socketEventName";
import { sendToRoomEmmiter } from "../../eventEmmitter";
import { turn } from "../../playing/turn";

const roundTimerQueue = async (data: any, socket: any) => {
    try {
        logger.info(`START roundTimerQueue :::: DATA :::: ${JSON.stringify(data)}`)
        let joinBot = new Queue(QUEUE_EVENT.ROUND_TIMER, redisOption);
        let options = {
            jobId: data.tableId,
            delay: data.timer,
            removeOnComplete: true
        }
        joinBot.add(data, options)
        joinBot.process(async (data: any) => {
            turn(data.data.tableId, socket)
        })
        logger.info(`END roundTimerQueue :::`)
    } catch (error) {
        logger.error(`CATCH_ERROR roundTimerQueue :::: ${error}`)
    }
}

export { roundTimerQueue }