import { IChatHistoryItem, IChatListItem } from "@/contexts/ChatContextProvider";
import { Dispatch, SetStateAction } from "react";

export async function fetchChatList(
  setChatId: Dispatch<SetStateAction<number | null>>,
  setChatsList: Dispatch<SetStateAction<IChatListItem[]>>
) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/chat/list`, {
      headers: {
        'Content-type': 'application/json'
      }
    });
    const chatList = await response.json();
    const activeChatId = chatList[0].id || null;
    setChatId(activeChatId);
    setChatsList(chatList);
    return activeChatId;
  } catch (e) {
    console.log(e);
  }
}

export async function fetchActiveChatHistory(
  chatId: number,
  setChatHistory: Dispatch<SetStateAction<IChatHistoryItem[]>>
) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/chat/history/${chatId}`, {
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

export async function switchToAnotherChat(
  chatId: number | null,
  setChatId: Dispatch<SetStateAction<number | null>>,
  setChatHistory: Dispatch<SetStateAction<IChatHistoryItem[]>>
) {
  setChatId(chatId);
  if (chatId) {
    await fetchActiveChatHistory(chatId, setChatHistory);
  } else {
    setChatHistory([]);
  }
}