import { GAME_STATUS } from "../constant/gameStatus"
import { REDIS_EVENT_NAME } from "../constant/redisConstant"
import { SOCKET_EVENT_NAME } from "../constant/socketEventName"
import { sendToSocketIdEmmiter } from "../eventEmmitter"
import { logger } from "../logger"
import { redisDel, redisGet, redisSet } from "../redisOption"
import { reJoinValidation } from "../validation/reJoinValidation"

const reJoin = async (data: any, socket: any) => {
    try {
        console.log(":::::::::::::::::::::::::::::::::::::::::::::::::::")
        console.log("Socket Id inside Rejoin ::::: ", socket.id)
        console.log(":::::::::::::::::::::::::::::::::::::::::::::::::::")
        logger.info(`START reJoin :::: DATA :::: ${JSON.stringify(data)}`)
        let checkData: any = await reJoinValidation(data)
        if (checkData?.error) {
            data = {
                eventName: SOCKET_EVENT_NAME.POP_UP,
                data: {
                    message: checkData.error.details[0].message
                },
                socket
            }
            sendToSocketIdEmmiter(data)
            logger.info(`END reJoin :::: ${JSON.stringify(data.data)}`)
            return;
        }
        let { tableId, userId } = data
        let findUser: any = await redisGet(`${REDIS_EVENT_NAME.USER}:${userId}`)
        findUser = JSON.parse(findUser)
        if (findUser.tableId !== tableId) {
            data = {
                eventName: SOCKET_EVENT_NAME.POP_UP,
                data: {
                    message: 'User tableId and tableId is not Match !!!'
                },
                socket
            }
            sendToSocketIdEmmiter(data)
            logger.info(`END reJoin :::: ${JSON.stringify(data.data)}`)
            return;
        }
        let findTable: any = await redisGet(`${REDIS_EVENT_NAME.TABLE}:${tableId}`)
        findTable = JSON.parse(findTable)
        if (findTable) {
            // This is Waiting Stage
            if (findTable.gameStatus === GAME_STATUS.WAITING) {
                if (findTable.activePlayer == 1) {
                    await redisDel(`${REDIS_EVENT_NAME.TABLE}:${tableId}`)
                    let findQueue: any = await redisGet(`${REDIS_EVENT_NAME.QUEUE}`)
                    findQueue = JSON.parse(findQueue)
                    if (findQueue.length == 1) {
                        await redisDel(`${REDIS_EVENT_NAME.QUEUE}`)
                    } else {
                        let index = findQueue.indexOf(tableId);
                        if (index !== -1) {
                            findQueue.splice(index, 1);
                        }
                        await redisDel(`${REDIS_EVENT_NAME.QUEUE}`)
                        await redisSet(`${REDIS_EVENT_NAME.QUEUE}`, findQueue)
                    }
                    findUser.tableId = ""
                    await redisDel(`${REDIS_EVENT_NAME.USER}:${userId}`)
                    await redisSet(`${REDIS_EVENT_NAME.USER}:${userId}`, findUser)
                    data = {
                        eventName: SOCKET_EVENT_NAME.RE_JOIN,
                        data: {
                            gameStatus: GAME_STATUS.WAITING,
                            message: "ok",
                            tableDelete: true
                        },
                        socket
                    }
                    sendToSocketIdEmmiter(data)
                    logger.info(`END reJoin :::: ${JSON.stringify(data.data)}`)
                    return;
                }
            }
            // This is RoundTimer
            if (findTable.gameStatus == GAME_STATUS.ROUND_TIMER) {
                console.log("This is Inside GameStatus ::::: ROUND_TIMER")
                data = {
                    eventName: SOCKET_EVENT_NAME.RE_JOIN,
                    data: {
                        gameStatus: GAME_STATUS.ROUND_TIMER,
                        message: "ok",
                        tableId,
                        userId,
                        tableData: findTable.tableData,
                        playerInfo: findTable.playerInfo
                    },
                    socket
                }
                socket.join(findTable._id)
                sendToSocketIdEmmiter(data)
                logger.info(`END reJoin :::: ${JSON.stringify(data.data)}`)
                return;
            }
            // This is Lock_table
            if (findTable.gameStatus == GAME_STATUS.LOCK_TABLE) {
                console.log("This is Inside GameStatus ::::: LOCK_TABLE")
                data = {
                    eventName: SOCKET_EVENT_NAME.RE_JOIN,
                    data: {
                        gameStatus: GAME_STATUS.LOCK_TABLE,
                        message: "ok",
                        tableId,
                        userId,
                        tableData: findTable.tableData,
                        playerInfo: findTable.playerInfo
                    },
                    socket
                }
                socket.join(findTable._id)
                sendToSocketIdEmmiter(data)
                logger.info(`END reJoin :::: ${JSON.stringify(data.data)}`)
                return;
            }

            if (findTable.gameStatus == GAME_STATUS.PLAYING) {
                console.log("This is Inside GameStatus ::::: PLAYING")
                data = {
                    eventName: SOCKET_EVENT_NAME.RE_JOIN,
                    data: {
                        gameStatus: GAME_STATUS.PLAYING,
                        message: "ok",
                        tableId,
                        userId,
                        table: findTable
                    },
                    socket
                }
                socket.join(findTable._id)
                sendToSocketIdEmmiter(data)
                logger.info(`END reJoin :::: ${JSON.stringify(data.data)}`)
                return;
            }

            if (findTable.gameStatus == GAME_STATUS.WINNER) {
                console.log("This is Inside GameStatus ::::: WINNER")
                data = {
                    eventName: SOCKET_EVENT_NAME.RE_JOIN,
                    data: {
                        gameStatus: GAME_STATUS.WINNER,
                        message: "ok",
                        tableId,
                        userId,
                        table: findTable
                    },
                    socket
                }
                socket.join(findTable._id)
                sendToSocketIdEmmiter(data)
                logger.info(`END reJoin :::: ${JSON.stringify(data.data)}`)
                return;
            }

        }
    } catch (error) {
        logger.error(`CATCH_ERROR reJoin :::: ${error}`)
    }
}

export { reJoin }