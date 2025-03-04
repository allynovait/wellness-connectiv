
import React from "react";

type ChatMessageProps = {
  id: number;
  senderId: number | string;
  text: string;
  time: string;
};

export const ChatMessage = ({ senderId, text, time }: ChatMessageProps) => {
  const isUserMessage = senderId === "user";
  
  return (
    <div className={`flex ${isUserMessage ? "justify-end" : "justify-start"}`}>
      <div 
        className={`max-w-[80%] p-3 rounded-lg animate-fade-in ${
          isUserMessage 
            ? "bg-clinic-primary text-white rounded-tr-none" 
            : "bg-gray-100 rounded-tl-none"
        }`}
      >
        <p className="text-sm">{text}</p>
        <p className={`text-xs mt-1 ${isUserMessage ? "text-white/70" : "text-gray-500"}`}>
          {time}
        </p>
      </div>
    </div>
  );
};
