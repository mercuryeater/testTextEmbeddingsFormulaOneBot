"use client";
import Image from "next/image";
import f1Logo from "./assets/f1LOGO.png";
import { CreateMessage, useChat } from "ai/react";
import Bubble from "./components/Bubble";
import PromptSuggestionRow from "./components/PromptSuggestionRow";
import LoadingBubble from "./components/LoadingBubble";

const Home: React.FC = () => {
  const {
    append,
    isLoading,
    messages,
    input,
    handleInputChange,
    handleSubmit,
  } = useChat({
    api: "/api/chat",
    onResponse: (response) => {
      console.log("response onres:", response);
      // append(response);
    },
  });

  console.log("messages:", messages);

  const noMessages = !messages || messages.length === 0;

  const handlePrompt = (promptText: string) => {
    const msg: CreateMessage = {
      id: crypto.randomUUID(),
      content: promptText,
      role: "user",
    };
    console.log("promptText:", promptText);
    append(msg);
  };

  return (
    <main>
      <Image src={f1Logo} width={250} alt="F1 Logo" />
      <section className={noMessages ? "" : "populated"}>
        {noMessages ? (
          <>
            <p className="starter-text">
              Welcome to the F1 Chatbot! Ask me anything about F1 and I will do
              my best to help you!
            </p>
            <br />
            <PromptSuggestionRow onPromptClick={handlePrompt} />
          </>
        ) : (
          <>
            {/* Map messages onto text bubbles */}
            {messages.map((message, index) => (
              <Bubble key={`message-${index}`} message={message} />
            ))}
            {isLoading && <LoadingBubble />}
          </>
        )}
      </section>
      <form onSubmit={handleSubmit}>
        <input
          className="question-box"
          onChange={handleInputChange}
          value={input}
          placeholder="Ask me something..."
        />
        <input type="submit" />
      </form>
    </main>
  );
};

export default Home;
