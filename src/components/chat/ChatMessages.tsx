
import React from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatMessageType } from "@/types/chat";

type ChatMessagesProps = {
  messages: ChatMessageType[];
};

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  return (
    <div className="flex-grow overflow-auto space-y-3 mb-4">
      {messages.map((message) => (
        <ChatMessage 
          key={message.id} 
          id={message.id}
          senderId={message.senderId}
          text={message.text}
          time={message.time}
        />
      ))}
    </div>
  );
};
