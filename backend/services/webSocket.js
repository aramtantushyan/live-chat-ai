import { WebSocketServer } from 'ws';
import { continueChat, createChat } from './chatService.js';

export function initializeWebSocket(server) {
  const wss = new WebSocketServer({server});

  wss.on('connection', (ws) => {
    console.log('A client connected.');
    
    ws.on('message', async (message) => {
      try {
        const messageObj = JSON.parse(message);
        console.log("message object:", messageObj);
        
        if (!messageObj.event || !messageObj.data.message) {
          throw new Error('Invalid message format')
        }
        if (messageObj.event === 'create-chat') {
          await createChat(ws, messageObj.data.message);
        } else if (messageObj.event === 'continue-chat') {
          await continueChat(ws, messageObj.data.chatId, messageObj.data.message);
        }
      } catch (e) {
        console.log('Message validation failed:', e);
      }
      console.log(`Received message: ${message}`);
    });

    ws.on('close', () => {
      console.log('A client disconnected.');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
}