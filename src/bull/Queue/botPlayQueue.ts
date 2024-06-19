import Queue from "bull"
import { redisOption } from "../../connection/redisConnection";
import { QUEUE_EVENT } from "../../constant/queueEvent";
import { logger } from "../../logger"
import { signUpBot } from "../../bot/signUpBot";
import { botPlay } from "../../bot/botPlay";

const botPlayQueue = async (data: any, socket: any) => {
    try {
        logger.info(`START botPlayQueue :::: DATA :::: ${JSON.stringify(data)}`)
        let PlayQueue = new Queue(QUEUE_EVENT.BOT_PLAY, redisOption);
        let options = {
            jobId: data.tableId,
            delay: data.timer,
            removeOnComplete: true
        }
        PlayQueue.add(data, options)
        PlayQueue.process(async (data: any) => {
            data = {
                tableId: data.data.tableId,
                userId: data.data.userId,
                firstTurn: data.data.firstTurn,
                lastMove: data.data.lastMove
            }
            botPlay(data, socket)
        })
        logger.info(`END botPlayQueue ::::`)
    } catch (error) {
        logger.error(`CATCH_ERROR botPlayQueue :::: ${error}`)
    }
}

export { botPlayQueue }