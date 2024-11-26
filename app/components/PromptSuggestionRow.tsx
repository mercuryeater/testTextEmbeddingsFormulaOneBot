import PromptSuggestionBtn from "./PromptSuggestionBtn";

interface PromptSuggestionRowProps {
  onPromptClick: (prompt: string) => void;
}

const PromptSuggestionRow: React.FC<PromptSuggestionRowProps> = ({
  onPromptClick,
}) => {
  const prompts = [
    "Who is the current F1 World Champion?",
    "Who is the hiughest paid F1 driver?",
    "Who is the youngest F1 driver?",
    "Who is the oldest F1 driver?",
    "Who is the most successful F1 driver?",
    "Who is the current Formula One World Champion?",
  ];

  return (
    <div className="prompt-suggestion-row">
      {prompts.map((prompt, index) => (
        <PromptSuggestionBtn
          key={`prompt-${index}`}
          text={prompt}
          handleOnclick={() => onPromptClick(prompt)}
        />
      ))}
    </div>
  );
};

export default PromptSuggestionRow;
