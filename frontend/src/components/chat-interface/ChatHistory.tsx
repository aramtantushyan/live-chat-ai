import { useContext, useEffect, useRef } from "react";

import { ChatContext } from "@/contexts/ChatContextProvider";
import ChatHistoryItem from "./ChatHistoryItem";
import Welcome from "./welcome/Welcome";

const ChatHistory: React.FC = () => {
  const { chatHistory, activeChatId } = useContext(ChatContext);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [chatHistory])
  
  return (
    <div className="chatHistory">
      {!activeChatId && !chatHistory.length ? (
        <Welcome />
      ) : (
        <div className="chatHistoryItemsList">
          {chatHistory.map((h, i) => (
            <ChatHistoryItem 
              {...i === chatHistory.length - 1 ? {ref: lastMessageRef} : {}}
              key={i} role={h.role} parts={h.parts}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default ChatHistory;
