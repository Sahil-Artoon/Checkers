import { joinBotQueue } from "../bull/Queue/joinBotQueue"
import { lockTableQueue } from "../bull/Queue/lockTableQueue"
import { roundTimerQueue } from "../bull/Queue/roundTimerQueue"
import { generateId } from "../common/generateId"
import { BULL_TIMER } from "../constant/bullTimer"
import { GAME_STATUS } from "../constant/gameStatus"
import { REDIS_EVENT_NAME } from "../constant/redisConstant"
import { SOCKET_EVENT_NAME } from "../constant/socketEventName"
import { sendToRoomEmmiter, sendToSocketIdEmmiter } from "../eventEmmitter"
import { logger } from "../logger"
import { redisDel, redisGet, redisSet } from "../redisOption"
import { joinTableValidation } from "../validation/joinTableValidation"

const joinTable = async (data: any, socket: any) => {
    try {
        logger.info(`START joinTable :::: DATA :::: ${JSON.stringify(data)}`)
        let checkData: any = await joinTableValidation(data)
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

        let { _id, userName, isBot, playWithBot } = data

        let findUser: any = await redisGet(`${REDIS_EVENT_NAME.USER}:${_id}`)
        findUser = JSON.parse(findUser)

        if (!findUser) {
            data = {
                eventName: SOCKET_EVENT_NAME.POP_UP,
                data: {
                    message: `Can't found User By _id. ${_id}`
                },
                socket
            }
            sendToSocketIdEmmiter(data)
            logger.info(`END joinTable :::: ${JSON.stringify(data.data)}`)
            return;
        }

        if (findUser) {
            if (findUser.tableId != "") {
                data = {
                    eventName: SOCKET_EVENT_NAME.POP_UP,
                    data: {
                        message: `User already Play.`
                    },
                    socket
                }
                sendToSocketIdEmmiter(data)
                logger.info(`END joinTable :::: ${JSON.stringify(data.data)}`)
                return;
            }
        }

        if (data?.tableId) {
            console.log(":::::::::::::::::::::::::::::::")
            console.log("Inside Table Id ")
            console.log(":::::::::::::::::::::::::::::::")
            let findTable: any = await redisGet(`${REDIS_EVENT_NAME.TABLE}:${data?.tableId}`)
            findTable = JSON.parse(findTable)
            if (findTable) {
                findTable.playerInfo.push({
                    userId: _id,
                    userName,
                    isBot,
                    isActive: true,
                    color: 'black'
                })
                findTable.activePlayer = findTable.activePlayer + 1;
                findTable.gameStatus = GAME_STATUS.ROUND_TIMER;
                await redisDel(`${REDIS_EVENT_NAME.TABLE}: ${findTable._id}`)
                await redisSet(`${REDIS_EVENT_NAME.TABLE}:${findTable._id}`, findTable)
                findTable = await redisGet(`${REDIS_EVENT_NAME.TABLE}:${findTable._id}`)
                findTable = JSON.parse(findTable)
                let findUser: any = await redisGet(`${REDIS_EVENT_NAME.USER}:${_id}`)
                findUser = JSON.parse(findUser)
                if (findUser) {
                    findUser.tableId = findTable._id
                }
                await redisDel(`${REDIS_EVENT_NAME.USER}:${_id}`)
                await redisSet(`${REDIS_EVENT_NAME.USER}:${_id}`, findUser)
                data = {
                    eventName: SOCKET_EVENT_NAME.ROUND_TIMER,
                    data: {
                        _id: findTable._id,
                        message: "ok",
                        timer: BULL_TIMER.ROUND_TIMER
                    }
                }
                sendToRoomEmmiter(data)
                data = {
                    tableId: findTable._id,
                    timer: BULL_TIMER.ROUND_TIMER,
                }
                roundTimerQueue(data, socket)
                data = {
                    tableId: findTable._id,
                    timer: BULL_TIMER.LOCK_TABLE
                }
                lockTableQueue(data, socket)
            }
        } else {
            let findtableByQueue: any = await redisGet(REDIS_EVENT_NAME.QUEUE)
            findtableByQueue = JSON.parse(findtableByQueue)
            if (playWithBot == true)
                findtableByQueue = false
            if (findtableByQueue) {
                console.log("FINDTABLEBYQUEUE :::: ", findtableByQueue)
                let idOfTable: any;
                if (findtableByQueue.length == 1) {
                    idOfTable = findtableByQueue[0]
                    await redisDel(REDIS_EVENT_NAME.QUEUE)
                } else {
                    idOfTable = findtableByQueue[findtableByQueue.length - 1];
                    await redisDel(REDIS_EVENT_NAME.QUEUE)
                    findtableByQueue.pop()
                    await redisSet(REDIS_EVENT_NAME.QUEUE, findtableByQueue)
                }
                let findTable: any = await redisGet(`${REDIS_EVENT_NAME.TABLE}:${idOfTable}`)
                findTable = JSON.parse(findTable)
                if (findTable) {
                    let color: any;
                    if (findTable.playerInfo[0].color == "red") {
                        color = "black"
                    } else {
                        color = "red"
                    }
                    findTable.playerInfo.push({
                        userId: _id,
                        userName,
                        isBot,
                        isActive: true,
                        color
                    })
                    findTable.activePlayer = findTable.activePlayer + 1;
                    findTable.gameStatus = GAME_STATUS.ROUND_TIMER;
                    await redisDel(`${REDIS_EVENT_NAME.TABLE}: ${findTable._id}`)
                    await redisSet(`${REDIS_EVENT_NAME.TABLE}:${findTable._id}`, findTable)
                    findTable = await redisGet(`${REDIS_EVENT_NAME.TABLE}:${findTable._id}`)
                    findTable = JSON.parse(findTable)
                    let findUser: any = await redisGet(`${REDIS_EVENT_NAME.USER}:${_id}`)
                    findUser = JSON.parse(findUser)
                    if (findUser) {
                        findUser.tableId = findTable._id
                    }
                    await redisDel(`${REDIS_EVENT_NAME.USER}:${_id}`)
                    await redisSet(`${REDIS_EVENT_NAME.USER}:${_id}`, findUser)
                    if (isBot == false) {
                        socket.join(findTable._id)
                        data = {
                            eventName: SOCKET_EVENT_NAME.JOIN_TABLE,
                            data: {
                                tableId: findTable._id,
                                playerData: findTable.playerInfo,
                                tableData: findTable.tableData,
                                message: "ok"
                            },
                            socket
                        }
                        sendToSocketIdEmmiter(data)
                    }
                    data = {
                        eventName: SOCKET_EVENT_NAME.ROUND_TIMER,
                        data: {
                            _id: findTable._id,
                            message: "ok",
                            timer: BULL_TIMER.ROUND_TIMER
                        }
                    }
                    sendToRoomEmmiter(data)
                    data = {
                        tableId: findTable._id,
                        timer: BULL_TIMER.ROUND_TIMER,
                    }
                    roundTimerQueue(data, socket)
                    data = {
                        tableId: findTable._id,
                        timer: BULL_TIMER.LOCK_TABLE
                    }
                    lockTableQueue(data, socket)
                }
            } else {
                let generateTableId: any = await generateId()
                data = {
                    _id: generateTableId,
                    playerInfo: [{
                        userId: _id,
                        userName,
                        isBot,
                        isActive: true,
                        color: 'red'
                    }],
                    tableData: [
                        {
                            pieceId: 'B-1',
                            place: 1
                        },
                        { place: 2 },
                        {
                            pieceId: 'B-2',
                            place: 3
                        },
                        { place: 4 },
                        {
                            pieceId: 'B-3',
                            place: 5
                        },
                        { place: 6 },
                        {
                            pieceId: 'B-4',
                            place: 7
                        },
                        { place: 8 },
                        { place: 9 },
                        {
                            pieceId: 'B-5',
                            place: 10
                        },
                        { place: 11 },
                        {
                            pieceId: 'B-6',
                            place: 12
                        },
                        { place: 13 },
                        {
                            pieceId: 'B-7',
                            place: 14
                        },
                        { place: 15 },
                        {
                            pieceId: 'B-8',
                            place: 16
                        },
                        {
                            pieceId: 'B-9',
                            place: 17
                        },
                        { place: 18 },
                        {
                            pieceId: 'B-10',
                            place: 19
                        },
                        { place: 20 },
                        {
                            pieceId: 'B-11',
                            place: 21
                        },
                        { place: 22 },
                        {
                            pieceId: 'B-12',
                            place: 23
                        },
                        { place: 24 },
                        { place: 25 },
                        {
                            place: 26,
                            pieceId: null
                        },
                        { place: 27 },
                        {
                            place: 28,
                            pieceId: null
                        },
                        { place: 29 },
                        {
                            place: 30,
                            pieceId: null
                        },
                        { place: 31 },
                        {
                            place: 32,
                            pieceId: null
                        },
                        {
                            place: 33,
                            pieceId: null
                        },
                        { place: 34 },
                        {
                            place: 35,
                            pieceId: null
                        },
                        { place: 36 },
                        {
                            place: 37,
                            pieceId: null
                        },
                        { place: 38 },
                        {
                            place: 39,
                            pieceId: null
                        },
                        { place: 40 },
                        { place: 41 },
                        {
                            pieceId: 'R-1',
                            place: 42
                        },
                        { place: 43 },
                        {
                            pieceId: "R-2",
                            place: 44
                        },
                        { place: 45 },
                        {
                            pieceId: "R-3",
                            place: 46
                        },
                        { place: 47 },
                        {
                            pieceId: "R-4",
                            place: 48
                        },
                        {
                            pieceId: "R-5",
                            place: 49
                        },
                        { place: 50 },
                        {
                            pieceId: "R-6",
                            place: 51
                        },
                        { place: 52 },
                        {
                            pieceId: "R-7",
                            place: 53
                        },
                        { place: 54 },
                        {
                            pieceId: "R-8",
                            place: 55
                        },
                        { place: 56 },
                        { place: 57 },
                        {
                            pieceId: "R-9",
                            place: 58
                        },
                        { place: 59 },
                        {
                            pieceId: "R-10",
                            place: 60
                        },
                        { place: 61 },
                        {
                            pieceId: "R-11",
                            place: 62
                        },
                        { place: 63 },
                        {
                            pieceId: "R-12",
                            place: 64
                        }
                    ],
                    playWithBot: playWithBot,
                    activePlayer: 1,
                    currentTurnSeatIndex: null,
                    winnerSeatIndex: null,
                    redTotalLose: 11,
                    blackTotalLose: 0,
                    gameStatus: GAME_STATUS.WAITING
                }
                await redisSet(`${REDIS_EVENT_NAME.TABLE}:${generateTableId}`, data)
                let findTable: any = await redisGet(`${REDIS_EVENT_NAME.TABLE}:${generateTableId}`)
                findTable = JSON.parse(findTable)
                if (!findTable) {
                    data = {
                        eventName: SOCKET_EVENT_NAME.POP_UP,
                        data: {
                            message: `Can't found Table By generateTableId.`
                        },
                        socket
                    }
                    sendToSocketIdEmmiter(data)
                    logger.info(`END joinTable :::: ${JSON.stringify(data.data)}`)
                    return;
                }
                let findUser: any = await redisGet(`${REDIS_EVENT_NAME.USER}:${_id}`)
                findUser = JSON.parse(findUser)
                if (findUser) {
                    findUser.tableId = findTable._id
                }
                await redisDel(`${REDIS_EVENT_NAME.USER}:${_id}`)
                await redisSet(`${REDIS_EVENT_NAME.USER}:${_id}`, findUser)
                let queue: any = await redisGet(REDIS_EVENT_NAME.QUEUE)
                queue = JSON.parse(queue)
                if (playWithBot == false) {
                    if (queue) {
                        await redisDel(`${REDIS_EVENT_NAME.QUEUE}`)
                        queue.push(findTable._id)
                        await redisSet(`${REDIS_EVENT_NAME.QUEUE}`, queue)
                    } else {
                        data = [findTable._id]
                        await redisSet(`${REDIS_EVENT_NAME.QUEUE}`, data)
                    }
                }
                socket.join(findTable._id)
                data = {
                    eventName: SOCKET_EVENT_NAME.JOIN_TABLE,
                    data: {
                        tableId: findTable._id,
                        playerData: findTable.playerInfo,
                        tableData: findTable.tableData,
                        message: "ok"
                    },
                    socket
                }
                sendToSocketIdEmmiter(data)
                if (playWithBot == true) {
                    data = {
                        tableId: findTable._id,
                        timer: BULL_TIMER.JOIN_BOT_TIMER
                    }
                    joinBotQueue(data, socket)
                    logger.info(`END joinTable :::: ${JSON.stringify(data)}`)
                    return;
                }
                logger.info(`END joinTable :::: ${JSON.stringify(data.data)}`)
                return;
            }
        }
    } catch (error) {
        logger.error(`CATCH_ERROR joinTable :::: ${error}`)
    }
}

export { joinTable }