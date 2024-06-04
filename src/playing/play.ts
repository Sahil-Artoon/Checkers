import { REDIS_EVENT_NAME } from "../constant/redisConstant"
import { SOCKET_EVENT_NAME } from "../constant/socketEventName"
import { sendToSocketIdEmmiter } from "../eventEmmitter"
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
            let parts = position.split("-");
            let numberOfBox = parts[1];
            console.log("This is NumberOfBox :::", numberOfBox)
            let place = findTable.playingData
            let sendPosition = await checkPosition(numberOfBox, place)
            console.log("This is SendPosition :::", sendPosition)
        }
    } catch (error) {
        logger.error(`CATCH_ERROR playGame :::: ${error}`)
    }
}
export { playGame }