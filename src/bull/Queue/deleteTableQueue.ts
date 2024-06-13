import Queue from 'bull';
import { logger } from "../../logger";
import { QUEUE_EVENT } from '../../constant/queueEvent';
import { redisOption } from '../../connection/redisConnection';
import { redisDel, redisGet } from '../../redisOption';
import { REDIS_EVENT_NAME } from '../../constant/redisConstant';
import { GAME_STATUS } from '../../constant/gameStatus';

const deleteTable = async (data: any, socket: any) => {
    try {
        logger.info(`START deleteTable :::: DATA :::: ${JSON.stringify(data)}`)
        let tableDel = new Queue(QUEUE_EVENT.DELETE_TABLE, redisOption);
        let options = {
            jobId: data.tableId,
            delay: data.timer,
            removeOnComplete: true
        }
        tableDel.add(data, options)
        tableDel.process(async (data: any) => {
            let findTable: any = await redisGet(`${REDIS_EVENT_NAME.TABLE}:${data.data.tableId}`)
            findTable = JSON.parse(findTable)
            if (findTable) {
                if (findTable.gameStatus == GAME_STATUS.WINNER) {
                    await redisDel(`${REDIS_EVENT_NAME.TABLE}:${data.data.tableId}`)
                }
            }
        })
        logger.info(`END deleteTable ::::`)

    } catch (error) {
        logger.error(`CATCH_ERROR deleteTable :::: ${error}`)
    }
}

export { deleteTable }