import { logger } from "../logger"
import { joinTable } from "../playing/joinTable"

const botJoinTable = async (data: any, socket: any) => {
    try {
        logger.info(`START botJoinTable :::: ${JSON.stringify(data)}`)
        data = {
            _id: data._id,
            userName: data.userName,
            isBot: data.isBot,
            tableId: data.tableId
        }
        joinTable(data, socket)
        logger.info(`END botJoinTable ::: ${JSON.stringify(data)}`)
    } catch (error) {
        logger.error(`CATCH_ERROR botJoinTable :::: ${error}`)
    }
}

export { botJoinTable }