import { ChatContextProvider } from "@/contexts/ChatContextProvider";
import styles from './app.module.scss';
import ChatInterface from "../chat-interface/ChatInterface";
import ChatList from "../chat-list/ChatList";

const App: React.FC = () => {
  return (
    <ChatContextProvider>
      <main className={styles.root}>
        <ChatList />
        <ChatInterface />
      </main>
    </ChatContextProvider>
  );
};
export default App;
