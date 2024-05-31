import Joi from "joi";
import { logger } from "../logger";

const signUpValidation = async (data: any) => {
    try {
        logger.info(`START : signUpValidation :: DATA :: ${JSON.stringify(data)}`);
        const signUpSchema = Joi.object({
            userName: Joi.string().regex(/^[a-zA-Z]+$/).min(3).max(30).required(),
            isBot: Joi.boolean().required()
        });

        let resultofSignUpvalidation = signUpSchema.validate(data);
        logger.info(`END : signUpValidation :: DATA :: ${JSON.stringify(data)}`);
        return resultofSignUpvalidation;
    } catch (error) {
        logger.error(`CATCH_ERROR signUpValidation :: ${data} , ${error}`);
    }
}

export { signUpValidation }