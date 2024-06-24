import { reStartQueue } from "../bull/Queue/reStartQueue"
import { BULL_TIMER } from "../constant/bullTimer"
import { GAME_STATUS } from "../constant/gameStatus"
import { REDIS_EVENT_NAME } from "../constant/redisConstant"
import { SOCKET_EVENT_NAME } from "../constant/socketEventName"
import { sendToRoomEmmiter, sendToSocketIdEmmiter } from "../eventEmmitter"
import { logger } from "../logger"
import { redisDel, redisGet, redisSet } from "../redisOption"
import { moveValidation } from "../validation/moveValidation"
import { changeTurn } from "./changeTurn"
import { checkKing } from "./checkKing"
import { checkWinner } from "./checkWinner"

const move = async (data: any, socket: any) => {
    try {
        logger.info(`START move :::: DATA :::: ${JSON.stringify(data)}`)
        let checkData: any = await moveValidation(data)
        if (checkData?.error) {
            data = {
                eventName: SOCKET_EVENT_NAME.POP_UP,
                data: {
                    message: checkData.error.details[0].message
                },
                socket
            }
            sendToSocketIdEmmiter(data)
            logger.error(`END move :::: ${JSON.stringify(data.data.message)}`)
            return;
        }
        let { movePiece, tableId, movePosition, userId, dataOfPlay } = data
        console.log(`movePiece :::: ${movePiece}`)
        console.log(`tableId :::: ${tableId}`)
        console.log(`movePosition :::: ${movePosition}`)
        console.log(`userId :::: ${userId}`)
        console.log("dataOfPlay :::: ", dataOfPlay)

        let parts = movePiece.split("-");
        let movePieceBox = parts[1];

        let part = movePosition.split("-");
        let moviePositionBox = part[1];


        let findTable: any = await redisGet(`${REDIS_EVENT_NAME.TABLE}:${tableId}`)
        findTable = JSON.parse(findTable)

        if (!findTable) {
            data = {
                eventName: SOCKET_EVENT_NAME.POP_UP,
                data: {
                    message: `Can't found Table By tableId. ${tableId}`
                },
                socket
            }
            sendToSocketIdEmmiter(data)
            logger.info(`END joinTable :::: ${JSON.stringify(data.data)}`)
            return;
        }

        if (findTable) {
            let removePiece: any = null
            for (let i = 0; i < dataOfPlay.length; i++) {
                if (dataOfPlay[i].check != 0 && moviePositionBox == dataOfPlay[i].push) {
                    findTable.tableData[dataOfPlay[i].check - 1].pieceId = null
                    removePiece = dataOfPlay[i].check
                    let checkColor: string = findTable.playerInfo[findTable.currentTurnSeatIndex].color
                    if (checkColor == 'red') {
                        findTable.blackTotalLose = findTable.blackTotalLose + 1
                    }
                    else if (checkColor == 'black') {
                        findTable.redTotalLose = findTable.redTotalLose + 1
                    } else if (checkColor == 'redKing') {
                        findTable.redTotalLose = findTable.redTotalLose + 1
                    } else if (checkColor == 'blackKing') {
                        findTable.blackTotalLose = findTable.blackTotalLose + 1
                    }
                }
            }
            console.log("dataOfplay.length === :::: ", dataOfPlay.length)
            for (let i = 0; i < dataOfPlay.length; i++) {
                console.log(`This is ${dataOfPlay[i]} And Push Is :::: ${dataOfPlay[i].push} `)
                if (dataOfPlay[i].push == moviePositionBox) {
                    console.log("This is Inside of dataOfPlay[i].push :::: ", dataOfPlay[i].push, "and moviePositonBox is :::: ", moviePositionBox)
                    let pieceId = findTable.tableData[movePieceBox - 1].pieceId
                    findTable.tableData[movePieceBox - 1].pieceId = null
                    findTable.tableData[moviePositionBox - 1].pieceId = pieceId
                    await redisDel(`${REDIS_EVENT_NAME.TABLE}:${tableId}`)
                    await redisSet(`${REDIS_EVENT_NAME.TABLE}:${tableId}`, findTable)
                    findTable = await redisGet(`${REDIS_EVENT_NAME.TABLE}:${tableId}`)
                    findTable = JSON.parse(findTable)
                    data = {
                        eventName: SOCKET_EVENT_NAME.MOVE,
                        data: {
                            _id: findTable?._id,
                            emptyBoxId: movePiece,
                            addBoxId: movePosition,
                            message: "ok",
                            removePiece,
                            redTotalKill:findTable.redTotalLose,
                            blackTotalKill:findTable.blackTotalLose
                        }
                    }
                    sendToRoomEmmiter(data)
                    let checkKingOrNot: any = await checkKing(findTable)
                    if (checkKingOrNot) {
                        logger.info(`checkKingOrNot ::::: ${JSON.stringify(checkKingOrNot)}`)
                        if (checkKingOrNot.colorOfKing == "red") {
                            findTable.tableData[checkKingOrNot.numberOfBox - 1].pieceId = 'R-king'
                        }
                        if (checkKingOrNot.colorOfKing == 'black') {
                            findTable.tableData[checkKingOrNot.numberOfBox - 1].pieceId = 'B-king'
                        }
                        await redisDel(`${REDIS_EVENT_NAME.TABLE}:${findTable._id}`)
                        await redisSet(`${REDIS_EVENT_NAME.TABLE}:${findTable._id}`, findTable)
                        data = {
                            eventName: SOCKET_EVENT_NAME.KING,
                            data: {
                                _id: findTable._id,
                                numberOfBox: checkKingOrNot.numberOfBox,
                                pieceId: checkKingOrNot.pieceId,
                                colorOfKing: checkKingOrNot.colorOfKing,
                                message: "ok"
                            }
                        }
                        sendToRoomEmmiter(data)
                    }
                    let checkWinnerOrNot = await checkWinner(findTable._id)
                    console.log(`This is checkWinnerOrNot :::: `, checkWinnerOrNot)
                    if (checkWinnerOrNot == 0) {
                        data = {
                            tableId: findTable._id,
                            lastMove: moviePositionBox
                        }
                        return changeTurn(data, socket)
                    } else {
                        findTable.gameStatus = GAME_STATUS.WINNER
                        findTable.winnerUserId = checkWinnerOrNot
                        await redisDel(`${REDIS_EVENT_NAME.TABLE}:${findTable._id}`)
                        await redisSet(`${REDIS_EVENT_NAME.TABLE}:${findTable._id}`, findTable)
                        data = {
                            eventName: SOCKET_EVENT_NAME.WINNER,
                            data: {
                                _id: findTable._id,
                                message: "ok",
                                userId: checkWinnerOrNot
                            }
                        }
                        sendToRoomEmmiter(data)
                        data = {
                            tableId: findTable._id,
                            timer: BULL_TIMER.RE_START
                        }
                        reStartQueue(data, socket)
                    }
                }
            }
        }
    } catch (error) {
        logger.error(`CATCH_ERROR move :::: ${error}`)
    }
}
export { move }