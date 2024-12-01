'use client';

import ChatInput from "../chat-input/ChatInput";
import styles from './chat-interface.module.scss';
import ChatHistory from "./ChatHistory";

const ChatInterface: React.FC = () => {
  return (
    <section className={styles.chatInterface}>
      <div className="chat-interface-container">
        <ChatHistory />
        <ChatInput />
      </div>
    </section>
  )
}
export default ChatInterface