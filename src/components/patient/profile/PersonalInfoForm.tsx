import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserProfile } from "@/types/auth";

type PersonalInfoFormProps = {
  user: UserProfile | null;
  onSave: (profileData: Partial<UserProfile>) => Promise<boolean>;
  onSuccess?: () => void;
};

export const PersonalInfoForm = ({ user, onSave, onSuccess }: PersonalInfoFormProps) => {
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [birthDate, setBirthDate] = useState(user?.birth_date || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [photo, setPhoto] = useState(user?.photo || "");
  const [cardNumber, setCardNumber] = useState(user?.card_number || "");
  const [attachmentDate, setAttachmentDate] = useState(user?.attachment_date || "");
  const [clinic, setClinic] = useState(user?.clinic || "");
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    try {
      const profileData = {
        full_name: fullName,
        birth_date: birthDate,
        gender,
        photo,
        card_number: cardNumber,
        attachment_date: attachmentDate,
        clinic
      };
      
      console.log("Сохранение профиля с данными:", profileData);
      setSaving(true);
      
      const success = await onSave(profileData);
      
      console.log("Результат сохранения профиля:", success);
      if (success) {
        toast.success("Профиль успешно обновлен");
        onSuccess?.();
      }
    } catch (error: any) {
      console.error("Ошибка при сохранении профиля:", error);
      toast.error(`Ошибка при сохранении профиля: ${error.message || "Неизвестная ошибка"}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">ФИО</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Иванов Иван Иванович"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="birthDate">Дата рождения</Label>
        <Input
          id="birthDate"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          placeholder="01.01.2000"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="gender">Пол</Label>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger id="gender">
            <SelectValue placeholder="Выберите пол" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Мужской">Мужской</SelectItem>
            <SelectItem value="Женский">Женский</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="photo">URL фотографии</Label>
        <Input
          id="photo"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
          placeholder="https://example.com/photo.jpg"
        />
        {photo && (
          <div className="mt-2 flex justify-center">
            <img src={photo} alt="Предпросмотр" className="h-20 w-20 object-cover rounded-full" />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Номер медкарты</Label>
        <Input
          id="cardNumber"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="12345"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="attachmentDate">Дата прикрепления</Label>
        <Input
          id="attachmentDate"
          value={attachmentDate}
          onChange={(e) => setAttachmentDate(e.target.value)}
          placeholder="01.01.2022"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="clinic">Поликлиника</Label>
        <Input
          id="clinic"
          value={clinic}
          onChange={(e) => setClinic(e.target.value)}
          placeholder="Городская поликлиника №1"
        />
      </div>
      
      <Button 
        onClick={handleSaveProfile} 
        className="w-full"
        disabled={saving}
      >
        {saving ? "Сохранение..." : "Сохранить данные"}
      </Button>
    </div>
  );
};
