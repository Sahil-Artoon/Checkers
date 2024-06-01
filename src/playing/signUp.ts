import { generateId } from "../common/generateId"
import { sendToSocketIdEmmiter } from "../eventEmmitter"
import { SOCKET_EVENT_NAME } from "../constant/socketEventName"
import { logger } from "../logger"
import { redisGet, redisSet } from "../redisOption"
import { signUpValidation } from "../validation/signUpValidation"
import { REDIS_EVENT_NAME } from "../constant/redisConstant"

const signUp = async (data: any, socket: any) => {
    try {
        logger.info(`START signUp :::: DATA :::: ${JSON.stringify(data)}`)
        let checkData: any = await signUpValidation(data)
        if (checkData?.error) {
            data = {
                eventName: SOCKET_EVENT_NAME.POP_UP,
                data: {
                    message: checkData.error.details[0].message
                },
                socket
            }
            sendToSocketIdEmmiter(data)
            logger.info(`END signUp :::: ${JSON.stringify(data.data)}`)
            return;
        }
        const { userName, isBot } = data
        let _id: string = generateId()
        socket.userId = _id
        data = {
            _id,
            userName,
            isBot,
            tableId: ""
        }
        logger.info(`signUp Data ${data}`)
        console.log("Sign Up", data)
        await redisSet(`${REDIS_EVENT_NAME.USER}:${_id}`, data)
        let User: any = await redisGet(`${REDIS_EVENT_NAME.USER}:${_id}`);
        User = JSON.parse(User)
        if (isBot == true) {
            return User
        }
        if (isBot == false) {
            data = {
                eventName: SOCKET_EVENT_NAME.SIGN_UP,
                data: {
                    User,
                    message: "ok"
                },
                socket
            }
            sendToSocketIdEmmiter(data)
            logger.info(`END signUp :::: ${JSON.stringify(data.data)}`)
            return;
        }
    } catch (error) {
        logger.error(`CATCH_ERROR signUp :::: ${error}`)
    }
}

export { signUp }