import { IChatHistoryItem, IChatListItem } from "@/contexts/ChatContextProvider";
import { Dispatch, SetStateAction } from "react";
import { fetchChatList } from "./chat.helper";

interface WSReceivedData {
  type: 'text' | 'event',
  data: {
    message?: string;
    eventName?: string;
    chatId?: number;
  }
}

enum wsEvents {
  CHAT_ID_CREATED = 'chat_id_created',
  CHAT_TITLE_UPDATED = 'chat_title_updated'
}

export async function wsOnMessageReceivedHandler(
  eventData: WSReceivedData,
  activeChatId: number | null,
  setChatId: Dispatch<SetStateAction<number | null>>,
  setChatsList: Dispatch<SetStateAction<IChatListItem[]>>,
  setChatHistory: Dispatch<SetStateAction<IChatHistoryItem[]>>
) {
  const type = eventData.type;
  const payload = eventData.data;
  // if (payload.chatId) {
  //   setChatId(payload.chatId);
  // }
  if (!activeChatId) {
  }
  if (type === 'text') {
    handleWSmessage(payload.message as string, setChatHistory);
  } else if (type === 'event') {
    switch (payload.eventName) {
      case wsEvents.CHAT_ID_CREATED:
        setChatId(payload.chatId as number | null);
        await fetchChatList(setChatId, setChatsList);
        break;
      case wsEvents.CHAT_TITLE_UPDATED:
        await fetchChatList(setChatId, setChatsList);
        break;
    }
  }
}

function handleWSmessage(message: string, setChatHistory: Dispatch<SetStateAction<IChatHistoryItem[]>>) {
  setChatHistory(prev => {
    const _prev = [...prev];
    let lastChunk = _prev.pop();
    let recentMessage = lastChunk?.parts[0].text;
    if (recentMessage === 'Collecting information...') {
      lastChunk = {
        role: 'model',
        parts: [{text: message}]
      }
    } else {
      lastChunk = {
        role: 'model',
        parts: [{text: recentMessage + message}]
      }
    }
    return [
      ..._prev,
      lastChunk
    ]
  });
} 