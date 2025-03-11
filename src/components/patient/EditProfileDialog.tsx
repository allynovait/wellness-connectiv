import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type EditProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const EditProfileDialog = ({ open, onOpenChange }: EditProfileDialogProps) => {
  const { user, userDocuments, updateProfile, updateDocuments } = useAuth();
  
  // Personal Info State
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [photo, setPhoto] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [attachmentDate, setAttachmentDate] = useState("");
  const [clinic, setClinic] = useState("");

  // Documents State
  const [passportSeries, setPassportSeries] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [passportIssuedBy, setPassportIssuedBy] = useState("");
  const [passportIssuedDate, setPassportIssuedDate] = useState("");
  const [snils, setSnils] = useState("");
  const [inn, setInn] = useState("");

  // Loading states
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingDocuments, setSavingDocuments] = useState(false);

  // Set initial values when user or userDocuments change
  useEffect(() => {
    if (user) {
      console.log("Setting initial profile values:", user);
      setFullName(user.full_name || "");
      setBirthDate(user.birth_date || "");
      setGender(user.gender || "");
      setPhoto(user.photo || "");
      setCardNumber(user.card_number || "");
      setAttachmentDate(user.attachment_date || "");
      setClinic(user.clinic || "");
    }
    
    if (userDocuments) {
      console.log("Setting initial document values:", userDocuments);
      setPassportSeries(userDocuments.passport_series || "");
      setPassportNumber(userDocuments.passport_number || "");
      setPassportIssuedBy(userDocuments.passport_issued_by || "");
      setPassportIssuedDate(userDocuments.passport_issued_date || "");
      setSnils(userDocuments.snils || "");
      setInn(userDocuments.inn || "");
    } else {
      console.log("No user documents available, using empty values");
    }
  }, [user, userDocuments]);

  const handleSaveProfile = async () => {
    if (!user) {
      console.error("Cannot save profile: No user found");
      return;
    }
    
    try {
      console.log("Saving profile with data:", {
        full_name: fullName,
        birth_date: birthDate,
        gender,
        photo,
        card_number: cardNumber,
        attachment_date: attachmentDate,
        clinic
      });
      setSavingProfile(true);
      
      const success = await updateProfile({
        full_name: fullName,
        birth_date: birthDate,
        gender,
        photo,
        card_number: cardNumber,
        attachment_date: attachmentDate,
        clinic
      });
      
      console.log("Profile save result:", success);
      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveDocuments = async () => {
    if (!user) {
      console.error("Cannot save documents: No user found");
      return;
    }
    
    try {
      const documentData = {
        passport_series: passportSeries,
        passport_number: passportNumber,
        passport_issued_by: passportIssuedBy,
        passport_issued_date: passportIssuedDate,
        snils,
        inn
      };
      
      console.log("Saving documents with data:", documentData);
      setSavingDocuments(true);
      
      const success = await updateDocuments(documentData);
      
      console.log("Documents save result:", success);
      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error saving documents:", error);
    } finally {
      setSavingDocuments(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogTitle className="text-xl font-semibold mb-4">Редактирование профиля</DialogTitle>
        
        <Tabs defaultValue="personal">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="personal">Личные данные</TabsTrigger>
            <TabsTrigger value="documents">Документы</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="space-y-4">
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
              disabled={savingProfile}
            >
              {savingProfile ? "Сохранение..." : "Сохранить данные"}
            </Button>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
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
              disabled={savingDocuments}
            >
              {savingDocuments ? "Сохранение..." : "Сохранить документы"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

