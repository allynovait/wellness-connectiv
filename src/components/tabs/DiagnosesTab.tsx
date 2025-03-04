
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { DiagnosisDetailsDialog } from "@/components/DiagnosisDetailsDialog";

// Mock data for diagnoses
const mockDiagnoses = [{
  id: 1,
  date: "2024-03-15",
  name: "Острый бронхит",
  status: "В процессе лечения"
}, {
  id: 2,
  date: "2024-02-20",
  name: "Гипертония",
  status: "Под наблюдением"
}];

export const DiagnosesTab = () => {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<(typeof mockDiagnoses)[0] | null>(null);
  const [diagnosisDialogOpen, setDiagnosisDialogOpen] = useState(false);

  const handleDiagnosisClick = (diagnosis: typeof mockDiagnoses[0]) => {
    setSelectedDiagnosis(diagnosis);
    setDiagnosisDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Диагнозы</h2>
        <Badge className="bg-clinic-primary">Активные: {mockDiagnoses.length}</Badge>
      </div>
      
      {mockDiagnoses.map(diagnosis => (
        <Card 
          key={diagnosis.id} 
          className="bg-white cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleDiagnosisClick(diagnosis)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <p className="font-medium">{diagnosis.name}</p>
                  <Info className="w-4 h-4 ml-2 text-clinic-primary" />
                </div>
                <p className="text-sm text-gray-500">{diagnosis.date}</p>
              </div>
              <Badge variant="outline" className="bg-clinic-light text-clinic-primary">
                {diagnosis.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}

      {selectedDiagnosis && (
        <DiagnosisDetailsDialog
          open={diagnosisDialogOpen}
          onOpenChange={setDiagnosisDialogOpen}
          diagnosis={selectedDiagnosis}
        />
      )}
    </div>
  );
};
