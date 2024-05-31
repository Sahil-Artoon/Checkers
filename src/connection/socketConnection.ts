import { eventHandler } from '../eventHandler';
import { io } from '../index'
import { Socket } from "socket.io";
import { logger } from '../logger';
import { createAdapter } from '@socket.io/redis-adapter';
import { redisPub, redisSub } from './redisConnection';
import { disconnectSocket } from '../playing/disconnect';

const socketConnection = () => {
    try {
        Promise.all([redisPub.connect(), redisSub.connect()])
            .then(() => {
                io.adapter(createAdapter(redisPub, redisSub));
            }).catch((error) => {
                logger.error(`CATCH_ERROR socketConnection in ioAdapter :: ${error}`);
            })
        io.on('connection', async (socket: Socket) => {
            logger.info(`SocketId is:::: ${socket.id}`);
            await eventHandler(socket)

            socket.on("disconnect", () => {
                disconnectSocket(socket);
            });
        })
    } catch (error) {
        logger.error(`CATCH_ERROR socketConnection :: ${error}`);
    }
}

export { socketConnection }