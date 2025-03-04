
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, FileCheck } from "lucide-react";
import { useState } from "react";

type TestDetailsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  test: {
    id: number;
    date: string;
    name: string;
    status: string;
    results?: string;
    doctor?: {
      id: number;
      name: string;
      specialty: string;
    };
  };
};

export const TestDetailsDialog = ({ 
  open, 
  onOpenChange, 
  test 
}: TestDetailsProps) => {
  const placeholderText = "Общий анализ крови показал следующие результаты: Эритроциты: 4.5 10^12/л, Гемоглобин: 140 г/л, Лейкоциты: 6.4 10^9/л, Тромбоциты: 250 10^9/л. Все показатели в пределах нормы.";
  
  // Default doctor information if not provided
  const doctorInfo = test.doctor || {
    id: 1,
    name: "Др. Петрова Анна Ивановна",
    specialty: "Терапевт"
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-clinic-dark">
            {test.name}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Дата анализа: {test.date}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="p-3 bg-clinic-light rounded-md animate-fade-in" style={{animationDelay: "100ms"}}>
            <h3 className="text-md font-medium mb-2 flex items-center">
              <User className="w-4 h-4 mr-2 text-clinic-primary" />
              Ответственный врач:
            </h3>
            <div>
              <p className="text-sm">{doctorInfo.name}</p>
              <p className="text-xs text-gray-500">{doctorInfo.specialty}</p>
            </div>
          </div>
          
          <div className="animate-fade-in" style={{animationDelay: "200ms"}}>
            <h3 className="text-md font-medium mb-2">Статус:</h3>
            <p className="text-sm">{test.status}</p>
          </div>
          
          <div className="animate-fade-in" style={{animationDelay: "300ms"}}>
            <h3 className="text-md font-medium mb-2">Результаты:</h3>
            <p className="text-sm">{test.results || placeholderText}</p>
          </div>
          
          <div className="animate-fade-in" style={{animationDelay: "400ms"}}>
            <h3 className="text-md font-medium mb-2">Заключение:</h3>
            <p className="text-sm">Показатели в пределах нормы. Рекомендуется повторный анализ через 6 месяцев в рамках планового обследования.</p>
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
  );
};
