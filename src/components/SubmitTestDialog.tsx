
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

// Моковые данные для выбора типа анализа
const mockTestTypes = [
  "Общий анализ крови",
  "Биохимический анализ крови",
  "Анализ мочи",
  "Анализ на гормоны",
  "ПЦР-тест",
  "Анализ на COVID-19"
];

const mockLabLocations = [
  "Главная лаборатория - ул. Ленина, 10",
  "Филиал №1 - ул. Мира, 25",
  "Филиал №2 - пр. Победы, 78",
  "Мобильный пункт - ТЦ 'Солнечный'"
];

type SubmitTestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
};

export const SubmitTestDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit 
}: SubmitTestDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    testType: "",
    location: "",
    date: new Date(),
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
            Запись на сдачу анализов
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Заполните форму для записи на сдачу анализов
          </DialogDescription>
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
            <Label htmlFor="testType">Тип анализа</Label>
            <Select 
              value={formData.testType}
              onValueChange={(value) => handleChange("testType", value)}
              required
            >
              <SelectTrigger id="testType">
                <SelectValue placeholder="Выберите тип анализа" />
              </SelectTrigger>
              <SelectContent>
                {mockTestTypes.map((test, index) => (
                  <SelectItem key={index} value={test}>
                    {test}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Пункт сдачи</Label>
            <Select 
              value={formData.location}
              onValueChange={(value) => handleChange("location", value)}
              required
            >
              <SelectTrigger id="location">
                <SelectValue placeholder="Выберите пункт сдачи" />
              </SelectTrigger>
              <SelectContent>
                {mockLabLocations.map((location, index) => (
                  <SelectItem key={index} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Дата сдачи</Label>
            <Input 
              value={format(formData.date, "dd.MM.yyyy")}
              readOnly
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">
              По умолчанию установлена текущая дата. Для изменения, обратитесь к администратору.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comment">Комментарий</Label>
            <Input 
              id="comment" 
              value={formData.comment}
              onChange={(e) => handleChange("comment", e.target.value)}
              placeholder="Дополнительная информация"
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
