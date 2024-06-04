import Joi from "joi";
import { logger } from "../logger"

const joinTableValidation = async (data: any) => {
    try {
        logger.info(`START joinTableValidation :::: DATA :::: ${JSON.stringify(data)}`)
        const joinTableSchema = Joi.object({
            _id: Joi.string().required(),
            userName: Joi.string().required(),
            isBot: Joi.boolean().required(),
            playWithBot: Joi.boolean(),
            tableId: Joi.string(),
        });

        let resultofjoinTable = joinTableSchema.validate(data);
        logger.info(`END : joinTableValidation :: DATA :: ${JSON.stringify(data)}`);
        return resultofjoinTable;
    } catch (error) {
        logger.error(`CATCH_ERROR joinTableValidation :::: ${error}`)
    }
}

export { joinTableValidation }