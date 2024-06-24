import { REDIS_EVENT_NAME } from "../constant/redisConstant"
import { SOCKET_EVENT_NAME } from "../constant/socketEventName"
import { sendToRoomEmmiter, sendToSocketIdEmmiter } from "../eventEmmitter"
import { logger } from "../logger"
import { redisGet } from "../redisOption"
import { playGameValidation } from "../validation/playGameValidation"
import { checkPosition } from "./checkPosition"

const playGame = async (data: any, socket: any) => {
    try {
        logger.info(`START playGame :::: ${JSON.stringify(data)}`)
        let checkData: any = await playGameValidation(data)
        if (checkData?.error) {
            data = {
                eventName: SOCKET_EVENT_NAME.POP_UP,
                data: {
                    message: checkData.error.details[0].message
                },
                socket
            }
            sendToSocketIdEmmiter(data)
            logger.info(`END playGame :::: ${JSON.stringify(data.data)}`)
            return;
        }

        let { userId, userName, isBot, position, tableId } = data

        let findUser: any = await redisGet(`${REDIS_EVENT_NAME.USER}:${userId}`)
        findUser = JSON.parse(findUser)

        if (!findUser) {
            data = {
                eventName: SOCKET_EVENT_NAME.POP_UP,
                data: {
                    message: `Can't found User By userId. ${userId}`
                },
                socket
            }
            sendToSocketIdEmmiter(data)
            logger.info(`END joinTable :::: ${JSON.stringify(data.data)}`)
            return;
        }

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
        if (findTable.currentTurnUserId == userId) {
            let color;
            let parts = position.split("-");
            let numberOfBox = parts[1];

            if (findTable.tableData[numberOfBox - 1].pieceId.split('-')[0] == "R" && findTable.tableData[numberOfBox - 1].pieceId.split('-')[1] != "king") {
                color = 'red'
            } else if (findTable.tableData[numberOfBox - 1].pieceId.split('-')[0] == "B" && findTable.tableData[numberOfBox - 1].pieceId.split('-')[0] != "king") {
                color = "black"
            } else if (findTable.tableData[numberOfBox - 1].pieceId.split('-')[0] == "R" && findTable.tableData[numberOfBox - 1].pieceId.split('-')[1] == "king") {
                color = "redKing"
            }
            else if (findTable.tableData[numberOfBox - 1].pieceId.split('-')[0] == "B" && findTable.tableData[numberOfBox - 1].pieceId.split('-')[1] == "king") {
                color = "blackKing"
            }
            console.log("This is NumberOfBox :::", numberOfBox)
            let place = findTable.tableData
            if (isBot == false) {
                let sendPosition: any = await checkPosition(numberOfBox, place, color, isBot)
                console.log("This is SendPosition :::", sendPosition)
                if (sendPosition) {
                    data = {
                        eventName: SOCKET_EVENT_NAME.SEND_PLACE,
                        data: {
                            _id: tableId,
                            tableId,
                            userId,
                            userName,
                            isBot,
                            position,
                            sendPosition,
                            message: "ok"
                        }
                    }
                    sendToRoomEmmiter(data)
                } else {
                    logger.error("sendPositon :::: Empty :::: !!!")
                }
            }
            if (isBot == true) {
                let sendPosition: any = await checkPosition(numberOfBox, place, color, isBot)
                console.log("This is SendPosition :::", sendPosition)
                if (sendPosition) {
                    data = {
                        _id: tableId,
                        tableId,
                        userId,
                        userName,
                        isBot,
                        position,
                        sendPosition,
                        message: "ok"
                    }
                    return data
                } else {
                    logger.error("sendPositon :::: Empty :::: !!!")
                }
            }

        }
    } catch (error) {
        logger.error(`CATCH_ERROR playGame :::: ${error}`)
    }
}
export { playGame }