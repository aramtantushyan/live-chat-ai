import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import { text } from 'express';

dotenv.config();

const API_KEY = process.env.GOOGLE_GENERATIVE_API;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const sendMessage = async (ws, message, history = []) => {  
  if (!message) {
    throw new Error('Message is missing');
  }
  const chat = model.startChat({
    history,
    generationConfig: {
      maxOutputTokens: 1000,
    }
  });

  let result = await chat.sendMessageStream(message);
  let response = '';
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    ws.send(JSON.stringify({type: 'text', data: { message: chunkText }}));
    response += chunkText;
  }
  return [
    ...history,
    {
      role: 'user',
      parts: [{ text: message }]
    },
    {
      role: 'model',
      parts: [{ text: response }]
    }
  ]
}

export const generateChatTitle = async (chatHistory) => {
  try {
    const title = await model.generateContent(`Please generate a 3-4 words summary title for the following conversation: ${chatHistory}`);
    return title.response.text();
  } catch (e) {
    throw new Error('Chat title generation has failed');
  }
}
