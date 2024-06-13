import { GAME_STATUS } from "../constant/gameStatus"
import { REDIS_EVENT_NAME } from "../constant/redisConstant"
import { SOCKET_EVENT_NAME } from "../constant/socketEventName"
import { sendToRoomEmmiter } from "../eventEmmitter"
import { logger } from "../logger"
import { redisDel, redisGet, redisSet } from "../redisOption"

const turn = async (tableId: any, socket: any) => {
    try {
        logger.info(`START turn :::: DATA ${JSON.stringify(tableId)}`)
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        let ramdomNumberForGiveUserTurn = 1;
        if (randomNumber % 2 == 1) {
            ramdomNumberForGiveUserTurn = 1;
        } else {
            ramdomNumberForGiveUserTurn = 0;
        }
        console.log("TURN of THIS PLAYER ", ramdomNumberForGiveUserTurn)
        let findTable: any = await redisGet(`${REDIS_EVENT_NAME.TABLE}:${tableId}`)
        findTable = JSON.parse(findTable)
        if (findTable) {
            findTable.currentTurnSeatIndex = ramdomNumberForGiveUserTurn
            findTable.currentTurnUserId = findTable?.playerInfo[ramdomNumberForGiveUserTurn].userId
            findTable.gameStatus = GAME_STATUS.PLAYING
            await redisDel(`${REDIS_EVENT_NAME.TABLE}:${findTable._id}`)
            await redisSet(`${REDIS_EVENT_NAME.TABLE}:${findTable._id}`, findTable)
            let data = {
                eventName: SOCKET_EVENT_NAME.TURN,
                data: {
                    _id: findTable?._id,
                    color: findTable?.playerInfo[ramdomNumberForGiveUserTurn].color,
                    userId: findTable?.playerInfo[ramdomNumberForGiveUserTurn].userId,
                    message: "ok"
                }
            }
            sendToRoomEmmiter(data)
        }
    } catch (error) {
        logger.error(`CATCH_ERROR turn :::: ${error}`)
    }
}

export { turn }