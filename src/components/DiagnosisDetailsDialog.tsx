
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, MessageSquare } from "lucide-react";
import { useState } from "react";
import { ChatDrawer } from "@/components/ChatDrawer";

type DiagnosisDetailsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  diagnosis: {
    id: number;
    date: string;
    name: string;
    status: string;
    description?: string;
    doctor?: {
      id: number;
      name: string;
      specialty: string;
    };
  };
};

export const DiagnosisDetailsDialog = ({ 
  open, 
  onOpenChange, 
  diagnosis 
}: DiagnosisDetailsProps) => {
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const placeholderText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus. Aenean et justo at enim facilisis gravida. Sed diam dolor, elementum et lobortis a, consectetur a orci. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec lacinia sapien ut risus fermentum, non luctus massa condimentum. Maecenas pellentesque elit at turpis finibus, in elementum mi tincidunt. Cras ultricies enim quis sollicitudin fermentum. Quisque in sapien non nulla condimentum dictum. Ut interdum tellus vitae justo aliquam pellentesque.";
  
  // Default doctor information if not provided
  const doctorInfo = diagnosis.doctor || {
    id: 1,
    name: "Др. Петрова Анна Ивановна",
    specialty: "Терапевт"
  };

  const handleOpenChat = () => {
    onOpenChange(false); // Close diagnosis dialog
    setChatDrawerOpen(true);
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] animate-fade-in">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-clinic-dark">
              {diagnosis.name}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Дата постановки диагноза: {diagnosis.date}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-3 bg-clinic-light rounded-md animate-fade-in" style={{animationDelay: "100ms"}}>
              <h3 className="text-md font-medium mb-2 flex items-center">
                <User className="w-4 h-4 mr-2 text-clinic-primary" />
                Лечащий врач:
              </h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">{doctorInfo.name}</p>
                  <p className="text-xs text-gray-500">{doctorInfo.specialty}</p>
                </div>
                <Button 
                  size="sm"
                  className="bg-clinic-primary hover:bg-clinic-secondary animate-fade-in hover:scale-105 transition-transform"
                  onClick={handleOpenChat}
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Перейти в чат
                </Button>
              </div>
            </div>
            
            <div className="animate-fade-in" style={{animationDelay: "200ms"}}>
              <h3 className="text-md font-medium mb-2">Текущий статус:</h3>
              <p className="text-sm">{diagnosis.status}</p>
            </div>
            
            <div className="animate-fade-in" style={{animationDelay: "300ms"}}>
              <h3 className="text-md font-medium mb-2">Описание:</h3>
              <p className="text-sm">{diagnosis.description || placeholderText}</p>
            </div>
            
            <div className="animate-fade-in" style={{animationDelay: "400ms"}}>
              <h3 className="text-md font-medium mb-2">Рекомендации:</h3>
              <p className="text-sm">Следуйте назначениям врача. Принимайте прописанные лекарства согласно указаниям. При ухудшении состояния, незамедлительно обратитесь к лечащему врачу.</p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button 
                className="bg-clinic-primary hover:bg-clinic-secondary animate-fade-in hover:scale-105 transition-transform"
                style={{animationDelay: "500ms"}}
              >
                Закрыть
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <ChatDrawer 
        open={chatDrawerOpen}
        onClose={() => setChatDrawerOpen(false)}
      />
    </>
  );
};
