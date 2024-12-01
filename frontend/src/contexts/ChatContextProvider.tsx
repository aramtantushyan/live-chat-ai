'use client';

import { fetchActiveChatHistory, fetchChatList } from "@/utils/helpers/chat.helper";
import { wsOnMessageReceivedHandler } from "@/utils/helpers/ws.helper";
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

  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SERVER_URL) {
      const ws = new WebSocket(process.env.NEXT_PUBLIC_SERVER_URL);
  
      ws.onopen = () => {
        console.log('Connected to WebSocket server');
        setIsConnected(true);
      };
  
      ws.onmessage = (event) => {
        console.log('message received event', event);
        const data = JSON.parse(event.data);
        wsOnMessageReceivedHandler(
          data,
          activeChatId,
          setActiveChatId,
          setChatsList,
          setChatHistory
        );        
      };
  
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
  
      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
      };

      setSocket(ws);
      return () => {
        ws.close();
      };
    }
  }, []);

  async function init() {
    try {
      const activeChatId = await fetchChatList(setActiveChatId, setChatsList);
      if (activeChatId) {
        await fetchActiveChatHistory(activeChatId, setChatHistory);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const sendMessageHandler = (message: string) => {
    if (socket && isConnected) {
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
      if (activeChatId) {
        socket.send(JSON.stringify({
          event: 'continue-chat',
          data: { 
            message,
            chatId: activeChatId 
          }
        }));
      } else {
        socket.send(JSON.stringify({event: 'create-chat', data: { message }}));
      }
    }
  }
  
  // async function sendMessageHandler(message: string) {
  //   setChatHistory([
  //     ...chatHistory,
  //     {
  //       role: 'user',
  //       parts: [{ text: message }]
  //     },
  //     {
  //       role: 'model',
  //       parts: [{text: 'Collecting information...'}]
  //     }
  //   ]);
  //   try {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_SERVER_URL}/chat/${activeChatId ? `continue/${activeChatId}` : 'create'}`,
  //       {
  //         method: activeChatId ? 'PUT' : 'POST',
  //         headers: {
  //           "Content-type": 'application/json'
  //         },
  //         body: JSON.stringify({
  //           message
  //         })
  //       }
  //     );
  //     const { history, chatId } = await res.json();
  //     if (chatId) {
  //       setActiveChatId(chatId);
  //     }
  //     setChatHistory(history);
  //     if (!activeChatId || chatHistory.length !== 1 && chatHistory.length % 5 === 0) {
  //       fetchChatList();
  //     }
  //   } catch (e) {
  //     setChatHistory((prev) => {
  //       const realPrev = prev.slice(0, prev.length - 1);
  //       return [...realPrev];
  //     });
  //     console.log(e);
  //   }
  // }

  async function switchToAnotherChat(chatId: number | null) {
    setActiveChatId(chatId);
    if (chatId) {
      await fetchActiveChatHistory(chatId, setChatHistory);
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