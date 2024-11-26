interface PromptSuggestionBtnProps {
  handleOnclick: () => void;
  text: string;
}
const PromptSuggestionBtn: React.FC<PromptSuggestionBtnProps> = ({
  handleOnclick,
  text,
}) => {
  return (
    <button onClick={handleOnclick} className="prompt-suggestion-btn">
      {text}
    </button>
  );
};

export default PromptSuggestionBtn;
