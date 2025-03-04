
import { useState, useRef, useEffect } from "react";
import { Doctor, ChatMessageType } from "@/types/chat";
import { DoctorListView } from "@/components/chat/DoctorListView";
import { ChatView } from "@/components/chat/ChatView";

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
const mockChatMessages: ChatMessageType[] = [
  { id: 1, senderId: 1, text: "Здравствуйте! Как ваше самочувствие сегодня?", time: "10:30" },
  { id: 2, senderId: "user", text: "Здравствуйте, доктор! Чувствую себя лучше, кашель почти прошел.", time: "10:35" },
  { id: 3, senderId: 1, text: "Отлично! Продолжайте принимать прописанные лекарства еще 3 дня, и должно стать еще лучше.", time: "10:38" },
  { id: 4, senderId: 1, text: "Как ваше самочувствие после приема лекарств?", time: "10:45" }
];

type ChatDrawerProps = {
  open: boolean;
  onClose: () => void;
  initialDoctor?: Doctor | null;
};

export const ChatDrawer = ({ open, onClose, initialDoctor = null }: ChatDrawerProps) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && initialDoctor) {
      const foundDoctor = mockDoctors.find(d => d.id === initialDoctor.id);
      setSelectedDoctor(foundDoctor || initialDoctor);
    }
  }, [open, initialDoctor]);

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleBackToList = () => {
    setSelectedDoctor(null);
  };

  const handleSendMessage = (text: string) => {
    if (text.trim()) {
      console.log("Sending message to doctor:", selectedDoctor?.id, text);
    }
  };

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

  if (!open) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-black/20 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div 
        ref={drawerRef}
        className={`fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white rounded-t-2xl h-3/4 p-5 shadow-lg
          transition-transform transform duration-500 ease-in-out ${open ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {selectedDoctor ? (
          <ChatView 
            selectedDoctor={selectedDoctor}
            messages={mockChatMessages}
            onClose={onClose}
            onBackToList={handleBackToList}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <DoctorListView 
            doctors={mockDoctors} 
            onDoctorSelect={handleDoctorSelect} 
            onClose={onClose} 
          />
        )}
      </div>
    </div>
  );
};
