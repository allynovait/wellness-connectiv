
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PersonalInfoCard } from "./patient/PersonalInfoCard";
import { DocumentsCard } from "./patient/DocumentsCard";
import { VisitsCard } from "./patient/VisitsCard";
import { TestsCard } from "./patient/TestsCard";
import { PaidServicesCard } from "./patient/PaidServicesCard";
import { PatientData } from "@/types/patient";

// Mock patient data
const patientData: PatientData = {
  personalInfo: {
    fullName: "Иванов Иван Иванович",
    birthDate: "15.05.1985",
    gender: "Мужской",
    photo: "/placeholder.svg"
  },
  documents: {
    passport: {
      series: "1234",
      number: "567890",
      issuedBy: "ОВД Нижневартовска",
      issuedDate: "20.06.2005"
    },
    snils: "123-456-789 00",
    inn: "1234567890"
  },
  medicalInfo: {
    cardNumber: "12345",
    attachmentDate: "10.01.2020",
    clinic: "Городская поликлиника №1"
  },
  recentVisits: [
    { date: "02.03.2024", doctor: "Иванов И.И. - Терапевт", type: "Плановый осмотр" },
    { date: "04.03.2024", doctor: "Петрова А.С. - Кардиолог", type: "Консультация" }
  ],
  recentTests: [
    { date: "01.03.2024", name: "Общий анализ крови", status: "Готов" },
    { date: "03.03.2024", name: "ЭКГ", status: "В обработке" }
  ],
  paidServices: [
    { date: "02.03.2024", service: "Консультация кардиолога", cost: "2500 ₽" },
    { date: "05.03.2024", service: "УЗИ щитовидной железы", cost: "3200 ₽" }
  ]
};

type PatientProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PatientProfileDialog({ open, onOpenChange }: PatientProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full w-full h-full max-h-full rounded-none p-0 flex flex-col overflow-hidden sm:max-w-full sm:rounded-none">
        <div className="flex items-center justify-between bg-clinic-primary text-white p-4">
          <h2 className="text-xl font-medium">Профиль пациента</h2>
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
  );
}
