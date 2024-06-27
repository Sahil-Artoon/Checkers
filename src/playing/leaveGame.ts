import { reStartQueue } from "../bull/Queue/reStartQueue"
import { cancleBotTimer } from "../bull/cancleQueue/cancleBotTimerQueue"
import { cancleLockTable } from "../bull/cancleQueue/cancleLockTable"
import { cancleRoundTimer } from "../bull/cancleQueue/cancleRoundTimer"
import { BULL_TIMER } from "../constant/bullTimer"
import { GAME_STATUS } from "../constant/gameStatus"
import { REDIS_EVENT_NAME } from "../constant/redisConstant"
import { SOCKET_EVENT_NAME } from "../constant/socketEventName"
import { sendToRoomEmmiter, sendToSocketIdEmmiter } from "../eventEmmitter"
import { logger } from "../logger"
import { redisDel, redisGet, redisSet } from "../redisOption"
import { leaveGameValidation } from "../validation/leaveGameValidation"

const leaveGame = async (data: any, socket: any) => {
    try {
        logger.info(`START leaveGame :::: DATA :::: ${JSON.stringify(data)}`)
        let checkData: any = await leaveGameValidation(data)
        if (checkData?.error) {
            data = {
                eventName: SOCKET_EVENT_NAME.POP_UP,
                data: {
                    message: checkData.error.details[0].message
                },
                socket
            }
            sendToSocketIdEmmiter(data)
            logger.info(`END joinTable :::: ${JSON.stringify(data.data)}`)
            return;
        }

        let { tableId, userId } = data

        let findTable: any = await redisGet(`${REDIS_EVENT_NAME.TABLE}:${tableId}`)
        findTable = JSON.parse(findTable)

        if (!findTable) {
            data = {
                eventName: SOCKET_EVENT_NAME.POP_UP,
                data: {
                    message: `Can't found table By tableId. ${tableId}`
                },
                socket
            }
            sendToSocketIdEmmiter(data)
            logger.info(`END joinTable :::: ${JSON.stringify(data.data)}`)
            return;
        }

        let findUser: any = await redisGet(`${REDIS_EVENT_NAME.USER}:${userId}`)
        findUser = JSON.parse(findUser)

        if (!findUser) {
            data = {
                eventName: SOCKET_EVENT_NAME.POP_UP,
                data: {
                    message: `Can't found User By _id. ${userId}`
                },
                socket
            }
            sendToSocketIdEmmiter(data)
            logger.info(`END joinTable :::: ${JSON.stringify(data.data)}`)
            return;
        }
        if (findTable.gameStatus != GAME_STATUS.LOCK_TABLE) {

            if (findTable.gameStatus == GAME_STATUS.WAITING) {
                if (findTable.playWithBot == true) {
                    let checkJob = await cancleBotTimer(findTable._id)
                    if (checkJob) {
                        findUser.tableId = ""
                        await redisDel(`${REDIS_EVENT_NAME.USER}:${userId}`)
                        await redisSet(`${REDIS_EVENT_NAME.USER}:${userId}`, findUser)
                        await redisDel(`${REDIS_EVENT_NAME.TABLE}:${findTable._id}`)
                        data = {
                            eventName: SOCKET_EVENT_NAME.LEAVE_GAME,
                            data: {
                                gameStatus: GAME_STATUS.WAITING,
                                userId,
                                message: "ok"
                            },
                            socket
                        }
                        logger.info(`END leaveGame gameStatus :::: WAITING Data :::: ${JSON.stringify(data.data)}`)
                        return sendToSocketIdEmmiter(data)
                    }
                }
                await redisDel(`${REDIS_EVENT_NAME.TABLE}:${tableId}`)
                findUser.tableId = ""
                await redisSet(`${REDIS_EVENT_NAME.USER}:${userId}`, findUser)
                let findQueue = await redisGet(`${REDIS_EVENT_NAME.QUEUE}`)
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
                data = {
                    eventName: SOCKET_EVENT_NAME.LEAVE_GAME,
                    data: {
                        gameStatus: GAME_STATUS.WAITING,
                        userId,
                        message: "ok"
                    },
                    socket
                }
                logger.info(`END leaveGame gameStatus :::: WAITING Data :::: ${JSON.stringify(data.data)}`)
                return sendToSocketIdEmmiter(data)
            }

            if (findTable.gameStatus === GAME_STATUS.ROUND_TIMER) {
                if (findTable.playWithBot == true) {
                    let checkLockTable = await cancleLockTable(tableId)
                    if (!checkLockTable) {
                        data = {
                            eventName: SOCKET_EVENT_NAME.POP_UP,
                            data: {
                                message: `Can't cancle LockTableQueue`
                            },
                            socket
                        }
                        sendToSocketIdEmmiter(data)
                        logger.info(`END joinTable :::: ${JSON.stringify(data.data)}`)
                        return;
                    }
                    let userOne: any = await redisGet(`${REDIS_EVENT_NAME.USER}:${findTable.playerInfo[0].userId}`)
                    userOne = JSON.parse(userOne)
                    if (userOne) {
                        if (userOne.isBot == true) {
                            await redisDel(`${REDIS_EVENT_NAME.USER}:${findTable.playerInfo[0].userId}`)
                        } else {
                            if (findTable._id == userOne.tableId) {
                                userOne.tableId = ""
                                await redisDel(`${REDIS_EVENT_NAME.USER}:${findTable.playerInfo[0].userId}`)
                                await redisSet(`${REDIS_EVENT_NAME.USER}:${findTable.playerInfo[0].userId}`, userOne)
                            }
                        }
                    }
                    let userTwo: any = await redisGet(`${REDIS_EVENT_NAME.USER}:${findTable.playerInfo[1].userId}`)
                    userTwo = JSON.parse(userTwo)
                    if (userTwo) {
                        if (userTwo.isBot == true) {
                            await redisDel(`${REDIS_EVENT_NAME.USER}:${findTable.playerInfo[1].userId}`)
                        } else {
                            if (findTable._id == userTwo.tableId) {
                                userTwo.tableId = ""
                                await redisDel(`${REDIS_EVENT_NAME.USER}:${findTable.playerInfo[1].userId}`)
                                await redisSet(`${REDIS_EVENT_NAME.USER}:${findTable.playerInfo[1].userId}`, userTwo)
                            }
                        }
                    }
                    data = {
                        eventName: SOCKET_EVENT_NAME.LEAVE_GAME,
                        data: {
                            _id: tableId,
                            gameStatus: GAME_STATUS.ROUND_TIMER,
                            userId,
                            message: "ok"
                        },
                        socket
                    }
                    sendToRoomEmmiter(data)
                    logger.info(`END leaveGame gameStatus :::: ROUND_TIMER Data :::: ${JSON.stringify(data.data)}`)
                    return;
                }
                if (findTable.playerInfo[0].userId == userId) {
                    findTable.playerInfo.pop()
                    console.log(findTable.playerInfo)
                    findTable.activePlayer = findTable.activePlayer - 1;
                    findTable.gameStatus = GAME_STATUS.WAITING
                    let checkRoundTimerJobDelete = await cancleRoundTimer(tableId)
                    if (checkRoundTimerJobDelete) {
                        let checkLockTable = await cancleLockTable(tableId)
                        if (checkLockTable) {
                            await cancleLockTable(tableId)
                            await redisSet(`${REDIS_EVENT_NAME.TABLE}:${tableId}`, findTable)
                            findUser.tableId = ""
                            let findQueue = await redisGet(`${REDIS_EVENT_NAME.QUEUE}`)
                            findQueue = JSON.parse(findQueue)
                            if (findQueue) {
                                findQueue.push(tableId)
                                await redisDel(`${REDIS_EVENT_NAME.QUEUE}`)
                                await redisSet(`${REDIS_EVENT_NAME.QUEUE}`, findQueue)
                            } else {
                                findQueue = [];
                                findQueue.push(tableId)
                                await redisSet(`${REDIS_EVENT_NAME.QUEUE}`, findQueue)
                            }
                            await redisSet(`${REDIS_EVENT_NAME.USER}:${userId}`, findUser)
                            data = {
                                eventName: SOCKET_EVENT_NAME.LEAVE_GAME,
                                data: {
                                    _id: tableId,
                                    gameStatus: GAME_STATUS.ROUND_TIMER,
                                    userId,
                                    message: "ok"
                                },
                                socket
                            }
                            sendToRoomEmmiter(data)
                            logger.info(`END leaveGame gameStatus :::: ROUND_TIMER Data :::: ${JSON.stringify(data.data)}`)
                            return;
                        }
                    }
                }
                if (findTable.playerInfo[1].userId == userId) {
                    findTable.playerInfo.pop()
                    console.log(findTable.playerInfo)
                    findTable.activePlayer = findTable.activePlayer - 1;
                    findTable.gameStatus = GAME_STATUS.WAITING
                    let checkRoundTimerJobDelete = await cancleRoundTimer(tableId)
                    if (checkRoundTimerJobDelete) {
                        let checkLockTable = await cancleLockTable(tableId)
                        if (checkLockTable) {
                            await cancleLockTable(tableId)
                            await redisSet(`${REDIS_EVENT_NAME.TABLE}:${tableId}`, findTable)
                            findUser.tableId = ""
                            let findQueue = await redisGet(`${REDIS_EVENT_NAME.QUEUE}`)
                            findQueue = JSON.parse(findQueue)
                            if (findQueue) {
                                findQueue.push(tableId)
                                await redisDel(`${REDIS_EVENT_NAME.QUEUE}`)
                                await redisSet(`${REDIS_EVENT_NAME.QUEUE}`, findQueue)
                            } else {
                                findQueue = [];
                                findQueue.push(tableId)
                                await redisSet(`${REDIS_EVENT_NAME.QUEUE}`, findQueue)
                            }
                            await redisSet(`${REDIS_EVENT_NAME.USER}:${userId}`, findUser)
                            data = {
                                eventName: SOCKET_EVENT_NAME.LEAVE_GAME,
                                data: {
                                    _id: tableId,
                                    gameStatus: GAME_STATUS.ROUND_TIMER,
                                    userId,
                                    message: "ok"
                                },
                                socket
                            }
                            sendToRoomEmmiter(data)
                            logger.info(`END leaveGame gameStatus :::: ROUND_TIMER Data :::: ${JSON.stringify(data.data)}`)
                            return;
                        }
                    }
                }
            }

            if (findTable.gameStatus == GAME_STATUS.PLAYING) {
                findTable.gameStatus = GAME_STATUS.WINNER
                findUser.tableId = ""
                await redisSet(`${REDIS_EVENT_NAME.USER}:${userId}`, findUser)
                if (findTable.playerInfo[0].userId == userId) {
                    findTable.winnerUserId = findTable.playerInfo[1].userId
                    await redisDel(`${REDIS_EVENT_NAME.TABLE}:${findTable._id}`)
                    await redisSet(`${REDIS_EVENT_NAME.TABLE}:${findTable._id}`, findTable)
                }
                if (findTable.playerInfo[1].userId == userId) {
                    findTable.winnerUserId = findTable.playerInfo[0].userId
                    await redisDel(`${REDIS_EVENT_NAME.TABLE}:${findTable._id}`)
                    await redisSet(`${REDIS_EVENT_NAME.TABLE}:${findTable._id}`, findTable)
                }
                data = {
                    eventName: SOCKET_EVENT_NAME.LEAVE_GAME,
                    data: {
                        _id: tableId,
                        message: "ok",
                        gameStatus: GAME_STATUS.PLAYING,
                        userId,
                    }
                }
                sendToRoomEmmiter(data)
                data = {
                    tableId,
                    timer: BULL_TIMER.RE_START
                }
                reStartQueue(data, socket)
                return;
            }
        }
    } catch (error) {
        logger.error(`CATCH_ERROR leaveGame :::: ${error}`)
    }
}

export { leaveGame }