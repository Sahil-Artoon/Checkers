import { botPlay } from "../bot/botPlay"
import { botPlayQueue } from "../bull/Queue/botPlayQueue"
import { REDIS_EVENT_NAME } from "../constant/redisConstant"
import { SOCKET_EVENT_NAME } from "../constant/socketEventName"
import { sendToRoomEmmiter } from "../eventEmmitter"
import { logger } from "../logger"
import { redisDel, redisGet, redisSet } from "../redisOption"

const changeTurn = async (data: any, socket: any) => {
    try {
        logger.info(`START changeTurn :::: DATA :::: ${JSON.stringify(data)}`)
        let { tableId, lastMove }: any = data
        if (tableId) {
            let findTable: any = await redisGet(`${REDIS_EVENT_NAME.TABLE}:${tableId}`)
            findTable = JSON.parse(findTable)
            if (findTable) {
                if (findTable.currentTurnSeatIndex == 0) {
                    let table: any = await redisGet(`${REDIS_EVENT_NAME.TABLE}:${tableId}`)
                    table = JSON.parse(table)
                    table.currentTurnSeatIndex = 1
                    table.currentTurnUserId = table?.playerInfo[1].userId
                    await redisDel(`${REDIS_EVENT_NAME.TABLE}:${table._id}`)
                    await redisSet(`${REDIS_EVENT_NAME.TABLE}:${table._id}`, table)
                    let data: any = {
                        eventName: SOCKET_EVENT_NAME.CHANGE_TURN,
                        data: {
                            _id: table._id,
                            color: table.playerInfo[1].color,
                            userId: table.playerInfo[1].userId,
                            message: "ok"

                        }
                    }
                    sendToRoomEmmiter(data)
                    if (findTable.playerInfo[1].isBot) {
                        data = {
                            tableId,
                            userId: table.playerInfo[1].userId,
                            firstTurn: false,
                            lastMove,
                            timer: 2000
                        }
                        botPlayQueue(data, socket)
                    }
                }
                if (findTable.currentTurnSeatIndex == 1) {
                    let table: any = await redisGet(`${REDIS_EVENT_NAME.TABLE}:${tableId}`)
                    table = JSON.parse(table)
                    table.currentTurnSeatIndex = 0
                    table.currentTurnUserId = table?.playerInfo[0].userId
                    await redisDel(`${REDIS_EVENT_NAME.TABLE}:${table._id}`)
                    await redisSet(`${REDIS_EVENT_NAME.TABLE}:${table._id}`, table)
                    let data = {
                        eventName: SOCKET_EVENT_NAME.CHANGE_TURN,
                        data: {
                            _id: table._id,
                            color: table.playerInfo[0].color,
                            userId: table.playerInfo[0].userId,
                            message: "ok"

                        }
                    }
                    sendToRoomEmmiter(data)
                    if (findTable.playerInfo[0].isBot) {
                        let data = {
                            tableId,
                            userId: table.playerInfo[1].userId,
                            firstTurn: false,
                            lastMove,
                            timer: 2000
                        }
                        botPlayQueue(data, socket)
                    }
                }
            }
        }
    } catch (error) {
        logger.error(`CATCH_ERROR :::: ${error}`)
    }
}

export { changeTurn }