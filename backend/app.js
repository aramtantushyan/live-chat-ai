import express from 'express';
import http from 'http';
import cors from 'cors';
import WebSocket from 'ws';

import * as db from './db/db.js';
import chatRoutes from './routes/chatRoutes.js';
import './services/googleGenerativeService.js'
import { initializeWebSocket } from './services/webSocket.js';

const app = express();

app.use(cors());
app.use(express.json());
db.initialize();

app.use('/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the backend server');
});

const server = http.createServer(app);

initializeWebSocket(server);

server.listen(3001);