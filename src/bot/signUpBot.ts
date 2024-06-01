import { SOCKET_EVENT_NAME } from "../constant/socketEventName"
import { logger } from "../logger"
import { signUp } from "../playing/signUp";

const signUpBot = async (socket: any) => {
    try {
        logger.info(`START signUpBot ::::`)
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let result: any = '';
        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        let data: any = {
            eventName: SOCKET_EVENT_NAME.SIGN_UP,
            data: {
                userName: result,
                isBot: true
            }
        }
        let dataOfBot = await signUp(data, socket);
        
    } catch (error) {
        logger.error(`CATCH_ERROR signUpBot :::: ${error}`)
    }
}

export { signUpBot }