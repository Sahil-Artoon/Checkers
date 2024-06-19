import { REDIS_EVENT_NAME } from "../constant/redisConstant"
import { logger } from "../logger"
import { move } from "../playing/move"
import { playGame } from "../playing/play"
import { redisGet } from "../redisOption"
import { checkBestPosition, checkBotPosition } from "./checkBotPosition"

const botPlay = async (data: any, socket: any) => {
    try {
        logger.info(`START botPlay :::: DATA :::: ${JSON.stringify(data)}`)
        let { tableId, userId, firstTurn } = data
        let findTable: any = await redisGet(`${REDIS_EVENT_NAME.TABLE}:${tableId}`)
        findTable = JSON.parse(findTable)
        if (findTable) {
            let findUser: any = await redisGet(`${REDIS_EVENT_NAME.USER}:${userId}`)
            findUser = JSON.parse(findUser)
            if (findUser) {
                if (firstTurn) {
                    data = {
                        userId: findUser._id,
                        userName: findUser.userName,
                        isBot: findUser.isBot,
                        tableId: findTable._id,
                        position: `D-19`
                    }
                    let result = await playGame(data, socket)
                    console.log("This is Results :::::::::", result)
                    if (result.sendPosition.length != 0) {
                        let data = {
                            userId: result.userId,
                            tableId: result.tableId,
                            movePosition: `D-${result.sendPosition[0].push}`,
                            movePiece: result.position,
                            dataOfPlay: result.sendPosition
                        }
                        move(data, socket)
                    }
                } else {
                    let checkPosition: any = await checkBotPosition(findTable)
                    console.log(":::::::::::::::::::::::::::::::::::::::::::::")
                    console.log("::::::: This is Check Position AT botPlay :::::::", checkPosition)
                    console.log(":::::::::::::::::::::::::::::::::::::::::::::")
                    if (checkPosition) {
                        let bestPosition = await checkBestPosition(findTable.tableData, checkPosition)
                        console.log("::::::::::::: This is BestPosition AT botPlay ::::::::::::: ", bestPosition)
                        if (bestPosition.length == 1) {
                            data = {
                                userId: findUser._id,
                                userName: findUser.userName,
                                isBot: findUser.isBot,
                                tableId: findTable._id,
                                position: `D-${bestPosition[0].position}`
                            }
                            let result = await playGame(data, socket)
                            console.log(":::::::::::::::::::::::::::::::::::::::::::::")
                            console.log(" ::::::::: This is Results ::::::::: ", result)
                            console.log(":::::::::::::::::::::::::::::::::::::::::::::")
                            if (result.sendPosition.length != 0) {
                                let data = {
                                    userId: result.userId,
                                    tableId: result.tableId,
                                    movePosition: `D-${result.sendPosition[0].push}`,
                                    movePiece: `D-19`,
                                    dataOfPlay: result.sendPosition
                                }
                                move(data, socket)
                            }
                        } else {
                            let result: any = null;
                            for (let i = 0; i < bestPosition.length; i++) {
                                if (bestPosition[i].check != 0) {
                                    data = {
                                        userId: findUser._id,
                                        userName: findUser.userName,
                                        isBot: findUser.isBot,
                                        tableId: findTable._id,
                                        position: `D-${bestPosition[i].position}`
                                    }
                                    result = await playGame(data, socket)
                                    console.log(":::::::::::::::::::::::::::::::::::::::::::::")
                                    console.log(" ::::::::: This is Results ::::::::: ", result)
                                    console.log(":::::::::::::::::::::::::::::::::::::::::::::")
                                    if (result.sendPosition.length != 0) {
                                        let data = {
                                            userId: result.userId,
                                            tableId: result.tableId,
                                            movePosition: `D-${result.sendPosition[0].push}`,
                                            movePiece: result.position,
                                            dataOfPlay: result.sendPosition
                                        }
                                        return move(data, socket)
                                    }
                                }
                            }
                            if (result == null) {
                                data = {
                                    userId: findUser._id,
                                    userName: findUser.userName,
                                    isBot: findUser.isBot,
                                    tableId: findTable._id,
                                    position: `D-${bestPosition[0].position}`
                                }
                                result = await playGame(data, socket)
                                console.log(":::::::::::::::::::::::::::::::::::::::::::::")
                                console.log(" ::::::::: This is Results ::::::::: ", result)
                                console.log(":::::::::::::::::::::::::::::::::::::::::::::")
                                if (result.sendPosition.length != 0) {
                                    let data = {
                                        userId: result.userId,
                                        tableId: result.tableId,
                                        movePosition: `D-${result.sendPosition[0].push}`,
                                        movePiece: result.position,
                                        dataOfPlay: result.sendPosition
                                    }
                                    return move(data, socket)
                                }
                            }
                        }
                    }
                }
            }

        }
    } catch (error) {
        logger.error(`CATCH_ERROR botPlay :::: ${error}`);
    }
}

export { botPlay }