import Queue from 'bull';
import { QUEUE_EVENT } from "../../constant/queueEvent";
import { logger } from "../../logger";
import { redisOption } from '../../connection/redisConnection';
import { SOCKET_EVENT_NAME } from '../../constant/socketEventName';
import { sendToRoomEmmiter } from '../../eventEmmitter';
import { deleteTable } from './deleteTableQueue';

const reStartQueue = async (data: any, socket: any) => {
    try {
        logger.info(`START reStartQueue :::: DATA :::: ${JSON.stringify(data)}`)
        let reStart = new Queue(QUEUE_EVENT.RE_START, redisOption);
        let options = {
            jobId: data.tableId,
            delay: data.timer,
            removeOnComplete: true
        }
        reStart.add(data, options)
        reStart.process(async (data: any) => {
            data = {
                eventName: SOCKET_EVENT_NAME.RE_START,
                data: {
                    _id: data.data.tableId,
                    message: "ok"
                }
            }
            sendToRoomEmmiter(data)
            data = {
                tableId: data.data._id,
                timer: 5000
            }
            deleteTable(data, socket)
        })
        logger.info(`END reStartQueue ::::`)

    } catch (error) {
        logger.error(`CATCH_ERROR reStartQueue :::: ${error}`)
    }
}

export { reStartQueue }