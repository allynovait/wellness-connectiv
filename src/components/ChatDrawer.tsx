
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, ChevronLeft, Send, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  lastMessage?: string;
  lastMessageDate?: string;
  avatar?: string;
};

// Mock data for doctors
const mockDoctors: Doctor[] = [
  {
    id: 1,
    name: "Др. Петрова Анна Ивановна",
    specialty: "Терапевт",
    lastMessage: "Как ваше самочувствие после приема лекарств?",
    lastMessageDate: "Сегодня, 10:45"
  },
  {
    id: 2,
    name: "Др. Иванов Сергей Михайлович",
    specialty: "Кардиолог",
    lastMessage: "Не забудьте принять лекарства вечером",
    lastMessageDate: "Вчера, 18:30"
  }
];

// Mock chat messages for demonstration
const mockChatMessages = [
  { id: 1, senderId: 1, text: "Здравствуйте! Как ваше самочувствие сегодня?", time: "10:30" },
  { id: 2, senderId: "user", text: "Здравствуйте, доктор! Чувствую себя лучше, кашель почти прошел.", time: "10:35" },
  { id: 3, senderId: 1, text: "Отлично! Продолжайте принимать прописанные лекарства еще 3 дня, и должно стать еще лучше.", time: "10:38" },
  { id: 4, senderId: 1, text: "Как ваше самочувствие после приема лекарств?", time: "10:45" }
];

type ChatDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export const ChatDrawer = ({ open, onClose }: ChatDrawerProps) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [messageText, setMessageText] = useState("");
  const drawerRef = useRef<HTMLDivElement>(null);

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleBackToList = () => {
    setSelectedDoctor(null);
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // In a real app, you would send the message to the API
      console.log("Sending message to doctor:", selectedDoctor?.id, messageText);
      setMessageText("");
    }
  };

  // Handle click outside to close drawer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node) && open) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  const renderDoctorList = () => (
    <div className="h-full flex flex-col">
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

      <div className="space-y-3 flex-grow overflow-auto">
        {mockDoctors.map((doctor, index) => (
          <Card 
            key={doctor.id} 
            className="bg-white cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] animate-fade-in"
            onClick={() => handleDoctorSelect(doctor)}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-3">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-clinic-light flex items-center justify-center text-clinic-primary flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-grow">
                  <p className="font-medium">{doctor.name}</p>
                  <p className="text-xs text-gray-500">{doctor.specialty}</p>
                  {doctor.lastMessage && (
                    <div>
                      <p className="text-sm text-gray-700 truncate mt-1">{doctor.lastMessage}</p>
                      <p className="text-xs text-gray-400">{doctor.lastMessageDate}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderChat = () => {
    if (!selectedDoctor) return null;

    return (
      <div className="h-full flex flex-col">
        <div className="border-b pb-3 mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="p-0 mr-2 hover:bg-transparent hover:text-clinic-primary" 
              onClick={handleBackToList}
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

        <div className="flex-grow overflow-auto space-y-3 mb-4">
          {mockChatMessages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.senderId === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg animate-fade-in ${
                  message.senderId === "user" 
                    ? "bg-clinic-primary text-white rounded-tr-none" 
                    : "bg-gray-100 rounded-tl-none"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${message.senderId === "user" ? "text-white/70" : "text-gray-500"}`}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>

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
      </div>
    );
  };

  if (!open) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-black/20 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div 
        ref={drawerRef}
        className={`fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white rounded-t-2xl h-3/4 p-5 shadow-lg
          transition-transform transform duration-500 ease-in-out ${open ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {selectedDoctor ? renderChat() : renderDoctorList()}
      </div>
    </div>
  );
};
