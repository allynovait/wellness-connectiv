
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

type ChatMessageInputProps = {
  onSendMessage: (text: string) => void;
};

export const ChatMessageInput = ({ onSendMessage }: ChatMessageInputProps) => {
  const [messageText, setMessageText] = useState("");

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText("");
    }
  };

  return (
    <div className="mt-auto border-t pt-3">
      <div className="flex gap-2">
        <Input 
          placeholder="Сообщение..." 
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-grow"
        />
        <Button 
          className="bg-clinic-primary hover:bg-clinic-secondary hover:scale-105 transition-transform" 
          onClick={handleSendMessage}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
