
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MessageSquare, FileText, Stethoscope, PlusCircle, Thermometer, Info } from "lucide-react";
import { BookAppointmentDialog } from "@/components/BookAppointmentDialog";
import { SubmitTestDialog } from "@/components/SubmitTestDialog";
import { DiagnosisDetailsDialog } from "@/components/DiagnosisDetailsDialog";
import { useToast } from "@/hooks/use-toast";

// Моковые данные для демонстрации
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

const mockMessages = [{
  id: 1,
  date: "2024-03-15",
  text: "Пожалуйста, продолжайте приём препарата еще 5 дней",
  doctor: "Др. Петрова"
}, {
  id: 2,
  date: "2024-03-14",
  text: "Результаты анализов в норме",
  doctor: "Др. Петрова"
}];

// Моковые данные для приемов
const mockAppointments = [
  {
    id: 1,
    date: new Date(2024, 2, 15), // 2024-03-15
    time: "09:30",
    doctor: "Иванов Иван Иванович - Терапевт",
    reason: "Регулярный осмотр"
  },
  {
    id: 2,
    date: new Date(2024, 2, 20), // 2024-03-20
    time: "14:00",
    doctor: "Петрова Анна Сергеевна - Кардиолог",
    reason: "Проверка давления"
  },
  {
    id: 3,
    date: new Date(2024, 2, 25), // 2024-03-25
    time: "11:00",
    doctor: "Сидоров Петр Петрович - Невролог",
    reason: "Головные боли"
  }
];

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState<"diagnoses" | "tests" | "messages" | "chat" | "calendar">("diagnoses");
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [submitTestDialogOpen, setSubmitTestDialogOpen] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<(typeof mockDiagnoses)[0] | null>(null);
  const [diagnosisDialogOpen, setDiagnosisDialogOpen] = useState(false);
  const { toast } = useToast();
  const [weather, setWeather] = useState<{
    temp: number | null;
    loading: boolean;
  }>({
    temp: null,
    loading: true
  });

  // Filtered appointments for the selected date
  const selectedDateAppointments = mockAppointments.filter(
    appointment => date && appointment.date.toDateString() === date.toDateString()
  );

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch("https://api.openweathermap.org/data/2.5/weather?q=Nizhnevartovsk&appid=8e2f1807b6c17d31d96937638184a98c&units=metric");
        const data = await response.json();
        if (data.main && data.main.temp) {
          setWeather({
            temp: Math.round(data.main.temp),
            loading: false
          });
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Ошибка при загрузке погоды:", error);
        setWeather({
          temp: null,
          loading: false
        });
      }
    };
    fetchWeather();
  }, []);

  const handleAppointmentSubmit = (formData: any) => {
    console.log("Appointment data:", formData);
    toast({
      title: "Запись создана",
      description: `Вы записаны к ${formData.doctor} на ${formData.date.toLocaleDateString()} в ${formData.time}`,
    });
    setAppointmentDialogOpen(false);
  };

  const handleTestSubmit = (formData: any) => {
    console.log("Test submission data:", formData);
    toast({
      title: "Запись создана",
      description: `Вы записаны на ${formData.testType} на ${formData.date.toLocaleDateString()}`,
    });
    setSubmitTestDialogOpen(false);
  };

  const handleDiagnosisClick = (diagnosis: typeof mockDiagnoses[0]) => {
    setSelectedDiagnosis(diagnosis);
    setDiagnosisDialogOpen(true);
  };

  return <div className="min-h-screen bg-clinic-background p-4 max-w-md mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <img src="/lovable-uploads/d200c670-f916-4464-8195-3b9de974c5cd.png" alt="Гиппократ" className="h-8 w-auto object-contain mix-blend-multiply" />
          <div className="flex justify-between items-center w-full">
            <h1 className="text-clinic-dark font-thin text-xs mx-[54px]">
Нижневартовск</h1>
            <div className="flex items-center gap-2 text-clinic-primary">
              
              {weather.loading ? <span className="text-sm">-15°C</span> : weather.temp !== null ? <span className="text-sm font-medium">{weather.temp}°C</span> : <span className="text-sm">--°C</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-clinic-light flex items-center justify-center text-clinic-primary font-semibold">
            ИИ
          </div>
          <div>
            <p className="font-medium text-clinic-dark">Иван Иванов</p>
            <p className="text-sm text-gray-500">Карта пациента #12345</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          <Button variant={activeTab === "diagnoses" ? "default" : "outline"} className={`whitespace-nowrap ${activeTab === "diagnoses" ? "bg-clinic-primary hover:bg-clinic-secondary" : ""}`} onClick={() => setActiveTab("diagnoses")}>
            <FileText className="w-4 h-4 mr-2" />
            Диагнозы
          </Button>
          <Button variant={activeTab === "tests" ? "default" : "outline"} className={`whitespace-nowrap ${activeTab === "tests" ? "bg-clinic-primary hover:bg-clinic-secondary" : ""}`} onClick={() => setActiveTab("tests")}>
            <FileText className="w-4 h-4 mr-2" />
            Анализы
          </Button>
          <Button variant={activeTab === "messages" ? "default" : "outline"} className={`whitespace-nowrap ${activeTab === "messages" ? "bg-clinic-primary hover:bg-clinic-secondary" : ""}`} onClick={() => setActiveTab("messages")}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Сообщения
          </Button>
          <Button variant={activeTab === "calendar" ? "default" : "outline"} className={`whitespace-nowrap ${activeTab === "calendar" ? "bg-clinic-primary hover:bg-clinic-secondary" : ""}`} onClick={() => setActiveTab("calendar")}>
            <CalendarDays className="w-4 h-4 mr-2" />
            Календарь
          </Button>
        </div>

        {activeTab === "diagnoses" && <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Диагнозы</h2>
              <Badge className="bg-clinic-primary">Активные: 2</Badge>
            </div>
            {mockDiagnoses.map(diagnosis => <Card 
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
              </Card>)}
          </div>}

        {activeTab === "tests" && <div className="space-y-4">
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
            {mockTests.map(test => <Card key={test.id} className="bg-white">
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
              </Card>)}
          </div>}

        {activeTab === "messages" && <div className="space-y-4">
            <h2 className="text-xl font-semibold">Сообщения от врача</h2>
            {mockMessages.map(message => <Card key={message.id} className="bg-white">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="font-medium">{message.doctor}</p>
                      <p className="text-sm text-gray-500">{message.date}</p>
                    </div>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </CardContent>
              </Card>)}
          </div>}

        {activeTab === "calendar" && <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Календарь приёмов</h2>
              <Button 
                size="sm" 
                className="bg-clinic-primary hover:bg-clinic-secondary"
                onClick={() => setAppointmentDialogOpen(true)}
              >
                <Stethoscope className="w-4 h-4 mr-2" />
                Записаться
              </Button>
            </div>
            <Card>
              <CardContent className="p-4">
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
              </CardContent>
            </Card>
            
            {date && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-3">
                  Приёмы на {date.toLocaleDateString()}
                </h3>
                
                {selectedDateAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateAppointments.map(appointment => (
                      <Card key={appointment.id} className="bg-white">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <p className="font-medium">{appointment.doctor}</p>
                              <Badge className="bg-clinic-primary">
                                {appointment.time}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700">
                              Причина: {appointment.reason}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-6 bg-white rounded-md border">
                    На выбранную дату приёмов не запланировано
                  </p>
                )}
              </div>
            )}
          </div>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 max-w-md mx-auto">
        <Button className="w-full bg-clinic-primary hover:bg-clinic-secondary">
          <MessageSquare className="w-4 h-4 mr-2" />
          Написать врачу
        </Button>
      </div>

      <BookAppointmentDialog 
        open={appointmentDialogOpen} 
        onOpenChange={setAppointmentDialogOpen}
        onSubmit={handleAppointmentSubmit}
        selectedDate={date}
      />

      <SubmitTestDialog
        open={submitTestDialogOpen}
        onOpenChange={setSubmitTestDialogOpen}
        onSubmit={handleTestSubmit}
      />

      {selectedDiagnosis && (
        <DiagnosisDetailsDialog
          open={diagnosisDialogOpen}
          onOpenChange={setDiagnosisDialogOpen}
          diagnosis={selectedDiagnosis}
        />
      )}
    </div>;
};
export default Index;
