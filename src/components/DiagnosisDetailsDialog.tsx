
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DiagnosisDetailsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  diagnosis: {
    id: number;
    date: string;
    name: string;
    status: string;
    description?: string;
  };
};

export const DiagnosisDetailsDialog = ({ 
  open, 
  onOpenChange, 
  diagnosis 
}: DiagnosisDetailsProps) => {
  const placeholderText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vehicula ipsum a arcu cursus vitae congue mauris rhoncus. Aenean et justo at enim facilisis gravida. Sed diam dolor, elementum et lobortis a, consectetur a orci. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec lacinia sapien ut risus fermentum, non luctus massa condimentum. Maecenas pellentesque elit at turpis finibus, in elementum mi tincidunt. Cras ultricies enim quis sollicitudin fermentum. Quisque in sapien non nulla condimentum dictum. Ut interdum tellus vitae justo aliquam pellentesque.";
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-clinic-dark">
            {diagnosis.name}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Дата постановки диагноза: {diagnosis.date}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <h3 className="text-md font-medium mb-2">Текущий статус:</h3>
            <p className="text-sm">{diagnosis.status}</p>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-2">Описание:</h3>
            <p className="text-sm">{diagnosis.description || placeholderText}</p>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-2">Рекомендации:</h3>
            <p className="text-sm">Следуйте назначениям врача. Принимайте прописанные лекарства согласно указаниям. При ухудшении состояния, незамедлительно обратитесь к лечащему врачу.</p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button 
              className="bg-clinic-primary hover:bg-clinic-secondary"
            >
              Закрыть
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
