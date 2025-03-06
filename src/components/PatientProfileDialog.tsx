
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PersonalInfoCard } from "./patient/PersonalInfoCard";
import { DocumentsCard } from "./patient/DocumentsCard";
import { VisitsCard } from "./patient/VisitsCard";
import { TestsCard } from "./patient/TestsCard";
import { PaidServicesCard } from "./patient/PaidServicesCard";
import { Button } from "@/components/ui/button";
import { EditProfileDialog } from "./patient/EditProfileDialog";
import { LogOut, Pencil } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PatientData } from "@/types/patient";

type PatientProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PatientProfileDialog({ open, onOpenChange }: PatientProfileDialogProps) {
  const { user, userDocuments, signOut } = useAuth();
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  // Mock data for visits, tests, and services (these would come from API in a real app)
  const recentVisits = [
    { date: "02.03.2024", doctor: "Иванов И.И. - Терапевт", type: "Плановый осмотр" },
    { date: "04.03.2024", doctor: "Петрова А.С. - Кардиолог", type: "Консультация" }
  ];
  
  const recentTests = [
    { date: "01.03.2024", name: "Общий анализ крови", status: "Готов" },
    { date: "03.03.2024", name: "ЭКГ", status: "В обработке" }
  ];
  
  const paidServices = [
    { date: "02.03.2024", service: "Консультация кардиолога", cost: "2500 ₽" },
    { date: "05.03.2024", service: "УЗИ щитовидной железы", cost: "3200 ₽" }
  ];

  // Convert user and userDocuments to the format expected by the components
  const patientData: PatientData = {
    personalInfo: {
      fullName: user?.full_name || "Загрузка...",
      birthDate: user?.birth_date || "Н/Д",
      gender: user?.gender || "Н/Д",
      photo: user?.photo || "/placeholder.svg"
    },
    documents: {
      passport: {
        series: userDocuments?.passport_series || "Н/Д",
        number: userDocuments?.passport_number || "Н/Д",
        issuedBy: userDocuments?.passport_issued_by || "Н/Д",
        issuedDate: userDocuments?.passport_issued_date || "Н/Д"
      },
      snils: userDocuments?.snils || "Н/Д",
      inn: userDocuments?.inn || "Н/Д"
    },
    medicalInfo: {
      cardNumber: user?.card_number || "Н/Д",
      attachmentDate: user?.attachment_date || "Н/Д",
      clinic: user?.clinic || "Н/Д"
    },
    recentVisits,
    recentTests,
    paidServices
  };

  const handleEdit = () => {
    setEditProfileOpen(true);
  };

  const handleLogout = async () => {
    await signOut();
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-full w-full h-full max-h-full rounded-none p-0 flex flex-col overflow-hidden sm:max-w-full sm:rounded-none">
          <div className="flex items-center justify-between bg-clinic-primary text-white p-4">
            <h2 className="text-xl font-medium">Профиль пациента</h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-white border-white hover:text-clinic-primary hover:bg-white"
                onClick={handleEdit}
              >
                <Pencil className="h-4 w-4 mr-1" /> Редактировать
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-1" /> Выйти
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Personal Information */}
            <PersonalInfoCard 
              personalInfo={patientData.personalInfo} 
              medicalInfo={patientData.medicalInfo} 
            />

            {/* Document Information */}
            <DocumentsCard documents={patientData.documents} />

            {/* Recent Doctor Visits */}
            <VisitsCard visits={patientData.recentVisits} />

            {/* Recent Tests */}
            <TestsCard tests={patientData.recentTests} />

            {/* Paid Services */}
            <PaidServicesCard services={patientData.paidServices} />
          </div>
        </DialogContent>
      </Dialog>

      <EditProfileDialog 
        open={editProfileOpen} 
        onOpenChange={setEditProfileOpen} 
      />
    </>
  );
}
