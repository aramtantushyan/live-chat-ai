'use client';

import { createContext, Dispatch, PropsWithChildren, SetStateAction, useEffect, useState } from "react";

export interface IChatHistoryItem {
  role: 'user' | 'model';
  parts: {[key: string]: any}[]
}

export interface IChatListItem {
  id: number;
  title: string;
}

interface ChatContextProps {
  activeChatId: number | null;
  chatsList: IChatListItem[];
  chatHistory: IChatHistoryItem[]
  setActiveChatId?: Dispatch<SetStateAction<number | null>>;
  sendMessageHandler: (message: string) => void;
  switchToAnotherChat?: (chatId: number | null) => void;
}

export const ChatContext = createContext<ChatContextProps>({
  activeChatId: null,
  chatHistory: [],
  chatsList: [],
  sendMessageHandler: () => {}
});

export const ChatContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [chatsList, setChatsList] = useState<IChatListItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [chatHistory, setChatHistory] = useState<IChatHistoryItem[]>([]);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    try {
      const activeChatId = await fetchChatList();
      await fetchActiveChatHistory(activeChatId);
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchChatList() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/chat/list`, {
        headers: {
          'Content-type': 'application/json'
        }
      });
      const chatList = await response.json();
      const activeChatId = chatList[0].id || null;
      setActiveChatId(activeChatId);
      setChatsList(chatList);
      return activeChatId;
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchActiveChatHistory(chatId: number) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/chat/history/${chatId || activeChatId}`, {
        headers: {
          'Content-type': 'application/json'
        }
      });
      const chatHistory = await response.json();
      setChatHistory(chatHistory);
    } catch (e) {
      console.log(e);
    }
  }
  
  async function sendMessageHandler(message: string) {
    setChatHistory([
      ...chatHistory,
      {
        role: 'user',
        parts: [{ text: message }]
      },
      {
        role: 'model',
        parts: [{text: 'Collecting information...'}]
      }
    ]);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/chat/${activeChatId ? `continue/${activeChatId}` : 'create'}`,
        {
          method: activeChatId ? 'PUT' : 'POST',
          headers: {
            "Content-type": 'application/json'
          },
          body: JSON.stringify({
            message
          })
        }
      );
      const { history, chatId } = await res.json();
      if (chatId) {
        setActiveChatId(chatId);
      }
      setChatHistory(history);
      if (!activeChatId || chatHistory.length !== 1 && chatHistory.length % 5 === 0) {
        fetchChatList();
      }
    } catch (e) {
      setChatHistory((prev) => {
        const realPrev = prev.slice(0, prev.length - 1);
        return [...realPrev];
      });
      console.log(e);
    }
  }

  async function switchToAnotherChat(chatId: number | null) {
    setActiveChatId(chatId);
    if (chatId) {
      await fetchActiveChatHistory(chatId);
    } else {
      setChatHistory([]);
    }
  }
  
  return (
    <ChatContext.Provider
      value={{ 
        activeChatId,
        chatsList,
        chatHistory,
        setActiveChatId,
        sendMessageHandler,
        switchToAnotherChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}