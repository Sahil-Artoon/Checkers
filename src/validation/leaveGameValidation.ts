import Joi from "joi";
import { logger } from "../logger"

const leaveGameValidation = async (data: any) => {
    try {
        logger.info(`START leaveGameValidation :::: DATA :::: ${JSON.stringify(data)}`)
        const leaveGameSchema = Joi.object({
            userId: Joi.string().required(),
            tableId: Joi.string(),
        });

        let resultOfLeaveGame = leaveGameSchema.validate(data);
        logger.info(`END : leaveGameValidation :: DATA :: ${JSON.stringify(data)}`);
        return resultOfLeaveGame;
    } catch (error) {
        logger.error(`CATCH_ERROR leaveGameValidation :::: ${error}`)
    }
}

export { leaveGameValidation }