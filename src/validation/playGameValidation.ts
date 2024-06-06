import Joi from "joi";
import { logger } from "../logger"

const playGameValidation = async (data: any) => {
    try {
        logger.info(`START playGameValidation :::: DATA :::: ${JSON.stringify(data)}`)
        const playGameSchema = Joi.object({
            userId: Joi.string().required(),
            userName: Joi.string().required(),
            isBot: Joi.boolean().required(),
            tableId: Joi.string().required(),
            position: Joi.string().required()
        });

        let resultOfPlayGame = playGameSchema.validate(data);
        logger.info(`END : playGameValidation :: DATA :: ${JSON.stringify(data)}`);
        return resultOfPlayGame;
    } catch (error) {
        logger.error(`CATCH_ERROR playGameValidation :::: ${error}`)
    }
}

export { playGameValidation }