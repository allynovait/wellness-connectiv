
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  MessageSquare,
  FileText,
  Stethoscope,
  PlusCircle,
} from "lucide-react";

// Моковые данные для демонстрации
const mockDiagnoses = [
  { id: 1, date: "2024-03-15", name: "Острый бронхит", status: "В процессе лечения" },
  { id: 2, date: "2024-02-20", name: "Гипертония", status: "Под наблюдением" },
];

const mockTests = [
  { id: 1, date: "2024-03-10", name: "Общий анализ крови", status: "Готов" },
  { id: 2, date: "2024-03-05", name: "ЭКГ", status: "Готов" },
];

const mockMessages = [
  { id: 1, date: "2024-03-15", text: "Пожалуйста, продолжайте приём препарата еще 5 дней", doctor: "Др. Петрова" },
  { id: 2, date: "2024-03-14", text: "Результаты анализов в норме", doctor: "Др. Петрова" },
];

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState<
    "diagnoses" | "tests" | "messages" | "chat" | "calendar"
  >("diagnoses");

  return (
    <div className="min-h-screen bg-clinic-background p-4 max-w-md mx-auto">
      {/* Верхняя панель с логотипом и информацией о пациенте */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <img 
            src="/lovable-uploads/d200c670-f916-4464-8195-3b9de974c5cd.png" 
            alt="Гиппократ" 
            className="h-8 w-auto object-contain mix-blend-multiply"
          />
          <h1 className="text-2xl font-bold text-clinic-dark">Гиппократ</h1>
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

      {/* Основной контент */}
      <div className="space-y-6">
        {/* Навигация */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          <Button
            variant={activeTab === "diagnoses" ? "default" : "outline"}
            className={`whitespace-nowrap ${
              activeTab === "diagnoses" ? "bg-clinic-primary hover:bg-clinic-secondary" : ""
            }`}
            onClick={() => setActiveTab("diagnoses")}
          >
            <FileText className="w-4 h-4 mr-2" />
            Диагнозы
          </Button>
          <Button
            variant={activeTab === "tests" ? "default" : "outline"}
            className={`whitespace-nowrap ${
              activeTab === "tests" ? "bg-clinic-primary hover:bg-clinic-secondary" : ""
            }`}
            onClick={() => setActiveTab("tests")}
          >
            <FileText className="w-4 h-4 mr-2" />
            Анализы
          </Button>
          <Button
            variant={activeTab === "messages" ? "default" : "outline"}
            className={`whitespace-nowrap ${
              activeTab === "messages" ? "bg-clinic-primary hover:bg-clinic-secondary" : ""
            }`}
            onClick={() => setActiveTab("messages")}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Сообщения
          </Button>
          <Button
            variant={activeTab === "calendar" ? "default" : "outline"}
            className={`whitespace-nowrap ${
              activeTab === "calendar" ? "bg-clinic-primary hover:bg-clinic-secondary" : ""
            }`}
            onClick={() => setActiveTab("calendar")}
          >
            <CalendarDays className="w-4 h-4 mr-2" />
            Календарь
          </Button>
        </div>

        {/* Контент вкладок */}
        {activeTab === "diagnoses" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Диагнозы</h2>
              <Badge className="bg-clinic-primary">Активные: 2</Badge>
            </div>
            {mockDiagnoses.map((diagnosis) => (
              <Card key={diagnosis.id} className="bg-white">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{diagnosis.name}</p>
                      <p className="text-sm text-gray-500">{diagnosis.date}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="bg-clinic-light text-clinic-primary"
                    >
                      {diagnosis.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "tests" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Анализы</h2>
              <Button size="sm" className="bg-clinic-primary hover:bg-clinic-secondary">
                <PlusCircle className="w-4 h-4 mr-2" />
                Сдать анализы
              </Button>
            </div>
            {mockTests.map((test) => (
              <Card key={test.id} className="bg-white">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{test.name}</p>
                      <p className="text-sm text-gray-500">{test.date}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="bg-clinic-light text-clinic-primary"
                    >
                      {test.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "messages" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Сообщения от врача</h2>
            {mockMessages.map((message) => (
              <Card key={message.id} className="bg-white">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="font-medium">{message.doctor}</p>
                      <p className="text-sm text-gray-500">{message.date}</p>
                    </div>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Календарь приёмов</h2>
              <Button size="sm" className="bg-clinic-primary hover:bg-clinic-secondary">
                <Stethoscope className="w-4 h-4 mr-2" />
                Записаться
              </Button>
            </div>
            <Card>
              <CardContent className="p-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Нижняя панель быстрых действий */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 max-w-md mx-auto">
        <Button className="w-full bg-clinic-primary hover:bg-clinic-secondary">
          <MessageSquare className="w-4 h-4 mr-2" />
          Написать врачу
        </Button>
      </div>
    </div>
  );
};

export default Index;
