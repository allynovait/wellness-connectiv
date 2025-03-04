
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";
import { BookAppointmentDialog } from "@/components/BookAppointmentDialog";
import { useToast } from "@/hooks/use-toast";

// Mock data for appointments
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

export const CalendarTab = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const { toast } = useToast();

  // Filtered appointments for the selected date
  const selectedDateAppointments = mockAppointments.filter(
    appointment => date && appointment.date.toDateString() === date.toDateString()
  );

  const handleAppointmentSubmit = (formData: any) => {
    console.log("Appointment data:", formData);
    toast({
      title: "Запись создана",
      description: `Вы записаны к ${formData.doctor} на ${formData.date.toLocaleDateString()} в ${formData.time}`,
    });
    setAppointmentDialogOpen(false);
  };

  return (
    <div className="space-y-4">
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

      <BookAppointmentDialog 
        open={appointmentDialogOpen} 
        onOpenChange={setAppointmentDialogOpen}
        onSubmit={handleAppointmentSubmit}
        selectedDate={date}
      />
    </div>
  );
};
