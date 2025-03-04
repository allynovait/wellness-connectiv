
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, User } from "lucide-react";
import { DiagnosisDetailsDialog } from "@/components/DiagnosisDetailsDialog";

// Mock data for diagnoses with doctor information
const mockDiagnoses = [{
  id: 1,
  date: "2024-03-15",
  name: "Острый бронхит",
  status: "В процессе лечения",
  doctor: {
    id: 1,
    name: "Др. Петрова Анна Ивановна",
    specialty: "Терапевт"
  }
}, {
  id: 2,
  date: "2024-02-20",
  name: "Гипертония",
  status: "Под наблюдением",
  doctor: {
    id: 2,
    name: "Др. Иванов Сергей Михайлович",
    specialty: "Кардиолог"
  }
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
      
      {mockDiagnoses.map((diagnosis, index) => (
        <Card 
          key={diagnosis.id} 
          className="bg-white cursor-pointer hover:shadow-md transition-shadow hover:scale-[1.01] transition-all"
          onClick={() => handleDiagnosisClick(diagnosis)}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <p className="font-medium">{diagnosis.name}</p>
                  <Info className="w-4 h-4 ml-2 text-clinic-primary" />
                </div>
                <p className="text-sm text-gray-500">{diagnosis.date}</p>
                <div className="flex items-center mt-1 text-xs text-gray-600">
                  <User className="w-3 h-3 mr-1" />
                  <span>{diagnosis.doctor.name}</span>
                </div>
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
