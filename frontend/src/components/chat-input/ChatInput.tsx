'use client';

import { ChangeEvent, useContext, useEffect, useState } from "react";
import styles from './chat-input.module.scss';
import { ChatContext } from "@/contexts/ChatContextProvider";
import { sendIcon } from "@/utils/svg";

const ChatInput: React.FC = () => {
  const { sendMessageHandler, activeChatId } = useContext(ChatContext);
  const [enteredText, setEnteredText] = useState('');

  useEffect(() => {
    setEnteredText('');
  }, [activeChatId])

  const inputChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEnteredText(value);
  }

  const _sendMessageHandler = () => {
    if (enteredText.trim()) {
      sendMessageHandler(enteredText.trim());
      setEnteredText('');
    }
  }

  return (
    <div className={styles.chatInput}>
      <div className='input-container'>
        <textarea
          value={enteredText}
          placeholder="Ask me anything you need"
          onChange={inputChangeHandler}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              _sendMessageHandler();
            }
          }}
        />
        <span className="send-btn" onClick={_sendMessageHandler}>
          {sendIcon}
        </span>
      </div>
    </div>
  );
};
export default ChatInput;
