import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

// Mock patient data
const patientData = {
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

const VisitDetailsDialog = ({ open, onOpenChange, visitData }: VisitDetailsProps) => {
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

export function PatientProfileDialog({ open, onOpenChange }: PatientProfileDialogProps) {
  const [visitDialogOpen, setVisitDialogOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<typeof patientData.recentVisits[0] | null>(null);

  const handleVisitClick = (visit: typeof patientData.recentVisits[0]) => {
    setSelectedVisit(visit);
    setVisitDialogOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full w-full h-full max-h-full rounded-none p-0 flex flex-col overflow-hidden sm:max-w-full sm:rounded-none">
        <div className="flex items-center justify-between bg-clinic-primary text-white p-4">
          <h2 className="text-xl font-medium">Профиль пациента</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Personal Information */}
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-col">
                <img 
                  src={patientData.personalInfo.photo} 
                  alt={patientData.personalInfo.fullName} 
                  className="w-full h-auto object-cover rounded-md mb-4 max-h-[200px] object-contain bg-gray-50"
                />
                <div className="space-y-2 mt-2">
                  <h3 className="text-xl font-semibold">{patientData.personalInfo.fullName}</h3>
                  <p className="text-gray-600"><span className="font-medium">Дата рождения:</span> {patientData.personalInfo.birthDate}</p>
                  <p className="text-gray-600"><span className="font-medium">Пол:</span> {patientData.personalInfo.gender}</p>
                  <p className="text-gray-600"><span className="font-medium">Мед. карта:</span> #{patientData.medicalInfo.cardNumber}</p>
                  <p className="text-gray-600"><span className="font-medium">Дата прикрепления:</span> {patientData.medicalInfo.attachmentDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Information */}
          <Card>
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold mb-3">Документы</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Паспорт:</p>
                  <p className="text-gray-600">Серия {patientData.documents.passport.series} Номер {patientData.documents.passport.number}</p>
                  <p className="text-gray-600">Выдан: {patientData.documents.passport.issuedBy}</p>
                  <p className="text-gray-600">Дата выдачи: {patientData.documents.passport.issuedDate}</p>
                </div>
                
                <Separator className="my-2" />
                
                <div>
                  <p className="font-medium">СНИЛС:</p>
                  <p className="text-gray-600">{patientData.documents.snils}</p>
                </div>
                
                <Separator className="my-2" />
                
                <div>
                  <p className="font-medium">ИНН:</p>
                  <p className="text-gray-600">{patientData.documents.inn}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Doctor Visits */}
          <Card>
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold mb-3">История посещений за неделю</h3>
              
              {patientData.recentVisits.length > 0 ? (
                <div className="space-y-3">
                  {patientData.recentVisits.map((visit, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className="flex justify-between items-center bg-gray-50 p-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => handleVisitClick(visit)}
                          >
                            <div>
                              <p className="font-medium">{visit.doctor}</p>
                              <p className="text-sm text-gray-600">{visit.type}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{visit.date}</p>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Нажмите для просмотра деталей</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-2">Нет посещений за последнюю неделю</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Tests */}
          <Card>
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold mb-3">Анализы за неделю</h3>
              
              {patientData.recentTests.length > 0 ? (
                <div className="space-y-3">
                  {patientData.recentTests.map((test, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                      <div>
                        <p className="font-medium">{test.name}</p>
                        <p className="text-sm text-gray-600">Статус: {test.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{test.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-2">Нет анализов за последнюю неделю</p>
              )}
            </CardContent>
          </Card>

          {/* Paid Services */}
          <Card>
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold mb-3">Платные услуги за неделю</h3>
              
              {patientData.paidServices.length > 0 ? (
                <div className="space-y-3">
                  {patientData.paidServices.map((service, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                      <div>
                        <p className="font-medium">{service.service}</p>
                        <p className="text-sm text-gray-600">{service.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-clinic-primary">{service.cost}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-2">Нет платных услуг за последнюю неделю</p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
      
      {selectedVisit && (
        <VisitDetailsDialog
          open={visitDialogOpen}
          onOpenChange={setVisitDialogOpen}
          visitData={selectedVisit}
        />
      )}
    </Dialog>
  );
}
