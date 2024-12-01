import express from 'express';
import { continueChat, createChat, getChatHistoryById, getChatsList } from '../services/chatService.js';

const router = express.Router();

router.post('/create', async (req, res) => {
  const { message } = req.body;
  try {
    const { history, chatId } = await createChat(message);
    res.status(201).json({ history, chatId });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/continue/:id', async (req, res) => {
  const { message } = req.body;
  const chatId = req.params.id;

  if (!message) {
    return res.status(400).json({ error: 'Message is missing' })
  }

  if (!chatId) {
    return res.status(400).json({ error: 'Chat id is missing' })
  }

  try {
    const history = await continueChat(chatId, message);
    res.status(200).json({ history });
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

router.get('/list', (req, res) => {
  try {
    const list = getChatsList();
    res.status(200).json(list);
  } catch (e) {
    res.status(404).json({ error: e.message })
  }
})

router.get('/history/:id', async (req, res) => {
  const chatId = req.params.id;

  if (!chatId) {
    res.status(400).json({ error: 'Chat id is missing' })
  }

  try {
    const history = await getChatHistoryById(chatId);
    res.status(200).json(history);
  } catch (e) {
    res.status(404).json({ error: e.message })
  }
});

export default router;
