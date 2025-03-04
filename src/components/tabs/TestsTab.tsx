
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { SubmitTestDialog } from "@/components/SubmitTestDialog";
import { useToast } from "@/hooks/use-toast";

// Mock data for tests
const mockTests = [{
  id: 1,
  date: "2024-03-10",
  name: "Общий анализ крови",
  status: "Готов"
}, {
  id: 2,
  date: "2024-03-05",
  name: "ЭКГ",
  status: "Готов"
}];

export const TestsTab = () => {
  const [submitTestDialogOpen, setSubmitTestDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleTestSubmit = (formData: any) => {
    console.log("Test submission data:", formData);
    toast({
      title: "Запись создана",
      description: `Вы записаны на ${formData.testType} на ${formData.date.toLocaleDateString()}`,
    });
    setSubmitTestDialogOpen(false);
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
      
      {mockTests.map(test => (
        <Card key={test.id} className="bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{test.name}</p>
                <p className="text-sm text-gray-500">{test.date}</p>
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
    </div>
  );
};
