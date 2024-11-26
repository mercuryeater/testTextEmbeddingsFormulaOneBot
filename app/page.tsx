"use client";
import Image from "next/image";
import f1Logo from "./assets/f1LOGO.png";
import { useChat } from "ai/react";
import { Message } from "ai";

const Home: React.FC = () => {
  const noMessages = true;
  return (
    <main>
      <Image src={f1Logo} width={250} alt="F1 Logo" />
      <section>
        {noMessages ? (
          <>
            <p className="starter-text">
              Welcome to the F1 Chatbot! Ask me anything about F1 and I will do
              my best to help you!
            </p>
            <br />
          </>
        ) : (
          <></>
        )}
      </section>
    </main>
  );
};

export default Home;
