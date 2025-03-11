
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserDocuments } from "@/types/auth";

type DocumentsFormProps = {
  userDocuments: UserDocuments | null;
  onSave: (documentData: Partial<UserDocuments>) => Promise<boolean>;
  onSuccess?: () => void;
};

export const DocumentsForm = ({ userDocuments, onSave, onSuccess }: DocumentsFormProps) => {
  const [passportSeries, setPassportSeries] = useState(userDocuments?.passport_series || "");
  const [passportNumber, setPassportNumber] = useState(userDocuments?.passport_number || "");
  const [passportIssuedBy, setPassportIssuedBy] = useState(userDocuments?.passport_issued_by || "");
  const [passportIssuedDate, setPassportIssuedDate] = useState(userDocuments?.passport_issued_date || "");
  const [snils, setSnils] = useState(userDocuments?.snils || "");
  const [inn, setInn] = useState(userDocuments?.inn || "");
  const [saving, setSaving] = useState(false);

  const handleSaveDocuments = async () => {
    try {
      const documentData = {
        passport_series: passportSeries,
        passport_number: passportNumber,
        passport_issued_by: passportIssuedBy,
        passport_issued_date: passportIssuedDate,
        snils,
        inn
      };
      
      console.log("Сохранение документов с данными:", documentData);
      setSaving(true);
      
      const success = await onSave(documentData);
      
      console.log("Результат сохранения документов:", success);
      if (success) {
        toast.success("Документы успешно обновлены");
        onSuccess?.();
      }
    } catch (error: any) {
      console.error("Ошибка при сохранении документов:", error);
      toast.error(`Ошибка при сохранении документов: ${error.message || "Неизвестная ошибка"}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="passportSeries">Серия паспорта</Label>
        <Input
          id="passportSeries"
          value={passportSeries}
          onChange={(e) => setPassportSeries(e.target.value)}
          placeholder="1234"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="passportNumber">Номер паспорта</Label>
        <Input
          id="passportNumber"
          value={passportNumber}
          onChange={(e) => setPassportNumber(e.target.value)}
          placeholder="567890"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="passportIssuedBy">Кем выдан</Label>
        <Input
          id="passportIssuedBy"
          value={passportIssuedBy}
          onChange={(e) => setPassportIssuedBy(e.target.value)}
          placeholder="ОВД Нижневартовска"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="passportIssuedDate">Дата выдачи</Label>
        <Input
          id="passportIssuedDate"
          value={passportIssuedDate}
          onChange={(e) => setPassportIssuedDate(e.target.value)}
          placeholder="01.01.2015"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="snils">СНИЛС</Label>
        <Input
          id="snils"
          value={snils}
          onChange={(e) => setSnils(e.target.value)}
          placeholder="123-456-789 00"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="inn">ИНН</Label>
        <Input
          id="inn"
          value={inn}
          onChange={(e) => setInn(e.target.value)}
          placeholder="1234567890"
        />
      </div>
      
      <Button 
        onClick={handleSaveDocuments} 
        className="w-full"
        disabled={saving}
      >
        {saving ? "Сохранение..." : "Сохранить документы"}
      </Button>
    </div>
  );
};
