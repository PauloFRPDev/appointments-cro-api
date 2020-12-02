import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import socketIo from 'socket.io';
import http from 'http';

import routes from './routes';
import AppError from './errors/AppError';

import './database';

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: 'https://agendamento-web.cro-rj.org.br',
  }),
);
app.use(helmet());
app.use(express.json());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

const io = socketIo(server, {
  cors: {
    origins: 'http://localhost:3333',
    allowedHeaders: ['Access-Control-Allow-Origin'],
  },
});

io.on('connection', socket => {
  socket.on('test', msg => {
    io.emit('test', msg);
  });
});

server.listen(3333, () => {
  console.log('🚀 Server started on port 3333!');
});
