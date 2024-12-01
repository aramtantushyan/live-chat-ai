import * as db from '../db/db.js';
import { generateChatTitle, sendMessage } from './googleGenerativeService.js';

export async function createChat(message) {
  try {
    const history = await sendMessage(message);
    const historyStringified = JSON.stringify(history);
    const chatTitle = await generateChatTitle(historyStringified);
    const result = db.run('INSERT INTO threads (title, history) VALUES (?, ?)', [chatTitle, historyStringified]);

    return {
      history,
      chatId: result.lastInsertRowid
    };
  } catch (e) {
    throw new Error(`Failed to initiate a chat session: ${e.message}`);
  }
};

export async function continueChat(chatId, message) {
  try {
    const currentChat = await db.get('SELECT * from threads WHERE id = ?', [chatId]);
    if (!currentChat) {
      throw new Error(`Chat with id: ${chatId} does not exist`)
    }
    const currentChatHistory = JSON.parse(currentChat.history);
    const recentHistory = await sendMessage(message, currentChatHistory);
    const historyStringified = JSON.stringify(recentHistory);

    const shouldUpdateTitle = recentHistory.length !== 1 && recentHistory.length % 5 === 0;
    let chatTitle = '';
    if (shouldUpdateTitle) {
      chatTitle = await generateChatTitle(historyStringified);
    }

    const result = db.run(
      `UPDATE threads SET history = ?${shouldUpdateTitle ? ', title = ?' : ''} WHERE id = ?`, [historyStringified, ...(shouldUpdateTitle ? [chatTitle] : []), chatId]);
  
    if (result.changes === 0) {
      throw new Error('Something wrong happened!');
    }

    return recentHistory;
  } catch (e) {
    throw new Error(e);
  }
}

export function getChatsList() {
  try {
    const chatList = db.all('SELECT id, title from threads ORDER BY updatedAt DESC');
    return chatList;
  } catch (e) {
    throw new Error('Failed to get chat list');
  }
}

export function getChatHistoryById(chatId) {  
  try {
    const chatHistory = db.get('SELECT history from threads WHERE id = ?', [chatId]);
    return JSON.parse(chatHistory.history);
  } catch (e) {
    throw new Error('Failed to retrieve chat history');
  }
}