'use client';

import { useContext, useEffect, useState } from "react";
import styles from './chat-list.module.scss';
import ChatListItem from "./ChatListItem";
import { ChatContext } from "@/contexts/ChatContextProvider";
import { chevronRightIcon } from "@/utils/svg";

const ChatList: React.FC = () => {
  const { chatsList, activeChatId } = useContext(ChatContext);

  const [isVisible, setIsVisible] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const shouldShowSidebar = window.innerWidth >= 768;
      setIsVisible(shouldShowSidebar);
      setViewportWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const chatListItemClickHandler = () => {
    if (viewportWidth <= 425) {
      setIsVisible(false);
    }
  }

  const sidebarToggle = () => {    
    setIsVisible(!isVisible);
  }

  return (
    <section className={styles.chatsList}>
      <div className={`container ${isVisible ? '' : 'closed'}`}>
        <div className={`sidebarToggle ${isVisible ? 'opened' : 'closed'}`} onClick={sidebarToggle}>
          {chevronRightIcon}
        </div>
        <ChatListItem
          key='add-conversation'
          className='start-new'
          onClick={chatListItemClickHandler}
        />
        <div className="chatList">
          {chatsList?.length && !activeChatId ? (
            <span className="prevConversation">
              Previous conversations
            </span>
          ) : null}
          {chatsList.length ? chatsList.map((li, i) => (
            <ChatListItem
              key={i}
              id={li.id}
              title={li.title}
              className={activeChatId === li.id ? 'active' : null}
              onClick={chatListItemClickHandler}
            />
          )) : (
            <ChatListItem key='empty-conversation' isEmptyListPLaceholder={true}/>
          )}
        </div>
      </div>
    </section>
  );
};
export default ChatList;
