import Joi from "joi";
import { logger } from "../logger"

const reJoinValidation = async (data: any) => {
    try {
        logger.info(`START reJoinValidation :::: DATA :::: ${JSON.stringify(data)}`)
        const reJoinSchema = Joi.object({
            tableId: Joi.string().required(),
            userId: Joi.string().required(),
        });

        let resultOfReJoin = reJoinSchema.validate(data);
        logger.info(`END : reJoinValidation :: DATA :: ${JSON.stringify(data)}`);
        return resultOfReJoin;
    } catch (error) {
        logger.error(`CATCH_ERROR reJoinValidation :::: ${error}`)
    }
}

export { reJoinValidation }