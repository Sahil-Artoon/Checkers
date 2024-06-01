import { generateId } from "../common/generateId"
import { GAME_STATUS } from "../constant/gameStatus"
import { REDIS_EVENT_NAME } from "../constant/redisConstant"
import { SOCKET_EVENT_NAME } from "../constant/socketEventName"
import { sendToSocketIdEmmiter } from "../eventEmmitter"
import { logger } from "../logger"
import { redisGet, redisSet } from "../redisOption"
import { joinTableValidation } from "../validation/joinTableValidation"

const joinTable = async (data: any, socket: any) => {
    try {
        logger.info(`START joinTable :::: DATA :::: ${JSON.stringify(data)}`)
        let checkData: any = await joinTableValidation(data)
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
        let { _id, userName, isBot, playWithBot } = data
        let findUser: any = await redisGet(`${REDIS_EVENT_NAME.USER}:${_id}`)
        findUser = JSON.parse(findUser)
        if (!findUser) {
            data = {
                eventName: SOCKET_EVENT_NAME.POP_UP,
                data: {
                    message: `Can't found User By _id.`
                },
                socket
            }
            sendToSocketIdEmmiter(data)
            logger.info(`END signUp :::: ${JSON.stringify(data.data)}`)
            return;
        }

        let tableId: any = await generateId()
        data = {
            _id: tableId,
            playerInfo: [{
                userId: _id,
                userName,
                isBot,
                isActive: true
            }],
            tableData: [
                {
                    pieceId: 'B1',
                    place: 1
                },
                { place: 2 },
                {
                    pieceId: 'B2',
                    place: 3
                },
                { place: 4 },
                {
                    pieceId: 'B3',
                    place: 5
                },
                { place: 6 },
                {
                    pieceId: 'B4',
                    place: 7
                },
                { place: 8 },
                { place: 9 },
                {
                    pieceId: 'B5',
                    place: 10
                },
                { place: 11 },
                {
                    pieceId: 'B6',
                    place: 12
                },
                { place: 13 },
                {
                    pieceId: 'B7',
                    place: 14
                },
                { place: 15 },
                {
                    pieceId: 'B8',
                    place: 16
                },
                {
                    pieceId: 'B9',
                    place: 17
                },
                { place: 18 },
                {
                    pieceId: 'B10',
                    place: 19
                },
                { place: 20 },
                {
                    pieceId: 'B11',
                    place: 21
                },
                { place: 22 },
                {
                    pieceId: 'B12',
                    place: 23
                },
                { place: 24 },
                { place: 25 },
                { place: 26 },
                { place: 27 },
                { place: 28 },
                { place: 29 },
                { place: 30 },
                { place: 31 },
                { place: 32 },
                { place: 33 },
                { place: 34 },
                { place: 35 },
                { place: 36 },
                { place: 37 },
                { place: 38 },
                { place: 39 },
                { place: 40 },
                { place: 41 },
                {
                    pieceId: 'R1',
                    place: 42
                },
                { place: 43 },
                {
                    pieceId: "R2",
                    place: 44
                },
                { place: 45 },
                {
                    pieceId: "R3",
                    place: 46
                },
                { place: 47 },
                {
                    pieceId: "R4",
                    place: 48
                },
                {
                    pieceId: "R5",
                    place: 49
                },
                {
                    place: 50
                },
                {
                    pieceId: "R6",
                    place: 51
                },
                { place: 52 },
                {
                    pieceId: "R7",
                    place: 53
                },
                { place: 54 },
                {
                    pieceId: "R8",
                    place: 55
                },
                { place: 56 },
                { place: 57 },
                {
                    pieceId: "R9",
                    place: 58
                },
                { place: 59 },
                {
                    pieceId: "R10",
                    place: 60
                },
                { place: 61 },
                {
                    pieceId: "R11",
                    place: 62
                },
                { place: 63 },
                {
                    pieceId: "R12",
                    place: 64
                }
            ],
            activePlayer: 1,
            currentTurnSeatIndex: null,
            winnerSeatIndex: null,
            gameStatus: GAME_STATUS.WAITING
        }
        await redisSet(`${REDIS_EVENT_NAME.TABLE}:${tableId}`, data)
        console.log("here")
        let findTable: any = await redisGet(`${REDIS_EVENT_NAME.TABLE}:${tableId}`)
        findTable = JSON.parse(findTable)
        if (!findTable) {
            data = {
                eventName: SOCKET_EVENT_NAME.POP_UP,
                data: {
                    message: `Can't found Table By tableId.`
                },
                socket
            }
            sendToSocketIdEmmiter(data)
            logger.info(`END signUp :::: ${JSON.stringify(data.data)}`)
            return;
        }
        socket.join(findTable._id)
        data = {
            eventName: SOCKET_EVENT_NAME.JOIN_TABLE,
            data: {
                data: findTable,
                message: "ok"
            },
            socket
        }
        sendToSocketIdEmmiter(data)
        if (playWithBot == true) {
            
        }
        logger.info(`END signUp :::: ${JSON.stringify(data.data)}`)
        return;
    } catch (error) {
        logger.error(`CATCH_ERROR joinTable :::: ${error}`)
    }
}

export { joinTable }