import WelcomePromptItem from "./WelcomePromptItem";

const welcomePrompts = [
  'What are the known chemical properties of Aspirin? Give them in a table',
  'Can you give me chemical equation of Ferum\'s oxidation?',
  'Give me the list of proteins available in human heart',
  'Give me the smiles of Aspirin',
  'Tell about movies'
]
const Welcome: React.FC = () => {
    return (
      <div className="welcome-container">
        <img src="/logo.png" alt="logo" className="modelAvatar lg"/>
        <h1>Hi there, how can I help you today?</h1>
        <div className="welcome-prompts-list">
          {welcomePrompts.map((p, i)=> (
            <WelcomePromptItem key={i} promptText={p} />
          ))}
        </div>
      </div>
    );
};
export default Welcome;