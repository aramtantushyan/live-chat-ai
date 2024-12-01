import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GOOGLE_GENERATIVE_API;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const sendMessage = async (message, history) => {
  if (!message) {
    throw new Error('Message is missing');
  }
  const chat = model.startChat({
    history: history || [],
    generationConfig: {
      maxOutputTokens: 1000
    }
  });
  
  await chat.sendMessage(message);
  return await chat.getHistory();
}

export const generateChatTitle = async (chatHistory) => {
  try {
    const title = await model.generateContent(`Please generate a 3-4 words summary title for the following conversation: ${chatHistory}`);
    return title.response.text();
  } catch (e) {
    throw new Error('Chat title generation has failed');
  }
}
