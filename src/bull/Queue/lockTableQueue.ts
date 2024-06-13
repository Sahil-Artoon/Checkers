import Queue from "bull"
import { redisOption } from "../../connection/redisConnection";
import { QUEUE_EVENT } from "../../constant/queueEvent";
import { logger } from "../../logger"
import { SOCKET_EVENT_NAME } from "../../constant/socketEventName";
import { sendToRoomEmmiter } from "../../eventEmmitter";

const lockTableQueue = async (data: any, socket: any) => {
    try {
        logger.info(`START lockTableQueue :::: DATA :::: ${JSON.stringify(data)}`)
        let joinBot = new Queue(QUEUE_EVENT.LOCK_TABLE, redisOption);
        let options = {
            jobId: data.tableId,
            delay: data.timer,
            removeOnComplete: true
        }
        joinBot.add(data, options)
        joinBot.process(async (data: any) => {
            data = {
                eventName: SOCKET_EVENT_NAME.LOCK_TABLE,
                data: {
                    _id: data.data.tableId,
                    tableId: data.data.tableId,
                    message: "ok"
                }
            }
            sendToRoomEmmiter(data)
        })
        logger.info(`End lockTableQueue ::::`)

    } catch (error) {
        logger.error(`CATCH_ERROR lockTableQueue :::: ${error}`)
    }
}

export { lockTableQueue }