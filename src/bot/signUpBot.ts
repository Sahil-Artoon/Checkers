import { logger } from "../logger";
import { signUp } from "../playing/signUp";
import { botJoinTable } from "./botJoinTable";

const signUpBot = async (tableId: any, socket: any) => {
    try {
        logger.info(`START signUpBot ::::`)
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        let result: any = '';
        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        console.log("result :::: ::::: :::: :::: ", result);
        let data: any = {
            userName: result,
            isBot: true
        }
        let dataOfBot: any = await signUp(data, socket);
        dataOfBot.tableId = tableId
        if (dataOfBot) {
            botJoinTable(dataOfBot, socket);
        }
        logger.info(`END signUpBot :::: DATA ${JSON.stringify(data)}`);
        return;
    } catch (error) {
        logger.error(`CATCH_ERROR signUpBot :::: ${error}`)
    }
}

export { signUpBot }