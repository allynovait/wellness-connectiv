
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type VisitDetailsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visitData: {
    date: string;
    doctor: string;
    type: string;
    details?: string;
  };
};

export const VisitDetailsDialog = ({ open, onOpenChange, visitData }: VisitDetailsProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Детали посещения</h2>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="space-y-4 mt-4">
          <div className="bg-clinic-light p-4 rounded-md">
            <p className="font-medium">{visitData.doctor}</p>
            <div className="flex justify-between mt-1">
              <p className="text-sm text-gray-600">{visitData.type}</p>
              <p className="text-sm font-medium">{visitData.date}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-2">Заключение врача:</h3>
            <p className="text-sm">{visitData.details || "Пациент осмотрен. Состояние удовлетворительное. Даны рекомендации по лечению и профилактике. Назначены анализы для уточнения состояния здоровья."}</p>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-2">Назначения:</h3>
            <p className="text-sm">- Общий анализ крови</p>
            <p className="text-sm">- Консультация узкого специалиста</p>
            <p className="text-sm">- Контрольный осмотр через 2 недели</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
