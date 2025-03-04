
import React from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatMessageInput } from "./ChatMessageInput";
import { Doctor, ChatMessageType } from "@/types/chat";

type ChatViewProps = {
  selectedDoctor: Doctor | null;
  messages: ChatMessageType[];
  onClose: () => void;
  onBackToList: () => void;
  onSendMessage: (text: string) => void;
};

export const ChatView = ({ 
  selectedDoctor, 
  messages, 
  onClose, 
  onBackToList,
  onSendMessage
}: ChatViewProps) => {
  if (!selectedDoctor) return null;

  return (
    <div className="h-full flex flex-col">
      <ChatHeader 
        selectedDoctor={selectedDoctor} 
        onClose={onClose} 
        onBackToList={onBackToList} 
      />
      <ChatMessages messages={messages} />
      <ChatMessageInput onSendMessage={onSendMessage} />
    </div>
  );
};
