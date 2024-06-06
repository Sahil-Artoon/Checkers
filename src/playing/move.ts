import { REDIS_EVENT_NAME } from "../constant/redisConstant"
import { SOCKET_EVENT_NAME } from "../constant/socketEventName"
import { sendToRoomEmmiter, sendToSocketIdEmmiter } from "../eventEmmitter"
import { logger } from "../logger"
import { redisDel, redisGet, redisSet } from "../redisOption"
import { moveValidation } from "../validation/moveValidation"
import { changeTurn } from "./changeTurn"

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
        let { movePiece, tableId, movePosition, userId } = data
        console.log(`movePiece :::: ${movePiece}`)
        console.log(`tableId :::: ${tableId}`)
        console.log(`movePosition :::: ${movePosition}`)
        console.log(`userId :::: ${userId}`)

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
                }
            }
            sendToRoomEmmiter(data)
            changeTurn(findTable._id, socket)
        }
    } catch (error) {
        logger.error(`CATCH_ERROR move :::: ${error}`)
    }
}
export { move }