import { REDIS_EVENT_NAME } from "../constant/redisConstant"
import { SOCKET_EVENT_NAME } from "../constant/socketEventName"
import { sendToRoomEmmiter, sendToSocketIdEmmiter } from "../eventEmmitter"
import { logger } from "../logger"
import { redisDel, redisGet, redisSet } from "../redisOption"
import { moveValidation } from "../validation/moveValidation"
import { changeTurn } from "./changeTurn"
import { checkKing } from "./checkKing"

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
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        console.log(`movePiece :::: ${movePiece}`)
        console.log(`tableId :::: ${tableId}`)
        console.log(`movePosition :::: ${movePosition}`)
        console.log(`userId :::: ${userId}`)
        console.log("dataOfPlay :::: ", dataOfPlay)
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

        let parts = movePiece.split("-");
        let numberOfBoxWhoShift = parts[1];

        let part = movePosition.split("-");
        let numberOfShiftBox = part[1];


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
                if (dataOfPlay[i].check != 0 && numberOfShiftBox == dataOfPlay[i].push) {
                    findTable.tableData[dataOfPlay[i].check - 1].pieceId = null
                    removePiece = dataOfPlay[i].check
                    let checkColor: string = findTable.playerInfo[findTable.currentTurnSeatIndex].color
                    if (checkColor == 'red') {
                        findTable.blackTotalLose = findTable.blackTotalLose + 1
                    }
                    else if (checkColor == 'black') {
                        findTable.redTotalLose = findTable.redTotalLose + 1
                    }
                }
            }
            console.log("findTable", findTable.tableData)
            let pieceId = findTable.tableData[numberOfBoxWhoShift - 1].pieceId
            console.log("pieceId", pieceId)
            console.log("findTable.tableData[numberOfBoxWhoShift - 1] :::: ", findTable.tableData[numberOfBoxWhoShift - 1])
            console.log("findTable.tableData[numberOfShiftBox - 1] :::: ", findTable.tableData[numberOfShiftBox - 1])
            findTable.tableData[numberOfBoxWhoShift - 1].pieceId = null
            findTable.tableData[numberOfShiftBox - 1].pieceId = pieceId
            console.log("findTable.tableData[numberOfBoxWhoShift - 1] :::: ", findTable.tableData[numberOfBoxWhoShift - 1])
            console.log("findTable.tableData[numberOfShiftBox - 1] :::: ", findTable.tableData[numberOfShiftBox - 1])
            console.log(":::::::::::::::::::::::::::::::::::::::::")
            console.log("findTable of TableData", findTable.tableData)
            console.log(":::::::::::::::::::::::::::::::::::::::::")

            await redisDel(`${REDIS_EVENT_NAME.TABLE}:${tableId}`)
            await redisSet(`${REDIS_EVENT_NAME.TABLE}:${tableId}`, findTable)
            findTable = await redisGet(`${REDIS_EVENT_NAME.TABLE}:${tableId}`)
            findTable = JSON.parse(findTable)
            console.log(findTable)
            data = {
                eventName: SOCKET_EVENT_NAME.MOVE,
                data: {
                    _id: findTable?._id,
                    emptyBoxId: movePiece,
                    addBoxId: movePosition,
                    message: "ok",
                    removePiece
                }
            }
            sendToRoomEmmiter(data)
            let checkKingOrNot: any = await checkKing(findTable)
            if (checkKingOrNot) {
                logger.info(`checkKingOrNot ::::: ${JSON.stringify(checkKingOrNot)}`)
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
            changeTurn(findTable._id, socket)
        }
    } catch (error) {
        logger.error(`CATCH_ERROR move :::: ${error}`)
    }
}
export { move }