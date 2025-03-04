
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, X, MessageSquare } from "lucide-react";
import { Doctor } from "@/types/chat";

type ChatHeaderProps = {
  selectedDoctor: Doctor | null;
  onClose: () => void;
  onBackToList: () => void;
};

export const ChatHeader = ({ selectedDoctor, onClose, onBackToList }: ChatHeaderProps) => {
  if (selectedDoctor) {
    return (
      <div className="border-b pb-3 mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="p-0 mr-2 hover:bg-transparent hover:text-clinic-primary" 
            onClick={onBackToList}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <span className="text-lg font-medium">{selectedDoctor.name}</span>
            <div className="text-xs text-gray-500">{selectedDoctor.specialty}</div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-500" />
        </Button>
      </div>
    );
  }

  return (
    <div className="border-b pb-3 mb-4 flex justify-between items-center">
      <h2 className="text-lg font-medium flex items-center">
        <MessageSquare className="w-5 h-5 mr-2 text-clinic-primary" />
        Сообщения
      </h2>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose}
        className="rounded-full hover:bg-gray-100"
      >
        <X className="w-5 h-5 text-gray-500" />
      </Button>
    </div>
  );
};
