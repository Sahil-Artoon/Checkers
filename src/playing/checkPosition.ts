import { logger } from "../logger"

const checkPosition = (p: any, place: any) => {
    try {
        logger.info(`START checkPosition :::: Position : ${p} AND Place : ${place}`)
        if(p==1 && place[10]){}
    } catch (error) {
        logger.error(`CATCH_ERROR checkPosition :::: ${error}`)
    }
}
export { checkPosition }