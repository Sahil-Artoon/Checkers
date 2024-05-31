import express from 'express'
import path from 'path'
import http from 'http';
import { Server } from "socket.io";
import { logger } from './logger';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import { allConnections } from './connection/allConnections';
const app = express()
const server = http.createServer(app);
const io = new Server(server);

allConnections()

app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

app.get('/', async (req:any, res:any) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))

})
const port = process.argv[2] || process.env.PORT || 5000
server.listen(port, async () => {
  logger.info(`server listening on port http://localhost:${port}   `)
})

export { io }

try {
  process
    .on("unhandledRejection", (response, p) => {
      console.error("unhandledRejection", response);
      console.error("unhandledRejection", p);
      logger.error("unhandledRejection", response);
      logger.error("unhandledRejection", p);
    })
    .on("uncaughtException", (err) => {
      console.error("uncaughtException", err);
      logger.error("uncaughtException", err);
    });
} catch (error) {
  console.error(error);
  logger.error("uncaughtException", error);
}