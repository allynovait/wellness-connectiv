
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Info, User, FileCheck } from "lucide-react";
import { SubmitTestDialog } from "@/components/SubmitTestDialog";
import { TestDetailsDialog } from "@/components/TestDetailsDialog";
import { useToast } from "@/hooks/use-toast";

// Mock data for tests with added details
const mockTests = [{
  id: 1,
  date: "2024-03-10",
  name: "Общий анализ крови",
  status: "Готов",
  results: "Эритроциты: 4.5 10^12/л, Гемоглобин: 140 г/л, Лейкоциты: 6.4 10^9/л, Тромбоциты: 250 10^9/л",
  doctor: {
    id: 1,
    name: "Др. Петрова Анна Ивановна",
    specialty: "Терапевт"
  }
}, {
  id: 2,
  date: "2024-03-05",
  name: "ЭКГ",
  status: "Готов",
  doctor: {
    id: 2,
    name: "Др. Иванов Сергей Михайлович",
    specialty: "Кардиолог"
  }
}];

export const TestsTab = () => {
  const [submitTestDialogOpen, setSubmitTestDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<(typeof mockTests)[0] | null>(null);
  const [testDetailsDialogOpen, setTestDetailsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleTestSubmit = (formData: any) => {
    console.log("Test submission data:", formData);
    toast({
      title: "Запись создана",
      description: `Вы записаны на ${formData.testType} на ${formData.date.toLocaleDateString()}`,
    });
    setSubmitTestDialogOpen(false);
  };

  const handleTestClick = (test: typeof mockTests[0]) => {
    setSelectedTest(test);
    setTestDetailsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Анализы</h2>
        <Button 
          size="sm" 
          className="bg-clinic-primary hover:bg-clinic-secondary"
          onClick={() => setSubmitTestDialogOpen(true)}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Сдать анализы
        </Button>
      </div>
      
      {mockTests.map((test, index) => (
        <Card 
          key={test.id} 
          className="bg-white cursor-pointer hover:shadow-md transition-shadow hover:scale-[1.01] transition-all"
          onClick={() => handleTestClick(test)}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <p className="font-medium">{test.name}</p>
                  <Info className="w-4 h-4 ml-2 text-clinic-primary" />
                </div>
                <p className="text-sm text-gray-500">{test.date}</p>
                <div className="flex items-center mt-1 text-xs text-gray-600">
                  <User className="w-3 h-3 mr-1" />
                  <span>{test.doctor?.name}</span>
                </div>
              </div>
              <Badge variant="outline" className="bg-clinic-light text-clinic-primary">
                {test.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}

      <SubmitTestDialog
        open={submitTestDialogOpen}
        onOpenChange={setSubmitTestDialogOpen}
        onSubmit={handleTestSubmit}
      />

      {selectedTest && (
        <TestDetailsDialog
          open={testDetailsDialogOpen}
          onOpenChange={setTestDetailsDialogOpen}
          test={selectedTest}
        />
      )}
    </div>
  );
};
