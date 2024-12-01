import { ChatContext } from "@/contexts/ChatContextProvider";
import { useContext } from "react";

interface IWelcomePromptItemProps {
  promptText: string;
}
const WelcomePromptItem: React.FC<IWelcomePromptItemProps> = ({ promptText }) => {
  const { sendMessageHandler } = useContext(ChatContext);

  const _sendMessageHandler = () => {
    sendMessageHandler(promptText);
  }
  return (
    <div className="prompt-card" onClick={_sendMessageHandler}>
      <span>{promptText}</span>
    </div>
  );
};
export default WelcomePromptItem;
