import { IChatHistoryItem  } from "@/contexts/ChatContextProvider";
import { forwardRef } from "react";

const ChatHistoryItem: React.FC<IChatHistoryItem> = forwardRef<HTMLDivElement, IChatHistoryItem>(({ role, parts }, ref) => {
  return (
    <div ref={ref} className={role === 'user' ? 'userMessage' : 'modelResponse'}>
      {role === 'model' ? (
        <img src="/logo.png" alt="logo" className="modelAvatar" />
      ) : null}
      {parts[0].text}
    </div>
  );
});

ChatHistoryItem.displayName = 'ChatHistoryItem';
export default ChatHistoryItem;
