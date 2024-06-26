import { botPlay } from "../bot/botPlay"
import { botPlayQueue } from "../bull/Queue/botPlayQueue"
import { reStartQueue } from "../bull/Queue/reStartQueue"
import { checkPosibilities } from "../common/checkPosibilities"
import { checkPositionInTurn } from "../common/checkPositionsInTurn"
import { BULL_TIMER } from "../constant/bullTimer"
import { GAME_STATUS } from "../constant/gameStatus"
import { REDIS_EVENT_NAME } from "../constant/redisConstant"
import { SOCKET_EVENT_NAME } from "../constant/socketEventName"
import { sendToRoomEmmiter } from "../eventEmmitter"
import { logger } from "../logger"
import { redisDel, redisGet, redisSet } from "../redisOption"
import { checkPosition } from "./checkPosition"

const changeTurn = async (data: any, socket: any) => {
    try {
        logger.info(`START changeTurn :::: DATA :::: ${JSON.stringify(data)}`)
        let { tableId, lastMove }: any = data
        if (tableId) {
            let findTable: any = await redisGet(`${REDIS_EVENT_NAME.TABLE}:${tableId}`)
            findTable = JSON.parse(findTable)
            if (findTable) {
                if (findTable.currentTurnSeatIndex == 0) {

                    let checkGameIsValidOrNot = await checkPosibilities(findTable, findTable.playerInfo[1].userId)
                    if (checkGameIsValidOrNot) {
                        let arr: any = []
                        for (let i = 0; i < checkGameIsValidOrNot.length; i++) {
                            let checkIsValidPosition = await checkPositionInTurn(checkGameIsValidOrNot[i], findTable.tableData, findTable.playerInfo[1].color)
                            console.log("This is checkIsValidPosition: i is ::: ", i, "And Data Is", checkIsValidPosition)
                            if (checkIsValidPosition.length > 0) {
                                arr.push(checkIsValidPosition)
                            }
                        }
                        console.log("This is Arr in change Turn ::::: ", arr)
                        if (arr.length == 0) {
                            findTable.gameStatus = GAME_STATUS.TIE
                            findTable.winnerUserId = ''
                            await redisDel(`${REDIS_EVENT_NAME.TABLE}:${findTable._id}`)
                            await redisSet(`${REDIS_EVENT_NAME.TABLE}:${findTable._id}`, findTable)
                            let data = {
                                eventName: SOCKET_EVENT_NAME.WINNER,
                                data: {
                                    _id: tableId,
                                    message: "ok",
                                    tie: true
                                }
                            }
                            sendToRoomEmmiter(data)
                            let dataOfRestartQueue = {
                                tableId,
                                timer: BULL_TIMER.RE_START
                            }
                            return reStartQueue(dataOfRestartQueue, socket)
                        }
                    }


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
                    let checkGameIsValidOrNot = await checkPosibilities(findTable, findTable.playerInfo[0].userId)
                    if (checkGameIsValidOrNot) {
                        let arr: any = []
                        for (let i = 0; i < checkGameIsValidOrNot.length; i++) {
                            let checkIsValidPosition: any = await checkPositionInTurn(checkGameIsValidOrNot[i], findTable.tableData, findTable.playerInfo[0].color)
                            console.log("This is checkIsValidPosition: i is ::: ", i, "And Data Is", checkIsValidPosition)
                            if (checkIsValidPosition.length > 0) {
                                arr.push(checkIsValidPosition)
                            }
                        }
                        console.log("This is Arr in change Turn ::::: ", arr)
                        if (arr.length == 0) {
                            findTable.gameStatus = GAME_STATUS.TIE
                            findTable.winnerUserId = ''
                            await redisDel(`${REDIS_EVENT_NAME.TABLE}:${findTable._id}`)
                            await redisSet(`${REDIS_EVENT_NAME.TABLE}:${findTable._id}`, findTable)
                            let data = {
                                eventName: SOCKET_EVENT_NAME.WINNER,
                                data: {
                                    _id: tableId,
                                    message: "ok",
                                    tie: true
                                }
                            }
                            sendToRoomEmmiter(data)
                            let dataOfRestartQueue = {
                                tableId,
                                timer: BULL_TIMER.RE_START
                            }
                            return reStartQueue(dataOfRestartQueue, socket)
                        }
                    }
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