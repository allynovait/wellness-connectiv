
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

// Моковые данные для выбора врача и времени
const mockDoctors = [
  "Иванов Иван Иванович - Терапевт",
  "Петрова Анна Сергеевна - Кардиолог",
  "Сидоров Петр Петрович - Невролог",
  "Козлова Елена Викторовна - Эндокринолог"
];

const mockTimeSlots = [
  "09:00", "09:30", 
  "10:00", "10:30",
  "11:00", "11:30",
  "13:00", "13:30",
  "14:00", "14:30",
  "15:00", "15:30"
];

type BookAppointmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  selectedDate?: Date;
};

export const BookAppointmentDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  selectedDate = new Date()
}: BookAppointmentDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    doctor: "",
    date: selectedDate,
    time: "",
    comment: ""
  });
  
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-clinic-dark">
            Запись на приём
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">ФИО пациента</Label>
            <Input 
              id="name" 
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Иванов Иван Иванович"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Номер телефона</Label>
            <Input 
              id="phone" 
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+7 (900) 123-45-67"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="doctor">Выберите врача</Label>
            <Select 
              value={formData.doctor}
              onValueChange={(value) => handleChange("doctor", value)}
              required
            >
              <SelectTrigger id="doctor">
                <SelectValue placeholder="Выберите врача" />
              </SelectTrigger>
              <SelectContent>
                {mockDoctors.map((doctor, index) => (
                  <SelectItem key={index} value={doctor}>
                    {doctor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Дата приёма</Label>
            <Input 
              value={format(formData.date, "dd.MM.yyyy")}
              readOnly
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">
              Дата выбрана в календаре. Вернитесь к календарю для изменения даты.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Выберите время</Label>
            <Select 
              value={formData.time}
              onValueChange={(value) => handleChange("time", value)}
              required
            >
              <SelectTrigger id="time">
                <SelectValue placeholder="Выберите время" />
              </SelectTrigger>
              <SelectContent>
                {mockTimeSlots.map((time, index) => (
                  <SelectItem key={index} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comment">Комментарий</Label>
            <Input 
              id="comment" 
              value={formData.comment}
              onChange={(e) => handleChange("comment", e.target.value)}
              placeholder="Опишите причину обращения"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Отмена
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              className="bg-clinic-primary hover:bg-clinic-secondary"
            >
              Записаться
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
