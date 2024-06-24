import { REDIS_EVENT_NAME } from "../constant/redisConstant"
import { logger } from "../logger"
import { move } from "../playing/move"
import { playGame } from "../playing/play"
import { redisGet } from "../redisOption"
import { checkBestPosition, checkPosition, checkvalidPosition } from "./checkBotPosition"

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
                    let position: any = await checkPosition(findTable)
                    console.log(":::::::::::::::::::::::::::::::::::::::::::::")
                    console.log("::::::: This is Check Position AT botPlay :::::::", position)
                    console.log(":::::::::::::::::::::::::::::::::::::::::::::")
                    if (position) {
                        let arrOfposition = [];
                        for (let i = 0; i < position.length; i++) {
                            let dataOfBestPosition: any = await checkBestPosition(findTable.tableData, position[i])
                            if (dataOfBestPosition.length > 0) {
                                arrOfposition.push(dataOfBestPosition)
                            }
                        }
                        console.log(" ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ")
                        console.log(" ====== This is DataOfBestPosition ======", arrOfposition)
                        console.log(" ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ")

                        if (arrOfposition) {
                            let arrOfBestPosition: any = []
                            for (let i = 0; i < arrOfposition.length; i++) {
                                if (arrOfposition[i].length == 1) {
                                    let checkData: any = await checkvalidPosition(arrOfposition[i][0], findTable.tableData)
                                    console.log("This is checkData ::::: ", checkData)
                                    if (checkData.isBestPosition) {
                                        arrOfposition[i][0].isBest = true
                                        arrOfBestPosition.push(arrOfposition[i][0])
                                    } else if (checkData.validPosition) {
                                        arrOfposition[i][0].isBest = false
                                        arrOfBestPosition.push(arrOfposition[i][0])
                                    }
                                } else {
                                    let bestPosition = arrOfposition[i]
                                    for (let ele = 0; ele < bestPosition.length; ele++) {
                                        let checkData: any = await checkvalidPosition(bestPosition[ele], findTable.tableData)
                                        console.log("This is checkData ::::: ", checkData)
                                        if (checkData.isBestPosition) {
                                            bestPosition[ele].isBest = true
                                            arrOfBestPosition.push(bestPosition[ele])
                                        } else if (checkData.validPosition == true) {
                                            bestPosition[ele].isBest = false
                                            arrOfBestPosition.push(bestPosition[ele])
                                        }
                                    };
                                }
                            };
                            console.log(" 777777777777777777777777777777777777777777777777777 ")
                            console.log(" !!!!!!!!! This is arrOfBestPosition  !!!!!!!!! ", arrOfBestPosition)
                            console.log(" 777777777777777777777777777777777777777777777777777 ")

                            let checkKill = await arrOfBestPosition.findIndex((item: any) => item.check !== 0);
                            if (checkKill != -1) {
                                console.log("Kill True inside CheckKill ::::", checkKill)
                                let data = {
                                    userId: userId,
                                    tableId: tableId,
                                    movePosition: `D-${arrOfBestPosition[checkKill].push}`,
                                    movePiece: `D-${arrOfBestPosition[checkKill].position}`,
                                    dataOfPlay: [arrOfBestPosition[checkKill]]
                                }
                                move(data, socket)
                            } else {
                                console.log("Kill false inside CheckKill ::::", checkKill)
                                let data = {
                                    userId: userId,
                                    tableId: tableId,
                                    movePosition: `D-${arrOfBestPosition[0].push}`,
                                    movePiece: `D-${arrOfBestPosition[0].position}`,
                                    dataOfPlay: [arrOfBestPosition[0]]
                                }
                                move(data, socket)
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