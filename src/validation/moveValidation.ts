import Joi from "joi";
import { logger } from "../logger"

const moveValidation = async (data: any) => {
    try {
        logger.info(`START moveValidation :::: DATA :::: ${JSON.stringify(data)}`)
        const moveSchema = Joi.object({
            userId: Joi.string().required(),
            movePosition: Joi.string().required(),
            tableId: Joi.string().required(),
            movePiece: Joi.string().required()
        });

        let resultOfMove = moveSchema.validate(data);
        logger.info(`END : moveValidation :: DATA :: ${JSON.stringify(data)}`);
        return resultOfMove;
    } catch (error) {
        logger.error(`CATCH_ERROR moveValidation :::: ${error}`)
    }
}

export { moveValidation }