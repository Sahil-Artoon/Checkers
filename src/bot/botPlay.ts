import { reStartQueue } from "../bull/Queue/reStartQueue"
import { BULL_TIMER } from "../constant/bullTimer"
import { GAME_STATUS } from "../constant/gameStatus"
import { REDIS_EVENT_NAME } from "../constant/redisConstant"
import { SOCKET_EVENT_NAME } from "../constant/socketEventName"
import { sendToRoomEmmiter } from "../eventEmmitter"
import { logger } from "../logger"
import { move } from "../playing/move"
import { playGame } from "../playing/play"
import { redisDel, redisGet, redisSet } from "../redisOption"
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
                            if (dataOfBestPosition) {
                                arrOfposition.push(dataOfBestPosition)
                            }
                        }
                        console.log(" ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ")
                        console.log(" ====== This is DataOfBestPosition ======", arrOfposition)
                        console.log(" ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ")
                        if (arrOfposition.length == 0) {
                            findTable.gameStatus = GAME_STATUS.TIE
                            findTable.winnerUserId = ''
                            await redisDel(`${REDIS_EVENT_NAME.TABLE}:${findTable._id}`)
                            await redisSet(`${REDIS_EVENT_NAME.TABLE}:${findTable._id}`, findTable)
                            data = {
                                eventName: SOCKET_EVENT_NAME.WINNER,
                                data: {
                                    _id: findTable._id,
                                    message: "ok",
                                    tie: true
                                }
                            }
                            sendToRoomEmmiter(data)
                            data = {
                                tableId: findTable._id,
                                timer: BULL_TIMER.RE_START
                            }
                            reStartQueue(data, socket)
                        }
                        if (arrOfposition) {
                            let arrOfBestPosition: any = [];
                            let arrOfNotGoodPosition: any = [];
                            for (let i = 0; i < arrOfposition.length; i++) {
                                if (arrOfposition[i].length == 1) {
                                    let checkData: any = await checkvalidPosition(arrOfposition[i][0], findTable.tableData)
                                    console.log("This is checkData ::::: ", checkData)
                                    if (checkData) {
                                        arrOfBestPosition.push(arrOfposition[i][0])
                                    } else {
                                        arrOfNotGoodPosition.push(arrOfposition[i][0])
                                    }
                                } else {
                                    let bestPosition = arrOfposition[i]
                                    for (let ele = 0; ele < bestPosition.length; ele++) {
                                        let checkData: any = await checkvalidPosition(bestPosition[ele], findTable.tableData)
                                        console.log("This is checkData ::::: ", checkData)
                                        if (checkData) {
                                            arrOfBestPosition.push(bestPosition[ele])
                                        } else {
                                            arrOfNotGoodPosition.push(bestPosition[ele])
                                        }
                                    };
                                }
                            };
                            console.log(" 777777777777777777777777777777777777777777777777777 ")
                            console.log(" !!!!!!!!! This is arrOfBestPosition  !!!!!!!!! ", arrOfBestPosition)
                            console.log(" !!!!!!!!! This is arrOfNotGoodPosition  !!!!!!!!! ", arrOfNotGoodPosition)
                            console.log(" 777777777777777777777777777777777777777777777777777 ")
                            if (arrOfBestPosition.length > 0) {
                                let checkKill = await arrOfBestPosition.findIndex((item: any) => item.check !== 0);
                                if (checkKill != -1) {
                                    console.log("Kill True inside CheckKill ::::", checkKill)
                                    let movePiece;
                                    if (
                                        findTable.tableData[arrOfBestPosition[checkKill].position - 1].pieceId.split('-')[0] == "R" ||
                                        findTable.tableData[arrOfBestPosition[checkKill].position - 1].pieceId.split('-')[0] == "B"
                                    ) {
                                        movePiece = `D-${arrOfBestPosition[checkKill].position}`
                                    } else if (findTable.tableData[arrOfBestPosition[checkKill].position - 1].pieceId == "R-king") {
                                        movePiece = `redKing-${arrOfBestPosition[checkKill].position}`
                                    } else if (findTable.tableData[arrOfBestPosition[checkKill].position - 1].pieceId == "B-king") {
                                        movePiece = `blackKing-${arrOfBestPosition[checkKill].position}`
                                    }
                                    let data = {
                                        userId: userId,
                                        tableId: tableId,
                                        movePosition: `D-${arrOfBestPosition[checkKill].push}`,
                                        movePiece,
                                        dataOfPlay: [arrOfBestPosition[checkKill]]
                                    }
                                    move(data, socket)
                                } else {
                                    console.log("Kill false inside CheckKill ::::", checkKill)
                                    let randomNumber = Math.floor(Math.random() * arrOfBestPosition.length)
                                    let movePiece;
                                    if (
                                        (findTable.tableData[arrOfBestPosition[randomNumber].position - 1].pieceId.split('-')[0] == "R" &&
                                            findTable.tableData[arrOfBestPosition[randomNumber].position - 1].pieceId.split('-')[1] != "king") ||
                                        (findTable.tableData[arrOfBestPosition[randomNumber].position - 1].pieceId.split('-')[0] == "B" &&
                                            findTable.tableData[arrOfBestPosition[randomNumber].position - 1].pieceId.split('-')[1] != "king")
                                    ) {
                                        console.log("move Piece inSide of R and B");
                                        movePiece = `D-${arrOfBestPosition[randomNumber].position}`
                                    } else if (findTable.tableData[arrOfBestPosition[randomNumber].position - 1].pieceId == "R-king") {
                                        movePiece = `redKing-${arrOfBestPosition[randomNumber].position}`
                                        console.log("move Piece inSide of R-King");
                                    } else if (findTable.tableData[arrOfBestPosition[randomNumber].position - 1].pieceId == "B-king") {
                                        movePiece = `blackKing-${arrOfBestPosition[randomNumber].position}`
                                        console.log("move Piece inSide of B-King");
                                    }
                                    console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                                    console.log("This is movePiece :::: ", movePiece)
                                    console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                                    let data = {
                                        userId: userId,
                                        tableId: tableId,
                                        movePosition: `D-${arrOfBestPosition[randomNumber].push}`,
                                        movePiece,
                                        dataOfPlay: [arrOfBestPosition[randomNumber]]
                                    }
                                    move(data, socket)
                                }
                            } else {
                                let checkKill = await arrOfNotGoodPosition.findIndex((item: any) => item.check !== 0);
                                if (checkKill != -1) {
                                    console.log("Kill True inside CheckKill ::::", checkKill)
                                    let movePiece;
                                    if (
                                        findTable.tableData[arrOfNotGoodPosition[checkKill].position - 1].pieceId.split('-')[0] == "R" ||
                                        findTable.tableData[arrOfNotGoodPosition[checkKill].position - 1].pieceId.split('-')[0] == "B"
                                    ) {
                                        movePiece = `D-${arrOfNotGoodPosition[checkKill].position}`
                                    } else if (findTable.tableData[arrOfNotGoodPosition[checkKill].position - 1].pieceId == "R-king") {
                                        movePiece = `redKing-${arrOfNotGoodPosition[checkKill].position}`
                                    } else if (findTable.tableData[arrOfNotGoodPosition[checkKill].position - 1].pieceId == "B-king") {
                                        movePiece = `blackKing-${arrOfNotGoodPosition[checkKill].position}`
                                    }
                                    let data = {
                                        userId: userId,
                                        tableId: tableId,
                                        movePosition: `D-${arrOfNotGoodPosition[checkKill].push}`,
                                        movePiece,
                                        dataOfPlay: [arrOfNotGoodPosition[checkKill]]
                                    }
                                    move(data, socket)
                                }
                                let randomNumber = Math.floor(Math.random() * arrOfNotGoodPosition.length)
                                let movePiece;
                                if (
                                    (findTable.tableData[arrOfNotGoodPosition[randomNumber].position - 1].pieceId.split('-')[0] == "R" &&
                                        findTable.tableData[arrOfNotGoodPosition[randomNumber].position - 1].pieceId.split('-')[1] != "king") ||
                                    (findTable.tableData[arrOfNotGoodPosition[randomNumber].position - 1].pieceId.split('-')[0] == "B" &&
                                        findTable.tableData[arrOfNotGoodPosition[randomNumber].position - 1].pieceId.split('-')[1] != "king")
                                ) {
                                    console.log("move Piece inSide of R and B");
                                    movePiece = `D-${arrOfNotGoodPosition[randomNumber].position}`
                                } else if (findTable.tableData[arrOfNotGoodPosition[randomNumber].position - 1].pieceId == "R-king") {
                                    movePiece = `redKing-${arrOfNotGoodPosition[randomNumber].position}`
                                    console.log("move Piece inSide of R-King");
                                } else if (findTable.tableData[arrOfNotGoodPosition[randomNumber].position - 1].pieceId == "B-king") {
                                    movePiece = `blackKing-${arrOfNotGoodPosition[randomNumber].position}`
                                    console.log("move Piece inSide of B-King");
                                }
                                console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                                console.log("This is movePiece :::: ", movePiece)
                                console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                                let data = {
                                    userId: userId,
                                    tableId: tableId,
                                    movePosition: `D-${arrOfNotGoodPosition[randomNumber].push}`,
                                    movePiece,
                                    dataOfPlay: [arrOfNotGoodPosition[randomNumber]]
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