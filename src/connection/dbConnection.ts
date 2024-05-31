import mongoose from "mongoose";
import { logger } from "../logger";
import dotenv from 'dotenv'
dotenv.config({ path: './env' })

const connectDb = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}${process.env.MONGODB_DATABASE_NAME}`)
        logger.info(`connect DB successFully !!!`)
    } catch (error) {
        logger.error(`CATCH_ERROR connectDb :: ${error}`);
    }
}

export { connectDb }