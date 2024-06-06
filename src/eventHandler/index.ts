import { Socket } from "socket.io";
import { logger } from "../logger";
import { signUp } from "../playing/signUp";
import { SOCKET_EVENT_NAME } from "../constant/socketEventName";
import { joinTable } from "../playing/joinTable";
import { playGame } from "../playing/play";
import { move } from "../playing/move";
const eventHandler = async (socket: Socket) => {
    try {
        socket.onAny((eventName: String, data: any) => {
            logger.info(`Request :: Event Name is : ${eventName} :: Data : ${JSON.stringify(data)}`);
            switch (eventName) {
                case SOCKET_EVENT_NAME.SIGN_UP:
                    signUp(data, socket);
                    break;
                case SOCKET_EVENT_NAME.JOIN_TABLE:
                    joinTable(data, socket);
                    break;
                case SOCKET_EVENT_NAME.PLAY:
                    playGame(data, socket);
                    break;
                case SOCKET_EVENT_NAME.MOVE:
                    move(data, socket);
                    break;
            }
        })
    } catch (error) {
        logger.error("eventHandler ::::::::::", error);
    }
}

export { eventHandler };