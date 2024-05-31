import mongoose from "mongoose";
import { logger } from "../logger"

const generateId = () => {
    try {
        logger.info(`START generateId :::: `);
        let _id: any = new mongoose.mongo.ObjectId();
        _id = _id.toString();
        logger.info(`END generateId :::: ${_id}`);
        return _id;
    } catch (error) {
        logger.error(`CATCH_ERROR generateId :::: ${(error)}`)
    }
}

export { generateId }