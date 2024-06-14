import Queue from 'bull';
import { QUEUE_EVENT } from "../../constant/queueEvent";
import { logger } from "../../logger";
import { redisOption } from '../../connection/redisConnection';
import { SOCKET_EVENT_NAME } from '../../constant/socketEventName';
import { sendToRoomEmmiter } from '../../eventEmmitter';
import { deleteTable } from './deleteTableQueue';
import { BULL_TIMER } from '../../constant/bullTimer';
import { redisDel, redisGet, redisSet } from '../../redisOption';
import { REDIS_EVENT_NAME } from '../../constant/redisConstant';

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
            console.log("This is Inside the reStartQueue Process :::::::::::::::::::")
            let findTable: any = await redisGet(`${REDIS_EVENT_NAME.TABLE}:${data.data.tableId}`)
            findTable = JSON.parse(findTable)
            if (findTable) {
                console.log('This is InsideFindTable In reStartQueue')
                let userOne: any = await redisGet(`${REDIS_EVENT_NAME.USER}:${findTable.playerInfo[0].userId}`)
                userOne = JSON.parse(userOne)
                if (userOne) {
                    userOne.tableId = ""
                }
                await redisDel(`${REDIS_EVENT_NAME.USER}:${findTable.playerInfo[0].userId}`)
                await redisSet(`${REDIS_EVENT_NAME.USER}:${findTable.playerInfo[0].userId}`, userOne)
                let userTwo: any = await redisGet(`${REDIS_EVENT_NAME.USER}:${findTable.playerInfo[1].userId}`)
                userTwo = JSON.parse(userTwo)
                if (userTwo) {
                    userTwo.tableId = ""
                }
                await redisDel(`${REDIS_EVENT_NAME.USER}:${findTable.playerInfo[1].userId}`)
                await redisSet(`${REDIS_EVENT_NAME.USER}:${findTable.playerInfo[1].userId}`, userTwo)
            }
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
                timer: 2000
            }
            deleteTable(data, socket)
        })
        logger.info(`END reStartQueue ::::`)

    } catch (error) {
        logger.error(`CATCH_ERROR reStartQueue :::: ${error}`)
    }
}

export { reStartQueue }