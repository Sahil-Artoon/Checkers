import Queue from "bull"
import { redisOption } from "../../connection/redisConnection";
import { QUEUE_EVENT } from "../../constant/queueEvent";
import { logger } from "../../logger"
import { signUpBot } from "../../bot/signUpBot";

const joinBotQueue = async (data: any, socket: any) => {
    try {
        logger.info(`START joinBotQueue :::: DATA :::: ${JSON.stringify(data)}`)
        let joinBot = new Queue(QUEUE_EVENT.JOIN_BOT, redisOption);
        let options = {
            jobId: data.tableId,
            delay: data.timer,
            removeOnComplete: true
        }
        joinBot.add(data, options)
        joinBot.process(async (data: any) => {
            signUpBot(data.data.tableId, socket)
        })
        logger.info(`END joinBotQueue ::::`)
    } catch (error) {
        logger.error(`CATCH_ERROR joinBotQueue :::: ${error}`)
    }
}

export { joinBotQueue }