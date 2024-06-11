import { REDIS_EVENT_NAME } from "../constant/redisConstant"
import { logger } from "../logger"
import { redisGet } from "../redisOption"

const checkWinner = async (tableId: any) => {
    try {
        logger.info(`START checkWinner :::: DATA :::: ${tableId}`)
        let findtable: any = await redisGet(`${REDIS_EVENT_NAME.TABLE}:${tableId}`)
        findtable = JSON.parse(findtable)
        if (findtable) {
            if (findtable.playerInfo[findtable.currentTurnSeatIndex].color == "black") {

            }
            if (findtable.playerInfo[findtable.currentTurnSeatIndex].color == "red") {

            }
        }
    } catch (error) {
        logger.error(`CATCH_ERROR checkWinner :::: ${error}`)
    }
}

export { checkWinner }