import { useContext } from "react";

import { ChatContext, IChatListItem } from "@/contexts/ChatContextProvider";

const ChatListItem: React.FC<
    Partial<IChatListItem & { 
      className: "active" | "start-new" | null,
      isEmptyListPLaceholder: boolean,
      onClick?: () => void; 
    }>
> = ({ id, title, className, isEmptyListPLaceholder, onClick }) => {
    const { switchToAnotherChat } = useContext(ChatContext);

    const chatListItemClickHandler = () => {
        switchToAnotherChat?.(id || null);
        onClick?.();
    };
    return (
        <div
            className={`chatListItem ${className || ""}`}
            onClick={chatListItemClickHandler}
        >
            {id
              ? <span>{title}</span> 
              : isEmptyListPLaceholder 
              ? <span>There are no conversations</span>
              : <span>+ Start a new conversation</span>
            }
        </div>
    );
};
export default ChatListItem;
