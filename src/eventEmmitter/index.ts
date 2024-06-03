import { logger } from "../logger";
import { io } from "..";

const sendToSocketIdEmmiter = (data: any) => {
    try {
        logger.info(`RESPONSE EVENT NAME :: ${data.eventName} DATA :: ${JSON.stringify(data.data)}`)
        io.to(data.socket.id).emit(data.eventName, data.data)
    } catch (error) {
        logger.error(`CATCH_ERROR sendToSocketIdEmmiter :: ${error}`);
    }
}

const sendToRoomEmmiter = (data: any) => {
    try {
        logger.info(`RESPONSE EVENT NAME :: ${data.eventName} DATA :: ${JSON.stringify(data.data)}`)
        io.to(data.data._id).emit(data.eventName, data.data)
    } catch (error) {
        logger.error(`CATCH_ERROR sendToSocketIdEmmiter :: ${error}`);
    }
}

export {
    sendToSocketIdEmmiter, sendToRoomEmmiter
}