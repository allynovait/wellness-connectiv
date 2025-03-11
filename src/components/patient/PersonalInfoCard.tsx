
import { Card, CardContent } from "@/components/ui/card";

type PersonalInfoProps = {
  personalInfo: {
    fullName: string;
    birthDate: string;
    gender: string;
    photo: string;
  };
  medicalInfo: {
    cardNumber: string;
    attachmentDate: string;
    clinic: string;
  };
};

export const PersonalInfoCard = ({ personalInfo, medicalInfo }: PersonalInfoProps) => {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-col">
          <div className="w-full flex justify-center mb-4">
            <img 
              src={personalInfo.photo || "/placeholder.svg"} 
              alt={personalInfo.fullName || "Фото пациента"} 
              className="w-32 h-32 rounded-full object-cover border-2 border-clinic-light"
            />
          </div>
          <div className="space-y-2 mt-2">
            {personalInfo.fullName && (
              <h3 className="text-xl font-semibold text-center">{personalInfo.fullName}</h3>
            )}
            <div className="mt-4 space-y-2">
              <p className="text-gray-600"><span className="font-medium">Дата рождения:</span> {personalInfo.birthDate || "Не указана"}</p>
              <p className="text-gray-600"><span className="font-medium">Пол:</span> {personalInfo.gender || "Не указан"}</p>
              <p className="text-gray-600"><span className="font-medium">Мед. карта:</span> {medicalInfo.cardNumber ? `#${medicalInfo.cardNumber}` : "Не указана"}</p>
              <p className="text-gray-600"><span className="font-medium">Дата прикрепления:</span> {medicalInfo.attachmentDate || "Не указана"}</p>
              <p className="text-gray-600"><span className="font-medium">Поликлиника:</span> {medicalInfo.clinic || "Не указана"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
