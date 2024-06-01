import { SOCKET_EVENT_NAME } from "../constant/socketEventName"
import { logger } from "../logger"
import { joinTable } from "../playing/joinTable"

const botJoinTable = async (data: any, socket: any) => {
    try {
        logger.info(`START botJoinTable :::: `)
        data = {
            eventName: SOCKET_EVENT_NAME.JOIN_TABLE,
            data: {
                _id: data._id,
                userName: data.userName,
                isBot: data.isBot
            }
        }
        await joinTable(data, socket)
    } catch (error) {
        logger.error(`CATCH_ERROR botJoinTable :::: ${error}`)
    }
}

export { botJoinTable }