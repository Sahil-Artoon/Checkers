import { Socket } from "socket.io";
import { logger } from "../logger";
import { signUp } from "../playing/signUp";
const eventHandler = async (socket: Socket) => {
    try {
        socket.onAny((eventName: String, data: any) => {
            logger.info(`Request :: Event Name is : ${eventName} :: Data : ${JSON.stringify(data)}`);
            switch (eventName) {
                case "SIGN_UP":
                  signUp(data, socket);
                  break;
            }
        })
    } catch (error) {
        logger.error("eventHandler ::::::::::", error);
    }
}

export { eventHandler };